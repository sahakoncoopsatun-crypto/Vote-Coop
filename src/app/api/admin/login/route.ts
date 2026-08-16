import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const admin = await prisma.admin.findFirst({ 
    where: { 
      username: {
        equals: username,
        mode: 'insensitive'
      } 
    } 
  });

  // In real app, you MUST use bcrypt or similar to compare hashed passwords
  if (admin && admin.password === password) {
    const cookieStore = await cookies();
    cookieStore.set('adminToken', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
