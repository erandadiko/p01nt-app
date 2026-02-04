import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Federation, Sport } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const federation = searchParams.get('federation') as Federation | null;
    const sport = searchParams.get('sport') as Sport | null;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};
    
    if (federation) {
      where.federation = federation;
    }
    if (sport) {
      where.sport = sport;
    }

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        include: {
          players: {
            select: {
              id: true,
              name: true,
              position: true,
            },
          },
          trainer: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: { players: true },
          },
        },
        take: limit,
        skip: offset,
        orderBy: { name: 'asc' },
      }),
      prisma.team.count({ where }),
    ]);

    return NextResponse.json({
      teams,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + teams.length < total,
      },
    });
  } catch (error) {
    console.error('Get teams error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, sport, federation, logoUrl } = body;

    if (!name || !sport || !federation) {
      return NextResponse.json(
        { error: 'Name, sport, and federation are required' },
        { status: 400 }
      );
    }

    const team = await prisma.team.create({
      data: {
        name,
        sport: sport as Sport,
        federation: federation as Federation,
        logoUrl,
      },
    });

    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error('Create team error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
