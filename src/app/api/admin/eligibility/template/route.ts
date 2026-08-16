import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';

export async function GET() {
  const data = [
    {
      'เลขสมาชิก': '123456',
      'เลขบัตรประชาชน': '1910000000000',
      'ชื่อ-สกุล': 'นายทดสอบ ทดสอบ',
      'หน่วยเลือกตั้ง': 'หน่วยที่ 1 รพ.สตูล',
      'สิทธิเลือกตั้ง': '1',
      'สิทธิประชุม': '1',
      'หมายเหตุ': ''
    },
    {
      'เลขสมาชิก': '654321',
      'เลขบัตรประชาชน': '1910000000001',
      'ชื่อ-สกุล': 'นางสมมติ สมมติ',
      'หน่วยเลือกตั้ง': 'หน่วยที่ 2 สสอ.เมือง',
      'สิทธิเลือกตั้ง': '0',
      'สิทธิประชุม': '1',
      'หมายเหตุ': 'ขาดคุณสมบัติการเลือกตั้ง'
    }
  ];

  const ws = xlsx.utils.json_to_sheet(data);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Eligibility');

  const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

  return new NextResponse(buf, {
    headers: {
      'Content-Disposition': 'attachment; filename="eligibility_template.xlsx"',
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  });
}
