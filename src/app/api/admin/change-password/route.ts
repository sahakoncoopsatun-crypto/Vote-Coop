import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  // Verify admin is logged in
  const cookieStore = await cookies();
  const token = cookieStore.get('adminToken');
  if (!token || token.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { username, currentPassword, newPassword } = await request.json();

  if (!username || !currentPassword || !newPassword) {
    return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' }, { status: 400 });
  }

  // Find admin and verify current password
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin || admin.password !== currentPassword) {
    return NextResponse.json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านปัจจุบันไม่ถูกต้อง' }, { status: 400 });
  }

  // Update password
  await prisma.admin.update({
    where: { username },
    data: { password: newPassword },
  });

  return NextResponse.json({ success: true });
}
