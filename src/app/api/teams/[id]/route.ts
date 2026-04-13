import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid team ID' },
        { status: 400 }
      );
    }

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        players: {
          select: {
            id: true,
            name: true,
            age: true,
            gender: true,
            position: true,
            imageUrl: true,
            stats: true,
          },
          orderBy: { name: 'asc' },
        },
        trainer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        federation: true,
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ team });
  } catch (error) {
    console.error('Get team detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
