import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const federation = searchParams.get('federation');
    const federationId = searchParams.get('federationId');
    const status = searchParams.get('status');
    const upcoming = searchParams.get('upcoming') === 'true';
    const fetchAll = searchParams.get('fetchAll') === 'true';
    const rawLimit = searchParams.get('limit');
    const rawOffset = searchParams.get('offset');
    const limit = rawLimit ? Number.parseInt(rawLimit, 10) : 20;
    const offset = rawOffset ? Number.parseInt(rawOffset, 10) : 0;

    const where: Record<string, unknown> = {};
    const federationFilters: Array<Record<string, unknown>> = [];
    
    if (federation) {
      federationFilters.push({
        federation: {
          equals: federation,
          mode: 'insensitive',
        },
      });
    }
    if (federationId) {
      const parsedFederationId = Number.parseInt(federationId, 10);
      if (Number.isFinite(parsedFederationId)) {
        federationFilters.push({
          team1: { federationId: parsedFederationId },
        });
        federationFilters.push({
          team2: { federationId: parsedFederationId },
        });
      }
    }
    if (federationFilters.length > 0) {
      where.OR = federationFilters;
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
        ...(fetchAll
          ? {}
          : {
              take: Number.isFinite(limit) && limit > 0 ? limit : 20,
              skip: Number.isFinite(offset) && offset >= 0 ? offset : 0,
            }),
        orderBy: { date: upcoming ? 'asc' : 'desc' },
      }),
      prisma.match.count({ where }),
    ]);

    return NextResponse.json({
      matches,
      pagination: {
        total,
        limit: fetchAll ? total : Number.isFinite(limit) && limit > 0 ? limit : 20,
        offset: fetchAll ? 0 : Number.isFinite(offset) && offset >= 0 ? offset : 0,
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
