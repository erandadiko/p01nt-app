import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Sport } from '@prisma/client';

const VALID_GENDERS = ['MALE', 'FEMALE'] as const;

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sport = searchParams.get('sport') as Sport | null;
    const teamId = searchParams.get('teamId');
    const search = searchParams.get('search');
    const gender = normalizeGender(searchParams.get('gender'));
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

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
        take: limit,
        skip: offset,
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
        limit,
        offset,
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
    const body = await request.json();
    const { name, age, gender, sport, position, teamId, stats } = body;
    const normalizedGender = normalizeGender(gender);

    if (!name || !sport) {
      return NextResponse.json(
        { error: 'Name and sport are required' },
        { status: 400 }
      );
    }

    if (gender && !normalizedGender) {
      return NextResponse.json(
        { error: 'Gender must be MALE or FEMALE' },
        { status: 400 }
      );
    }

    const player = await prisma.player.create({
      data: {
        name,
        age,
        gender: normalizedGender,
        sport: sport as Sport,
        position,
        teamId,
        stats,
      },
      include: {
        team: true,
      },
    });

    console.log('Player created', { id: player.id, name: player.name, gender: player.gender });

    return NextResponse.json({ player }, { status: 201 });
  } catch (error) {
    console.error('Create player error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
