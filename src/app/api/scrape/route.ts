import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Federation } from '@prisma/client';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';

// Note: In production, this should trigger async scraping jobs
// For now, it logs the request and returns mock data
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = getTokenFromHeader(request.headers.get('authorization'));
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    
    if (!payload || payload.role !== 'trainer') {
      return NextResponse.json(
        { error: 'Only trainers can trigger scraping' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { federation } = body;

    if (!federation) {
      return NextResponse.json(
        { error: 'Federation is required' },
        { status: 400 }
      );
    }

    // Validate federation
    if (!['FSHF', 'FSHB', 'FSHV', 'ATF'].includes(federation)) {
      return NextResponse.json(
        { error: 'Invalid federation. Must be FSHF, FSHB, FSHV, or ATF' },
        { status: 400 }
      );
    }

    // Log the scraping attempt
    const log = await prisma.scrapingLog.create({
      data: {
        federation: federation as Federation,
        status: 'success',
        message: 'Scraping initiated (mock)',
        itemsCount: 0,
      },
    });

    // In production, this would trigger the actual scraper
    // For now, return a success message
    return NextResponse.json({
      success: true,
      message: `Scraping initiated for ${federation}`,
      logId: log.id,
    });
  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const federation = searchParams.get('federation') as Federation | null;
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: Record<string, unknown> = {};
    
    if (federation) {
      where.federation = federation;
    }

    const logs = await prisma.scrapingLog.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Get scraping logs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
