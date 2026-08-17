'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function submitApplication(formData: FormData) {
  const memberId = formData.get('memberId') as string;
  const idCard = formData.get('idCard') as string;
  const phone = formData.get('phone') as string;
  const districtId = parseInt(formData.get('districtId') as string);

  // Verify eligibility
  const eligibility = await prisma.eligibility.findFirst({
    where: { memberId, idCard }
  });

  if (!eligibility) {
    return { success: false, message: 'ไม่พบข้อมูล หรือเลขสมาชิก/เลขบัตรประชาชนไม่ถูกต้อง' };
  }

  // Check if they already applied to this district
  const existingApp = await prisma.officerApplication.findFirst({
    where: { memberId, districtId }
  });

  if (existingApp && existingApp.status !== 'rejected') {
    return { success: false, message: 'คุณได้ส่งใบสมัครสำหรับอำเภอนี้ไปแล้ว และอยู่ในระหว่างดำเนินการหรือได้รับการอนุมัติแล้ว' };
  }

  const settings = await prisma.setting.findMany({
    where: { key: 'require_officer_files' }
  });
  const requireFiles = settings.find(s => s.key === 'require_officer_files')?.value !== 'false';

  let imageUrl: string | undefined = undefined;
  const image = formData.get('image') as File | null;
  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `officer_img_${Date.now()}_${image.name.replace(/\s+/g, '_')}`;
    const filePath = join(process.cwd(), 'public', 'uploads', fileName);
    await writeFile(filePath, buffer);
    imageUrl = `/uploads/${fileName}`;
  } else if (requireFiles) {
    return { success: false, message: 'กรุณาอัปโหลดรูปถ่ายหน้าตรง' };
  }

  let houseRegUrl: string | undefined = undefined;
  const houseRegImage = formData.get('houseRegImage') as File | null;
  if (houseRegImage && houseRegImage.size > 0) {
    const bytes = await houseRegImage.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `officer_housereg_${Date.now()}_${houseRegImage.name.replace(/\s+/g, '_')}`;
    const filePath = join(process.cwd(), 'public', 'uploads', fileName);
    await writeFile(filePath, buffer);
    houseRegUrl = `/uploads/${fileName}`;
  } else if (requireFiles) {
    return { success: false, message: 'กรุณาอัปโหลดสำเนาทะเบียนบ้าน' };
  }

  const jobTitle = formData.get('jobTitle') as string;
  const workplace = formData.get('workplace') as string;
  const address = formData.get('address') as string;
  const moo = formData.get('moo') as string;
  const trok = formData.get('trok') as string;
  const soi = formData.get('soi') as string;
  const road = formData.get('road') as string;
  const subDistrict = formData.get('subDistrict') as string;
  const districtName = formData.get('districtName') as string;
  const province = formData.get('province') as string;
  const zipcode = formData.get('zipcode') as string;

  await prisma.officerApplication.create({
    data: {
      memberId,
      name: eligibility.name,
      phone,
      districtId,
      jobTitle,
      workplace,
      address,
      moo,
      trok,
      soi,
      road,
      subDistrict,
      districtName,
      province,
      zipcode,
      imageUrl,
      houseRegUrl
    }
  });

  revalidatePath('/apply-officer');
  revalidatePath('/admin/officers');
  
  return { success: true, message: 'ส่งใบสมัครเรียบร้อยแล้ว กรุณารอการติดต่อกลับหรือตรวจสอบสถานะภายหลัง' };
}
