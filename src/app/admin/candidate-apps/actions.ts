'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateCandidateStatus(id: number, status: string) {
  const application = await prisma.candidateApplication.findUnique({ where: { id } });
  
  if (!application) return;

  if (status === 'approved' && application.status !== 'approved') {
    const existingCandidates = await prisma.candidate.findMany({
      where: { position: application.position },
      orderBy: { number: 'desc' },
      take: 1
    });
    const nextNumber = existingCandidates.length > 0 ? (existingCandidates[0].number || 0) + 1 : 1;

    await prisma.candidate.create({
      data: {
        name: `${application.title || ''} ${application.name}`.trim(),
        position: application.position,
        number: nextNumber,
        vision: application.vision,
        policy: application.policy,
        imageUrl: application.imageUrl
      }
    });
  } 
  else if (application.status === 'approved' && status !== 'approved') {
    await prisma.candidate.deleteMany({
      where: { 
        name: `${application.title || ''} ${application.name}`.trim(),
        position: application.position 
      }
    });
  }

  await prisma.candidateApplication.update({
    where: { id },
    data: { status }
  });

  revalidatePath('/admin/candidate-apps');
  revalidatePath('/candidates');
}

export async function deleteCandidateApplication(id: number) {
  const application = await prisma.candidateApplication.findUnique({ where: { id } });
  
  if (application && application.status === 'approved') {
    await prisma.candidate.deleteMany({
      where: { 
        name: `${application.title || ''} ${application.name}`.trim(),
        position: application.position 
      }
    });
  }

  await prisma.candidateApplication.delete({
    where: { id }
  });

  revalidatePath('/admin/candidate-apps');
  revalidatePath('/candidates');
}
