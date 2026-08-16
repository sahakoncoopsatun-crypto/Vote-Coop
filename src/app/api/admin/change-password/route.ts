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

  const { username, currentPassword, newUsername, newPassword } = await request.json();

  if (!username || !currentPassword) {
    return NextResponse.json({ error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่านปัจจุบันให้ครบถ้วน' }, { status: 400 });
  }

  // Find admin and verify current password (case-insensitive for username search if needed, but Prisma uses exact match unless mode: insensitive is used. Let's find first to be safe)
  const admin = await prisma.admin.findFirst({ 
    where: { 
      username: {
        equals: username,
        mode: 'insensitive' // Allow 'Admin' to match 'admin'
      }
    } 
  });

  if (!admin || admin.password !== currentPassword) {
    return NextResponse.json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านปัจจุบันไม่ถูกต้อง' }, { status: 400 });
  }

  const updateData: any = {};

  if (newUsername && newUsername.trim() !== '') {
    // Check if new username is already taken by someone else
    const existing = await prisma.admin.findFirst({
      where: {
        username: { equals: newUsername, mode: 'insensitive' },
        id: { not: admin.id }
      }
    });
    if (existing) {
      return NextResponse.json({ error: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' }, { status: 400 });
    }
    updateData.username = newUsername.trim();
  }

  if (newPassword && newPassword !== '') {
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' }, { status: 400 });
    }
    updateData.password = newPassword;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'กรุณากรอกข้อมูลที่ต้องการเปลี่ยน (ชื่อผู้ใช้ใหม่ หรือ รหัสผ่านใหม่)' }, { status: 400 });
  }

  // Update
  await prisma.admin.update({
    where: { id: admin.id },
    data: updateData,
  });

  return NextResponse.json({ success: true });
}
