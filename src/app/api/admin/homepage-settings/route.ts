import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const keys = [
    'homepage_title', 
    'homepage_subtitle', 
    'countdown_target', 
    'election_date', 
    'election_time', 
    'election_location',
    'menu_check-eligibility',
    'menu_candidates',
    'menu_results',
    'menu_apply-candidate',
    'menu_apply-officer',
    'require_officer_files',
    'officer_terms',
    'candidate_terms',
    'candidate_online_open',
    'candidate_download_open',
    'candidate_form_url',
    'candidate_open_president',
    'candidate_open_committee_hospital',
    'candidate_open_committee_sso',
    'candidate_open_auditor',
    'candidate_form_president',
    'candidate_form_committee_hospital',
    'candidate_form_committee_sso',
    'candidate_form_auditor'
  ];

  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: keys
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
    'election_location',
    'menu_check-eligibility',
    'menu_candidates',
    'menu_results',
    'menu_apply-candidate',
    'menu_apply-officer',
    'require_officer_files',
    'officer_terms',
    'candidate_terms',
    'candidate_online_open',
    'candidate_download_open',
    'candidate_form_url',
    'candidate_open_president',
    'candidate_open_committee_hospital',
    'candidate_open_committee_sso',
    'candidate_open_auditor',
    'candidate_form_president',
    'candidate_form_committee_hospital',
    'candidate_form_committee_sso',
    'candidate_form_auditor'
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
