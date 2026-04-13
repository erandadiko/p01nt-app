
import { PrismaClient, Prisma } from "@prisma/client";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ExportPayload = {
  exportedAt: string;
  source: string;
  counts: {
    teams: number;
    players: number;
    matches: number;
  };
  teams: Prisma.TeamUncheckedCreateInput[];
  players: Prisma.PlayerUncheckedCreateInput[];
  matches: Prisma.MatchUncheckedCreateInput[];
};

function cleanJson(
  value: Prisma.JsonValue | null | undefined
): Prisma.InputJsonValue {
  return (value ?? {}) as Prisma.InputJsonValue;
}

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

function resolveLocalDatabaseUrl(): string {
  const explicitLocal =
    process.env.LOCAL_DATABASE_URL || process.env.LOCALHOST_DATABASE_URL;
  if (explicitLocal) return explicitLocal;

  const fallback = process.env.DATABASE_URL;
  if (!fallback) {
    throw new Error(
      "No DB URL found. Set LOCAL_DATABASE_URL (recommended) or DATABASE_URL."
    );
  }

  if (!/localhost|127\.0\.0\.1/i.test(fallback)) {
    throw new Error(
      "DATABASE_URL does not point to localhost. Set LOCAL_DATABASE_URL to your local Postgres URL before exporting."
    );
  }

  return fallback;
}

async function main() {
  loadEnvFromRoot();

  const localDatabaseUrl = resolveLocalDatabaseUrl();
  const outputPath = path.resolve(__dirname, "data.json");

  console.log("Starting export...");
  console.log(`Source DB: ${localDatabaseUrl.replace(/:[^:@/]+@/, ":***@")}`);

  const localPrisma = new PrismaClient({
    datasources: {
      db: { url: localDatabaseUrl },
    },
  });

  try {
    console.log("Fetching teams...");
    const rawTeams = await localPrisma.team.findMany({
      orderBy: { id: "asc" },
    });
    const teams: Prisma.TeamUncheckedCreateInput[] = rawTeams.map((team) => ({
      ...team,
      stats: cleanJson(team.stats),
    }));
    console.log(`Fetched ${teams.length} teams.`);

    console.log("Fetching players...");
    const rawPlayers = await localPrisma.player.findMany({
      orderBy: { id: "asc" },
    });
    const players: Prisma.PlayerUncheckedCreateInput[] = rawPlayers.map(
      (player) => ({
        ...player,
        stats: cleanJson(player.stats),
      })
    );
    console.log(`Fetched ${players.length} players.`);

    console.log("Fetching matches...");
    const rawMatches = await localPrisma.match.findMany({
      orderBy: { id: "asc" },
    });
    const matches: Prisma.MatchUncheckedCreateInput[] = rawMatches.map(
      (match) => ({
        ...match,
      })
    );
    console.log(`Fetched ${matches.length} matches.`);

    const payload: ExportPayload = {
      exportedAt: new Date().toISOString(),
      source: "local",
      counts: {
        teams: teams.length,
        players: players.length,
        matches: matches.length,
      },
      teams,
      players,
      matches,
    };

    writeFileSync(outputPath, JSON.stringify(payload, null, 2), "utf8");
    console.log(`Export completed. File written to: ${outputPath}`);
  } finally {
    await localPrisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Export failed:", error);
  process.exit(1);
});
