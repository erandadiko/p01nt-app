import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Sport } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sport = searchParams.get('sport') as Sport | null;
    const teamId = searchParams.get('teamId');
    const search = searchParams.get('search');
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

    const [players, total] = await Promise.all([
      prisma.player.findMany({
        where,
        include: {
          team: {
            select: {
              id: true,
              name: true,
              federation: true,
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: { name: 'asc' },
      }),
      prisma.player.count({ where }),
    ]);

    return NextResponse.json({
      players,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + players.length < total,
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

    if (!name || !sport) {
      return NextResponse.json(
        { error: 'Name and sport are required' },
        { status: 400 }
      );
    }

    const player = await prisma.player.create({
      data: {
        name,
        age,
        gender,
        sport: sport as Sport,
        position,
        teamId,
        stats,
      },
      include: {
        team: true,
      },
    });

    return NextResponse.json({ player }, { status: 201 });
  } catch (error) {
    console.error('Create player error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
