'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function submitCandidateApplication(formData: FormData) {
  const memberId = formData.get('memberId') as string;
  const idCard = formData.get('idCard') as string;
  const phone = formData.get('phone') as string;
  const position = formData.get('position') as string;
  const vision = formData.get('vision') as string;
  const policy = formData.get('policy') as string;

  // Verify eligibility
  const eligibility = await prisma.eligibility.findFirst({
    where: { memberId, idCard }
  });

  if (!eligibility) {
    return { success: false, message: 'ไม่พบข้อมูล หรือเลขสมาชิก/เลขบัตรประชาชนไม่ถูกต้อง' };
  }

  // Check if they already applied
  const existingApp = await prisma.candidateApplication.findFirst({
    where: { memberId }
  });

  if (existingApp && existingApp.status !== 'rejected') {
    return { success: false, message: 'คุณได้ส่งใบสมัครรับเลือกตั้งไปแล้ว และอยู่ในระหว่างดำเนินการหรือได้รับการอนุมัติแล้ว' };
  }

  let imageUrl: string | undefined = undefined;
  const image = formData.get('image') as File | null;
  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `candidate_app_${Date.now()}_${image.name.replace(/\s+/g, '_')}`;
    const filePath = join(process.cwd(), 'public', 'uploads', fileName);
    await writeFile(filePath, buffer);
    imageUrl = `/uploads/${fileName}`;
  }

  const age = formData.get('age') as string;
  const address = formData.get('address') as string;
  const moo = formData.get('moo') as string;
  const road = formData.get('road') as string;
  const subDistrict = formData.get('subDistrict') as string;
  const district = formData.get('district') as string;
  const province = formData.get('province') as string;
  const workplace = formData.get('workplace') as string;
  const jobTitle = formData.get('jobTitle') as string;
  const idLine = formData.get('idLine') as string;
  const educationLevel = formData.get('educationLevel') as string;
  const educationMajor = formData.get('educationMajor') as string;
  const educationInst = formData.get('educationInst') as string;
  const workHistory = formData.get('workHistory') as string;
  
  const guarantee1Name = formData.get('guarantee1Name') as string;
  const guarantee1Id = formData.get('guarantee1Id') as string;
  const guarantee2Name = formData.get('guarantee2Name') as string;
  const guarantee2Id = formData.get('guarantee2Id') as string;
  const guarantee3Name = formData.get('guarantee3Name') as string;
  const guarantee3Id = formData.get('guarantee3Id') as string;

  const createdApp = await prisma.candidateApplication.create({
    data: {
      memberId,
      name: eligibility.name,
      phone,
      title: formData.get('title') as string,
      position,
      vision,
      policy,
      imageUrl,
      age,
      address,
      moo,
      road,
      subDistrict,
      district,
      province,
      workplace,
      jobTitle,
      idLine,
      educationLevel,
      educationMajor,
      educationInst,
      workHistory,
      guarantee1Name,
      guarantee1Id,
      guarantee2Name,
      guarantee2Id,
      guarantee3Name,
      guarantee3Id
    }
  });

  revalidatePath('/apply-candidate');
  revalidatePath('/admin/candidate-apps');
  
  return { success: true, message: 'บันทึกข้อมูลสำเร็จ', applicationId: createdApp.id };
}
