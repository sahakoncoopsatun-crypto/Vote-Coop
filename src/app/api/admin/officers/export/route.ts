import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as xlsx from 'xlsx';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const applications = await prisma.officerApplication.findMany({
      include: { district: true },
      orderBy: [{ districtId: 'asc' }, { createdAt: 'desc' }]
    });

    // Transform data for Excel
    const data = applications.map((app, index) => ({
      'ลำดับ': index + 1,
      'อำเภอ': app.district.name,
      'สถานะ': app.status === 'approved' ? 'อนุมัติ' : app.status === 'rejected' ? 'ไม่อนุมัติ' : 'รอตรวจสอบ',
      'เลขสมาชิก': app.memberId,
      'ชื่อ-สกุล': app.name,
      'เบอร์โทร': app.phone || '',
      'วันที่สมัคร': app.createdAt.toLocaleString('th-TH'),
    }));

    // Create workbook and worksheet
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Officer Apps');

    // Generate buffer
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename="officer_applications.xlsx"',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error) {
    console.error('Export Error:', error);
    return new NextResponse('Error exporting data', { status: 500 });
  }
}
