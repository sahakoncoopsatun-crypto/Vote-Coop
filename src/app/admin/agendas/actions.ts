'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// Agendas
export async function saveAgenda(formData: FormData) {
  const idStr = formData.get('id') as string;
  const id = idStr ? parseInt(idStr) : undefined;
  const number = parseInt(formData.get('number') as string);
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const result = formData.get('result') as string;
  const approveVotes = parseInt(formData.get('approveVotes') as string) || 0;
  const disapproveVotes = parseInt(formData.get('disapproveVotes') as string) || 0;
  
  let imageUrl: string | undefined = undefined;
  let fileUrl: string | undefined = undefined;

  const image = formData.get('image') as File | null;
  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    imageUrl = `data:${image.type};base64,${base64}`;
  }

  const document = formData.get('document') as File | null;
  if (document && document.size > 0) {
    const bytes = await document.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    fileUrl = `data:${document.type};base64,${base64}`;
  }
  
  const data: any = { number, title, description, result, approveVotes, disapproveVotes };
  if (imageUrl) data.imageUrl = imageUrl;
  if (fileUrl) data.fileUrl = fileUrl;

  if (id) {
    await prisma.agenda.update({ where: { id }, data });
  } else {
    await prisma.agenda.create({ data });
  }
  
  revalidatePath('/admin/agendas');
  revalidatePath('/agendas');
  revalidatePath('/agm-report');
}

export async function deleteAgenda(agendaId: number) {
  await prisma.agenda.delete({ where: { id: agendaId } });
  revalidatePath('/admin/agendas');
  revalidatePath('/agm-report');
}
