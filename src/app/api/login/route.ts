import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/db';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.role !== 'trainer') {
      return NextResponse.json({ error: 'Trainers only' }, { status: 403 });
    }

    const trainer = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        trainedTeam: true,
      },
    });

    if (!trainer?.trainedTeam) {
      return NextResponse.json({ error: 'No team assigned' }, { status: 404 });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      teamId: trainer.trainedTeam.id,
      teamName: trainer.trainedTeam.name,
    });
  } catch (error) {
    console.error('Trainer login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
