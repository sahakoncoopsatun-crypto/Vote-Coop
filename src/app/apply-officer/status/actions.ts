'use server';

import { prisma } from '@/lib/prisma';

export async function checkStatus(memberId: string, idCard: string) {
  try {
    // Check if the user is eligible first
    const eligibility = await prisma.eligibility.findFirst({
      where: { memberId, idCard }
    });

    if (!eligibility) {
      return { success: false, message: 'ไม่พบข้อมูลเลขสมาชิกหรือเลขบัตรประชาชนนี้ในระบบ' };
    }

    // Find their application
    const application = await prisma.officerApplication.findFirst({
      where: { memberId },
      include: {
        district: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!application) {
      return { success: false, message: 'ไม่พบข้อมูลการยื่นใบสมัครของคุณ' };
    }

    return {
      success: true,
      data: {
        name: application.name,
        districtName: application.district.name,
        createdAt: application.createdAt.toISOString(),
        status: application.status // pending, approved, rejected
      }
    };
  } catch (error) {
    console.error('Error checking status:', error);
    return { success: false, message: 'เกิดข้อผิดพลาดในระบบ' };
  }
}
