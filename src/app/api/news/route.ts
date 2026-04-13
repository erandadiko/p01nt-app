import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const federation = searchParams.get('federation');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};
    
    if (federation) {
      where.federation = federation;
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { date: 'desc' },
      }),
      prisma.news.count({ where }),
    ]);

    return NextResponse.json({
      news,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + news.length < total,
      },
    });
  } catch (error) {
    console.error('Get news error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, content, imageUrl, link, federation } = body;

    if (!title || !description || !federation) {
      return NextResponse.json(
        { error: 'Title, description, and federation are required' },
        { status: 400 }
      );
    }

    const newsItem = await prisma.news.create({
      data: {
        title,
        description,
        content,
        imageUrl,
        link,
        federation,
      },
    });

    return NextResponse.json({ news: newsItem }, { status: 201 });
  } catch (error) {
    console.error('Create news error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
