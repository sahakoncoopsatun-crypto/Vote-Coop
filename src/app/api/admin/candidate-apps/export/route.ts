import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

const POSITION_LABELS: Record<string, string> = {
  'President': 'ประธานกรรมการ',
  'Committee-Hospital': 'กรรมการ(รพ.สตูล)',
  'Committee-SSJ': 'กรรมการ(สสจ.)',
  'Auditor': 'ผู้ตรวจสอบกิจการ'
};

export async function GET() {
  try {
    const applications = await prisma.candidateApplication.findMany({
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }]
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Vote-Coop';
    workbook.created = new Date();

    const groupedApps = applications.reduce((acc, app) => {
      if (!acc[app.position]) acc[app.position] = [];
      acc[app.position].push(app);
      return acc;
    }, {} as Record<string, typeof applications>);

    const positions = ['President', 'Committee-Hospital', 'Committee-SSJ', 'Auditor'];

    for (const pos of positions) {
      const apps = groupedApps[pos];
      if (!apps || apps.length === 0) continue;

      const sheetName = POSITION_LABELS[pos] || pos;
      const worksheet = workbook.addWorksheet(sheetName.substring(0, 31)); // Max 31 chars

      // Add Headers
      worksheet.columns = [
        { header: 'ลำดับ', key: 'seq', width: 8 },
        { header: 'รูปประจำตัว', key: 'image', width: 12 },
        { header: 'ตำแหน่ง', key: 'position', width: 20 },
        { header: 'สถานะ', key: 'status', width: 15 },
        { header: 'เลขสมาชิก', key: 'memberId', width: 15 },
        { header: 'คำนำหน้า', key: 'title', width: 10 },
        { header: 'ชื่อ-สกุล', key: 'name', width: 30 },
        { header: 'เบอร์โทร', key: 'phone', width: 15 },
        { header: 'สถานที่ทำงาน', key: 'workplace', width: 25 },
        { header: 'อายุ', key: 'age', width: 10 },
        { header: 'วิสัยทัศน์', key: 'vision', width: 40 },
        { header: 'วันที่สมัคร', key: 'date', width: 20 },
      ];

      // Make header bold
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).alignment = { horizontal: 'center' };

      for (let i = 0; i < apps.length; i++) {
        const app = apps[i];
        const rowData = {
          seq: i + 1,
          image: '', // Placeholder for image
          position: POSITION_LABELS[app.position] || app.position,
          status: app.status === 'approved' ? 'อนุมัติ' : app.status === 'rejected' ? 'ไม่อนุมัติ' : 'รอตรวจสอบ',
          memberId: app.memberId,
          title: app.title || '',
          name: app.name,
          phone: app.phone || '',
          workplace: app.workplace || '',
          age: app.age || '',
          vision: app.vision || '',
          date: app.createdAt.toLocaleString('th-TH'),
        };

        const rowIndex = i + 2; // Row 1 is header
        const row = worksheet.addRow(rowData);
        row.height = 80; // Make row height larger for image

        worksheet.getCell(`A${rowIndex}`).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`C${rowIndex}`).alignment = { vertical: 'middle' };
        worksheet.getCell(`D${rowIndex}`).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`E${rowIndex}`).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`F${rowIndex}`).alignment = { vertical: 'middle' };
        worksheet.getCell(`G${rowIndex}`).alignment = { vertical: 'middle' };
        worksheet.getCell(`H${rowIndex}`).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`I${rowIndex}`).alignment = { vertical: 'middle' };
        worksheet.getCell(`J${rowIndex}`).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`K${rowIndex}`).alignment = { vertical: 'middle', wrapText: true };
        worksheet.getCell(`L${rowIndex}`).alignment = { vertical: 'middle' };

        // Embed image if available
        if (app.imageUrl) {
          try {
            let imageBuffer: Buffer | null = null;
            let extension = 'png';

            if (app.imageUrl.startsWith('/')) {
              // Local file in public folder
              const filePath = path.join(process.cwd(), 'public', app.imageUrl);
              if (fs.existsSync(filePath)) {
                imageBuffer = fs.readFileSync(filePath);
                const ext = path.extname(filePath).toLowerCase();
                if (ext === '.jpg' || ext === '.jpeg') extension = 'jpeg';
                else if (ext === '.png') extension = 'png';
              }
            } else if (app.imageUrl.startsWith('http')) {
              // Remote URL
              const res = await fetch(app.imageUrl);
              if (res.ok) {
                const arrayBuffer = await res.arrayBuffer();
                imageBuffer = Buffer.from(arrayBuffer);
                const contentType = res.headers.get('content-type') || '';
                if (contentType.includes('jpeg') || contentType.includes('jpg')) extension = 'jpeg';
                else if (contentType.includes('png')) extension = 'png';
              }
            }

            if (imageBuffer) {
              const imageId = workbook.addImage({
                buffer: imageBuffer,
                extension: extension as 'png' | 'jpeg',
              });

              // Add image to cell B{rowIndex}
              // Calculate width/height. We'll set it to fill the cell with a small margin
              worksheet.addImage(imageId, {
                tl: { col: 1.1, row: rowIndex - 0.9 }, // 0-indexed coords for col 1 (B)
                ext: { width: 60, height: 80 }
              });
            }
          } catch (err) {
            console.error('Error embedding image for member', app.memberId, err);
          }
        }
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename="candidate_applications.xlsx"',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error) {
    console.error('Export Error:', error);
    return new NextResponse('Error exporting data', { status: 500 });
  }
}
