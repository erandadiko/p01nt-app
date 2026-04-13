import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Prisma, Sport } from '@prisma/client';

const VALID_GENDERS = ['MALE', 'FEMALE'] as const;
const VALID_SPORTS = Object.values(Sport);

function normalizeGender(value: unknown): 'MALE' | 'FEMALE' | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toUpperCase();
  if (normalized === 'M') {
    return 'MALE';
  }
  if (normalized === 'F') {
    return 'FEMALE';
  }
  if (VALID_GENDERS.includes(normalized as (typeof VALID_GENDERS)[number])) {
    return normalized as 'MALE' | 'FEMALE';
  }

  return null;
}

function parseStats(value: unknown): Prisma.InputJsonValue {
  if (value === undefined || value === null || value === '') {
    return {};
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Prisma.InputJsonValue;
      }
      return {};
    } catch {
      return {};
    }
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Prisma.InputJsonValue;
  }

  return {};
}

async function resolveTeamId(teamId: unknown): Promise<number | null> {
  if (teamId === undefined || teamId === null || teamId === '') {
    return null;
  }

  const parsedTeamId =
    typeof teamId === 'number' ? teamId : Number.parseInt(String(teamId), 10);
  if (!Number.isFinite(parsedTeamId) || parsedTeamId <= 0) {
    throw new Error('teamId must be a valid positive number');
  }

  const existingTeam = await prisma.team.findUnique({
    where: { id: parsedTeamId },
    select: { id: true },
  });
  if (!existingTeam) {
    throw new Error('Invalid relation (teamId does not exist)');
  }

  return parsedTeamId;
}

function prismaErrorResponse(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Duplicate entry' }, { status: 409 });
    }
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid relation (teamId does not exist)' },
        { status: 400 }
      );
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
  }

  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

async function syncPlayersIdSequence(): Promise<void> {
  await prisma.$executeRawUnsafe(`
    SELECT setval(
      pg_get_serial_sequence('players','id'),
      COALESCE((SELECT MAX(id) FROM players), 0) + 1,
      false
    );
  `);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sport = searchParams.get('sport') as Sport | null;
    const teamId = searchParams.get('teamId');
    const search = searchParams.get('search');
    const gender = normalizeGender(searchParams.get('gender'));
    const rawLimit = searchParams.get('limit');
    const rawOffset = searchParams.get('offset');
    const fetchAll = searchParams.get('fetchAll') === 'true';
    const limit = rawLimit ? Number.parseInt(rawLimit, 10) : 20;
    const offset = rawOffset ? Number.parseInt(rawOffset, 10) : 0;

    const where: Record<string, unknown> = {};
    
    if (sport) {
      where.sport = sport;
    }
    if (teamId) {
      where.teamId = parseInt(teamId);
    }
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }
    if (gender) {
      where.gender = gender;
    }

    const [players, total] = await Promise.all([
      prisma.player.findMany({
        where,
        include: {
          team: {
            select: {
              id: true,
              name: true,
              federation: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        ...(fetchAll
          ? {}
          : {
              take: Number.isFinite(limit) && limit > 0 ? limit : 20,
              skip: Number.isFinite(offset) && offset >= 0 ? offset : 0,
            }),
        orderBy: { name: 'asc' },
      }),
      prisma.player.count({ where }),
    ]);

    const normalizedPlayers = players.map((player) => {
      const normalizedPlayerGender = normalizeGender(player.gender);
      if (player.gender !== null && normalizedPlayerGender === null) {
        console.log('Legacy invalid player gender in GET response', {
          id: player.id,
          name: player.name,
          gender: player.gender,
        });
      }

      return {
        ...player,
        gender: normalizedPlayerGender,
      };
    });

    return NextResponse.json({
      players: normalizedPlayers,
      pagination: {
        total,
        limit: fetchAll ? total : Number.isFinite(limit) && limit > 0 ? limit : 20,
        offset: fetchAll ? 0 : Number.isFinite(offset) && offset >= 0 ? offset : 0,
        hasMore: offset + normalizedPlayers.length < total,
      },
    });
  } catch (error) {
    console.error('Get players error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = (await request.json()) as Record<string, unknown>;
    const { id: _ignoredId, name, age, gender, sport, position, teamId, stats } = rawBody;
    const normalizedGender = normalizeGender(gender);
    const normalizedSport = typeof sport === 'string' ? sport.trim().toLowerCase() : '';
    const normalizedStats = parseStats(stats);

    void _ignoredId;

    if (typeof name !== 'string' || name.trim().length === 0 || !normalizedSport) {
      return NextResponse.json(
        { error: 'Name and sport are required' },
        { status: 400 }
      );
    }

    if (!VALID_SPORTS.includes(normalizedSport as Sport)) {
      return NextResponse.json(
        { error: `Sport must be one of: ${VALID_SPORTS.join(', ')}` },
        { status: 400 }
      );
    }

    if (gender && !normalizedGender) {
      return NextResponse.json(
        { error: 'Gender must be MALE or FEMALE' },
        { status: 400 }
      );
    }

    let resolvedTeamId: number | null = null;
    try {
      resolvedTeamId = await resolveTeamId(teamId);
    } catch (validationError) {
      return NextResponse.json(
        { error: validationError instanceof Error ? validationError.message : 'Invalid teamId' },
        { status: 400 }
      );
    }

    const playerData = {
      name: name.trim(),
      age: typeof age === 'number' ? age : null,
      gender: normalizedGender,
      sport: normalizedSport as Sport,
      position: typeof position === 'string' ? position : null,
      teamId: resolvedTeamId,
      stats: normalizedStats,
    };

    let player;
    try {
      player = await prisma.player.create({
        data: playerData,
        include: {
          team: true,
        },
      });
    } catch (error) {
      // Self-heal after bulk imports that leave the autoincrement sequence behind MAX(id).
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        await syncPlayersIdSequence();
        player = await prisma.player.create({
          data: playerData,
          include: {
            team: true,
          },
        });
      } else {
        throw error;
      }
    }

    console.log('Player created', { id: player.id, name: player.name, gender: player.gender });

    return NextResponse.json({ player }, { status: 201 });
  } catch (error) {
    console.error('Create player error:', error);
    return prismaErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, age, gender, position, teamId, stats } = body;
    const normalizedGender = gender === null ? null : normalizeGender(gender);

    if (!id) {
      return NextResponse.json(
        { error: 'Player id is required' },
        { status: 400 }
      );
    }

    if (gender !== undefined && gender !== null && !normalizedGender) {
      return NextResponse.json(
        { error: 'Gender must be MALE or FEMALE' },
        { status: 400 }
      );
    }

    const player = await prisma.player.update({
      where: { id: Number(id) },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(age !== undefined ? { age } : {}),
        ...(position !== undefined ? { position } : {}),
        ...(teamId !== undefined ? { teamId } : {}),
        ...(stats !== undefined ? { stats } : {}),
        ...(gender !== undefined ? { gender: normalizedGender } : {}),
      },
    });

    console.log('Player updated', { id: player.id, gender: player.gender });
    return NextResponse.json({ player });
  } catch (error) {
    console.error('Update player error:', error);
    return prismaErrorResponse(error);
  }
}
