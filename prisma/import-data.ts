import { PrismaClient, Prisma } from "@prisma/client";
import { existsSync, readFileSync } from "node:fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ImportPayload = {
  exportedAt: string;
  counts?: {
    teams?: number;
    players?: number;
    matches?: number;
  };
  teams: Prisma.TeamUncheckedCreateInput[];
  players: Prisma.PlayerUncheckedCreateInput[];
  matches: Prisma.MatchUncheckedCreateInput[];
};

type Counters = {
  created: number;
  skippedExisting: number;
  skippedConflicts: number;
  skippedMissingDependencies: number;
  failed: number;
};

function loadEnvFromRoot(): void {
  const envPath = path.resolve(__dirname, "..", ".env");
  if (!existsSync(envPath)) return;

  const envFile = readFileSync(envPath, "utf8");
  for (const rawLine of envFile.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) continue;
    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();
    value = value.replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function assertNeonDatabaseUrl(databaseUrl: string): void {
  const isLikelyLocal = /localhost|127\.0\.0\.1/i.test(databaseUrl);
  if (isLikelyLocal) {
    throw new Error(
      "Safety stop: DATABASE_URL looks local. Set DATABASE_URL to Neon before running import."
    );
  }
}

function loadPayload(payloadPath: string): ImportPayload {
  if (!existsSync(payloadPath)) {
    throw new Error(`Data file not found: ${payloadPath}`);
  }

  const parsed = JSON.parse(readFileSync(payloadPath, "utf8")) as ImportPayload;
  if (
    !parsed ||
    !Array.isArray(parsed.teams) ||
    !Array.isArray(parsed.players) ||
    !Array.isArray(parsed.matches)
  ) {
    throw new Error("Invalid data.json format.");
  }

  return parsed;
}

function freshCounters(): Counters {
  return {
    created: 0,
    skippedExisting: 0,
    skippedConflicts: 0,
    skippedMissingDependencies: 0,
    failed: 0,
  };
}

async function importTeams(
  prisma: PrismaClient,
  teams: Prisma.TeamUncheckedCreateInput[]
): Promise<Counters> {
  const counters = freshCounters();

  console.log(`\n[1/3] Importing teams (${teams.length})...`);
  for (const team of teams) {
    try {
      const existsById = await prisma.team.findUnique({ where: { id: team.id } });
      if (existsById) {
        counters.skippedExisting += 1;
        continue;
      }

      const conflictTrainer = await prisma.team.findUnique({
        where: { trainerId: team.trainerId },
      });
      if (conflictTrainer) {
        counters.skippedConflicts += 1;
        console.warn(
          `Team ${team.id} skipped: trainerId ${team.trainerId} already used by team ${conflictTrainer.id}.`
        );
        continue;
      }

      const [federationExists, trainerExists] = await Promise.all([
        prisma.federation.findUnique({ where: { id: team.federationId } }),
        prisma.user.findUnique({ where: { id: team.trainerId } }),
      ]);

      if (!federationExists || !trainerExists) {
        counters.skippedMissingDependencies += 1;
        console.warn(
          `Team ${team.id} skipped: missing federation (${team.federationId}) or trainer (${team.trainerId}).`
        );
        continue;
      }

      await prisma.team.create({ data: team });
      counters.created += 1;
    } catch (error) {
      counters.failed += 1;
      console.error(`Team ${team.id} failed:`, error);
    }
  }

  return counters;
}

async function importPlayers(
  prisma: PrismaClient,
  players: Prisma.PlayerUncheckedCreateInput[]
): Promise<Counters> {
  const counters = freshCounters();

  console.log(`\n[2/3] Importing players (${players.length})...`);
  for (const player of players) {
    try {
      const existsById = await prisma.player.findUnique({
        where: { id: player.id },
      });
      if (existsById) {
        counters.skippedExisting += 1;
        continue;
      }

      if (player.userId !== null && player.userId !== undefined) {
        const conflictUser = await prisma.player.findUnique({
          where: { userId: player.userId },
        });
        if (conflictUser) {
          counters.skippedConflicts += 1;
          console.warn(
            `Player ${player.id} skipped: userId ${player.userId} already used by player ${conflictUser.id}.`
          );
          continue;
        }
      }

      const teamExists =
        player.teamId === null || player.teamId === undefined
          ? true
          : Boolean(await prisma.team.findUnique({ where: { id: player.teamId } }));
      const userExists =
        player.userId === null || player.userId === undefined
          ? true
          : Boolean(await prisma.user.findUnique({ where: { id: player.userId } }));

      if (!teamExists || !userExists) {
        counters.skippedMissingDependencies += 1;
        console.warn(
          `Player ${player.id} skipped: missing team (${player.teamId ?? "null"}) or user (${player.userId ?? "null"}).`
        );
        continue;
      }

      await prisma.player.create({ data: player });
      counters.created += 1;
    } catch (error) {
      counters.failed += 1;
      console.error(`Player ${player.id} failed:`, error);
    }
  }

  return counters;
}

async function importMatches(
  prisma: PrismaClient,
  matches: Prisma.MatchUncheckedCreateInput[]
): Promise<Counters> {
  const counters = freshCounters();

  console.log(`\n[3/3] Importing matches (${matches.length})...`);
  for (const match of matches) {
    try {
      const existsById = await prisma.match.findUnique({ where: { id: match.id } });
      if (existsById) {
        counters.skippedExisting += 1;
        continue;
      }

      const [homeExists, awayExists] = await Promise.all([
        prisma.team.findUnique({ where: { id: match.team1Id } }),
        prisma.team.findUnique({ where: { id: match.team2Id } }),
      ]);

      if (!homeExists || !awayExists) {
        counters.skippedMissingDependencies += 1;
        console.warn(
          `Match ${match.id} skipped: missing team1 (${match.team1Id}) or team2 (${match.team2Id}).`
        );
        continue;
      }

      await prisma.match.create({ data: match });
      counters.created += 1;
    } catch (error) {
      counters.failed += 1;
      console.error(`Match ${match.id} failed:`, error);
    }
  }

  return counters;
}

function logCounters(label: string, counters: Counters): void {
  console.log(`${label}
  created: ${counters.created}
  skippedExisting: ${counters.skippedExisting}
  skippedConflicts: ${counters.skippedConflicts}
  skippedMissingDependencies: ${counters.skippedMissingDependencies}
  failed: ${counters.failed}`);
}

async function main() {
  loadEnvFromRoot();

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing.");
  }
  assertNeonDatabaseUrl(databaseUrl);

  const payloadPath = path.resolve(__dirname, "data.json");
  const payload = loadPayload(payloadPath);

  console.log("Starting import into production database...");
  console.log(`Target DB: ${databaseUrl.replace(/:[^:@/]+@/, ":***@")}`);
  console.log(`Reading data from: ${payloadPath}`);
  console.log(`Export timestamp: ${payload.exportedAt}`);

  const prisma = new PrismaClient();
  try {
    const teamCounters = await importTeams(prisma, payload.teams);
    const playerCounters = await importPlayers(prisma, payload.players);
    const matchCounters = await importMatches(prisma, payload.matches);

    console.log("\nImport finished.");
    logCounters("Teams:", teamCounters);
    logCounters("Players:", playerCounters);
    logCounters("Matches:", matchCounters);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Import failed:", error);
  process.exit(1);
});
