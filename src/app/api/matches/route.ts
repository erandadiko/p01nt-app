import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const federation = searchParams.get('federation');
    const status = searchParams.get('status');
    const upcoming = searchParams.get('upcoming') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};
    
    if (federation) {
      where.federation = federation;
    }
    if (status) {
      where.status = status;
    }
    if (upcoming) {
      where.date = { gte: new Date() };
    }

    const [matches, total] = await Promise.all([
      prisma.match.findMany({
        where,
        include: {
          team1: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
            },
          },
          team2: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: { date: upcoming ? 'asc' : 'desc' },
      }),
      prisma.match.count({ where }),
    ]);

    return NextResponse.json({
      matches,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + matches.length < total,
      },
    });
  } catch (error) {
    console.error('Get matches error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { team1Id, team2Id, date, federation, venue } = body;

    if (!team1Id || !team2Id || !date || !federation) {
      return NextResponse.json(
        { error: 'team1Id, team2Id, date, and federation are required' },
        { status: 400 }
      );
    }

    const match = await prisma.match.create({
      data: {
        team1Id,
        team2Id,
        date: new Date(date),
        federation,
        venue,
        status: 'scheduled',
      },
      include: {
        team1: true,
        team2: true,
      },
    });

    return NextResponse.json({ match }, { status: 201 });
  } catch (error) {
    console.error('Create match error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
