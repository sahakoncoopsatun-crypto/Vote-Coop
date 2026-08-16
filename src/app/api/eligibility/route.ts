import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get('memberId');
  const idCard = searchParams.get('idCard');

  if (!memberId || !idCard) {
    return NextResponse.json({ error: 'Missing memberId or idCard' }, { status: 400 });
  }

  try {
    const user = await prisma.eligibility.findFirst({
      where: {
        memberId: memberId,
        idCard: idCard,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: ['election_date', 'election_time', 'election_location', 'agm_date', 'agm_time', 'agm_location']
        }
      }
    });

    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as any);

    return NextResponse.json({
      ...user,
      settings: settingsMap
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
