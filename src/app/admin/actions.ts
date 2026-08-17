'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import * as xlsx from 'xlsx';

// Candidates
export async function toggleWinner(candidateId: number, isWinner: boolean) {
  await prisma.candidate.update({
    where: { id: candidateId },
    data: { isWinner }
  });
  revalidatePath('/admin/candidates');
  revalidatePath('/results');
}

export async function deleteCandidate(candidateId: number) {
  await prisma.candidate.delete({ where: { id: candidateId } });
  revalidatePath('/admin/candidates');
  revalidatePath('/results');
}

export async function saveCandidate(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const position = formData.get('position') as string;
  const numberStr = formData.get('number') as string;
  const number = numberStr ? parseInt(numberStr) : null;
  const vision = formData.get('vision') as string;
  const policy = formData.get('policy') as string;
  const votes = parseInt((formData.get('votes') as string) || '0');
  
  const file = formData.get('image') as File;
  let imageUrl = formData.get('existingImageUrl') as string;

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save locally
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const path = join(process.cwd(), 'public/uploads', filename);
    await writeFile(path, buffer);
    imageUrl = `/uploads/${filename}`;
  }

  const data = {
    name,
    position,
    number,
    vision,
    policy,
    votes,
    ...(imageUrl ? { imageUrl } : {})
  };

  if (id) {
    await prisma.candidate.update({
      where: { id: parseInt(id) },
      data
    });
  } else {
    await prisma.candidate.create({ data });
  }

  revalidatePath('/admin/candidates');
  revalidatePath('/results');
}

// News
export async function createNews(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  await prisma.news.create({
    data: { title, content }
  });
  
  revalidatePath('/admin/news');
  revalidatePath('/news');
}

export async function deleteNews(newsId: number) {
  await prisma.news.delete({ where: { id: newsId } });
  revalidatePath('/admin/news');
  revalidatePath('/news');
}

export async function saveNews(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  const image = formData.get('image') as File;
  const file = formData.get('file') as File;
  
  let imageUrl = formData.get('existingImageUrl') as string;
  let fileUrl = formData.get('existingFileUrl') as string;

  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${image.name.replace(/\s+/g, '_')}`;
    const path = join(process.cwd(), 'public/uploads', filename);
    await writeFile(path, buffer);
    imageUrl = `/uploads/${filename}`;
  }

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const path = join(process.cwd(), 'public/uploads', filename);
    await writeFile(path, buffer);
    fileUrl = `/uploads/${filename}`;
  }

  const data = {
    title,
    content,
    ...(imageUrl ? { imageUrl } : {}),
    ...(fileUrl ? { fileUrl } : {})
  };

  if (id) {
    await prisma.news.update({
      where: { id: parseInt(id) },
      data
    });
  } else {
    await prisma.news.create({ data });
  }

  revalidatePath('/admin/news');
  revalidatePath('/news');
}

// Settings
export async function toggleReferendum(isEnabled: boolean) {
  await prisma.setting.upsert({
    where: { key: 'referendum_enabled' },
    update: { value: isEnabled ? 'true' : 'false' },
    create: { key: 'referendum_enabled', value: isEnabled ? 'true' : 'false' }
  });
  revalidatePath('/admin');
  revalidatePath('/results');
}

export async function toggleAgmReport(isEnabled: boolean) {
  await prisma.setting.upsert({
    where: { key: 'agm_report_enabled' },
    update: { value: isEnabled ? 'true' : 'false' },
    create: { key: 'agm_report_enabled', value: isEnabled ? 'true' : 'false' }
  });
  revalidatePath('/admin');
  revalidatePath('/agm-report');
}

export async function toggleAgendas(isEnabled: boolean) {
  await prisma.setting.upsert({
    where: { key: 'agendas_enabled' },
    update: { value: isEnabled ? 'true' : 'false' },
    create: { key: 'agendas_enabled', value: isEnabled ? 'true' : 'false' }
  });
  revalidatePath('/admin');
  revalidatePath('/agendas');
}

export async function updateStats(formData: FormData) {
  const keys = ['stat_election_total', 'stat_election_eligible', 'stat_agm_total', 'stat_agm_eligible'];
  // But wait, the form inputs are named electionTotalVoters, electionEligibleVoters, agmTotalAttendees, agmEligibleAttendees
  const mapping: any = {
    'electionTotalVoters': 'stat_election_total',
    'electionEligibleVoters': 'stat_election_eligible',
    'agmTotalAttendees': 'stat_agm_total',
    'agmEligibleAttendees': 'stat_agm_eligible'
  };

  for (const [formKey, dbKey] of Object.entries(mapping)) {
    const value = formData.get(formKey) as string;
    if (value) {
      await prisma.setting.upsert({
        where: { key: dbKey as string },
        update: { value },
        create: { key: dbKey as string, value }
      });
    }
  }

  revalidatePath('/admin');
  revalidatePath('/results');
  revalidatePath('/agm-report');
}

export async function updateElectionSettings(formData: FormData) {
  const keys = ['election_date', 'election_time', 'election_location', 'agm_date', 'agm_time', 'agm_location'];
  
  for (const key of keys) {
    const value = formData.get(key) as string;
    if (value !== null) {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    }
  }
  
  revalidatePath('/admin/eligibility');
  revalidatePath('/check-eligibility');
}

export async function uploadEligibility(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file || file.size === 0) throw new Error('No file provided');

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  const data: any[] = xlsx.utils.sheet_to_json(sheet);
  
  // Example expected headers: 
  // เลขสมาชิก, เลขบัตรประชาชน, ชื่อ-สกุล, หน่วยเลือกตั้ง, สิทธิเลือกตั้ง(1=มี,0=ไม่มี), สิทธิประชุม(1=มี,0=ไม่มี), หมายเหตุ
  
  // Clear old data
  await prisma.eligibility.deleteMany({});

  const formattedData = data.map(row => {
    // Attempt to map Thai headers to English schema
    const memberId = (row['เลขสมาชิก'] || row['memberId'])?.toString().trim();
    const idCard = (row['เลขบัตรประชาชน'] || row['idCard'])?.toString().trim();
    const name = (row['ชื่อ-สกุล'] || row['name'])?.toString().trim();
    const pollingStation = (row['หน่วยเลือกตั้ง'] || row['pollingStation'])?.toString().trim();
    const canVoteStr = (row['สิทธิเลือกตั้ง'] || row['canVote'])?.toString().trim();
    const canAttendStr = (row['สิทธิประชุม'] || row['canAttend'])?.toString().trim();
    const remark = (row['หมายเหตุ'] || row['remark'])?.toString().trim() || null;

    if (!memberId || !idCard || !name) {
      throw new Error('ข้อมูลในไฟล์ไม่ครบถ้วน (ต้องการ เลขสมาชิก, เลขบัตรประชาชน, ชื่อ-สกุล)');
    }

    return {
      memberId,
      idCard,
      name,
      pollingStation,
      canVote: canVoteStr === '1' || canVoteStr?.toLowerCase() === 'true' || canVoteStr === 'มีสิทธิ' || canVoteStr === 'มี' || true, // default true if not specified clearly
      canAttend: canAttendStr === '1' || canAttendStr?.toLowerCase() === 'true' || canAttendStr === 'มีสิทธิ' || canAttendStr === 'มี' || true,
      remark
    };
  });

  await prisma.eligibility.createMany({
    data: formattedData
  });

  revalidatePath('/admin/eligibility');
}

// === NEW ELIGIBILITY MANAGEMENT ACTIONS ===

export async function searchEligibility(query: string, skip: number = 0, take: number = 50) {
  const where = query ? {
    OR: [
      { name: { contains: query } },
      { memberId: { contains: query } },
      { idCard: { contains: query } }
    ]
  } : {};

  const [data, total] = await Promise.all([
    prisma.eligibility.findMany({
      where,
      skip,
      take,
      orderBy: { memberId: 'asc' }
    }),
    prisma.eligibility.count({ where })
  ]);

  return { data, total };
}

export async function saveSingleEligibility(data: any) {
  const { id, memberId, idCard, name, canVote, canAttend, pollingStation, organization, remark } = data;
  
  // Check if memberId or idCard already exists
  const existing = await prisma.eligibility.findFirst({
    where: {
      OR: [
        { memberId },
        { idCard }
      ],
      NOT: id ? { id } : undefined
    }
  });

  if (existing) {
    throw new Error(`ข้อมูลซ้ำ! พบเลขสมาชิกหรือบัตรประชาชนนี้ในระบบแล้ว (ชื่อ: ${existing.name})`);
  }

  const payload = {
    memberId,
    idCard,
    name,
    canVote: Boolean(canVote),
    canAttend: Boolean(canAttend),
    pollingStation,
    organization,
    remark
  };

  if (id) {
    await prisma.eligibility.update({ where: { id }, data: payload });
  } else {
    await prisma.eligibility.create({ data: payload });
  }

  revalidatePath('/admin/eligibility');
  return { success: true };
}

export async function deleteSingleEligibility(id: number) {
  await prisma.eligibility.delete({ where: { id } });
  revalidatePath('/admin/eligibility');
  return { success: true };
}

export async function checkEligibilityDuplicates(dataList: any[]) {
  const memberIds = dataList.map((d: any) => d.memberId).filter(Boolean);
  const idCards = dataList.map((d: any) => d.idCard).filter(Boolean);

  const existing = await prisma.eligibility.findMany({
    where: {
      OR: [
        { memberId: { in: memberIds } },
        { idCard: { in: idCards } }
      ]
    },
    select: { memberId: true, idCard: true, name: true }
  });

  return existing;
}

export async function importEligibilityData(dataList: any[], mode: 'append' | 'overwrite') {
  if (mode === 'overwrite') {
    await prisma.eligibility.deleteMany({});
  }

  const formattedData = dataList.map(row => ({
    memberId: row.memberId?.toString().trim(),
    idCard: row.idCard?.toString().trim(),
    name: row.name?.toString().trim(),
    pollingStation: row.pollingStation?.toString().trim() || null,
    organization: row.organization?.toString().trim() || null,
    canVote: row.canVote,
    canAttend: row.canAttend,
    remark: row.remark?.toString().trim() || null
  })).filter(r => r.memberId && r.idCard && r.name);

  if (mode === 'append') {
    // Delete existing intersecting records so they get overwritten with the new ones
    const memberIds = formattedData.map(d => d.memberId);
    await prisma.eligibility.deleteMany({
      where: { memberId: { in: memberIds } }
    });
  }

  await prisma.eligibility.createMany({
    data: formattedData,
    skipDuplicates: true
  });

  revalidatePath('/admin/eligibility');
  return { success: true, count: formattedData.length };
}
