import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: [
          'homepage_title', 
          'homepage_subtitle', 
          'countdown_target', 
          'election_date', 
          'election_time', 
          'election_location'
        ]
      }
    }
  });

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as any);

  return NextResponse.json(settingsMap);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('adminToken');
  if (!token || token.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();

  const keysToUpdate = [
    'homepage_title', 
    'homepage_subtitle', 
    'countdown_target', 
    'election_date', 
    'election_time', 
    'election_location'
  ];

  for (const key of keysToUpdate) {
    if (data[key] !== undefined) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: data[key] },
        create: { key, value: data[key] },
      });
    }
  }

  return NextResponse.json({ success: true });
}
