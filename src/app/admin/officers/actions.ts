'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateDistrictQuota(districtId: number, quota: number) {
  await prisma.district.update({
    where: { id: districtId },
    data: { quota }
  });
  revalidatePath('/admin/officers');
  revalidatePath('/apply-officer');
}

export async function updateApplicationStatus(applicationId: number, status: string) {
  await prisma.officerApplication.update({
    where: { id: applicationId },
    data: { status }
  });
  revalidatePath('/admin/officers');
  revalidatePath('/apply-officer');
}

export async function deleteApplication(applicationId: number) {
  await prisma.officerApplication.delete({
    where: { id: applicationId }
  });
  revalidatePath('/admin/officers');
  revalidatePath('/apply-officer');
}
