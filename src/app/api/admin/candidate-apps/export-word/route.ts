import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, ImageRun, WidthType, BorderStyle, HeadingLevel, AlignmentType, PageOrientation } from 'docx';
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
      where: { status: 'approved' },
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }]
    });

    const groupedApps = applications.reduce((acc, app) => {
      if (!acc[app.position]) acc[app.position] = [];
      acc[app.position].push(app);
      return acc;
    }, {} as Record<string, typeof applications>);

    const positions = ['President', 'Committee-Hospital', 'Committee-SSJ', 'Auditor'];

    const sections: any[] = [];

    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      const apps = groupedApps[pos];
      if (!apps || apps.length === 0) continue;

      const positionName = POSITION_LABELS[pos] || pos;

      const rows: TableRow[] = [];

      // Header Row
      rows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: "ลำดับ", alignment: AlignmentType.CENTER })], width: { size: 10, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph({ text: "เลขสมาชิก", alignment: AlignmentType.CENTER })], width: { size: 15, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph({ text: "รูปประจำตัว", alignment: AlignmentType.CENTER })], width: { size: 20, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph({ text: "ชื่อ - สกุล", alignment: AlignmentType.CENTER })], width: { size: 30, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph({ text: "สถานที่ทำงาน", alignment: AlignmentType.CENTER })], width: { size: 25, type: WidthType.PERCENTAGE } }),
          ],
        })
      );

      // Data Rows
      for (let j = 0; j < apps.length; j++) {
        const app = apps[j];
        
        let imageRun = null;

        if (app.imageUrl) {
          try {
            let imageBuffer: Buffer | null = null;
            let extension = 'png';
            if (app.imageUrl.startsWith('/')) {
              const filePath = path.join(process.cwd(), 'public', app.imageUrl);
              if (fs.existsSync(filePath)) {
                imageBuffer = fs.readFileSync(filePath);
                const ext = path.extname(filePath).toLowerCase();
                if (ext === '.jpg' || ext === '.jpeg') extension = 'jpg';
              }
            } else if (app.imageUrl.startsWith('http')) {
              const res = await fetch(app.imageUrl);
              if (res.ok) {
                const arrayBuffer = await res.arrayBuffer();
                imageBuffer = Buffer.from(arrayBuffer);
                const contentType = res.headers.get('content-type') || '';
                if (contentType.includes('jpeg') || contentType.includes('jpg')) extension = 'jpg';
              }
            }

            if (imageBuffer) {
              imageRun = new ImageRun({
                data: Uint8Array.from(imageBuffer),
                transformation: { width: 60, height: 75 },
                type: extension as 'png' | 'jpg', // Use jpg for docx
              });
            }
          } catch (err) {
            console.error('Error loading image for docx:', app.memberId);
          }
        }

        const photoCellChildren = imageRun 
          ? [new Paragraph({ children: [imageRun], alignment: AlignmentType.CENTER })]
          : [new Paragraph({ text: "ไม่มีรูป", alignment: AlignmentType.CENTER })];

        rows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: `${j + 1}`, alignment: AlignmentType.CENTER })] }),
              new TableCell({ children: [new Paragraph({ text: app.memberId, alignment: AlignmentType.CENTER })] }),
              new TableCell({ children: photoCellChildren }),
              new TableCell({ children: [new Paragraph({ text: `${app.title || ''} ${app.name}` })] }),
              new TableCell({ children: [new Paragraph({ text: app.workplace || '-' })] }),
            ],
          })
        );
      }

      const table = new Table({
        rows: rows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      });

      sections.push({
        properties: {
          page: {
            margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
          },
        },
        children: [
          new Paragraph({
            text: `รายงานสรุปรายชื่อผู้ลงสมัครรับเลือกตั้ง - ${positionName}`,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "" }), // Empty line
          table,
        ],
      });
    }

    if (sections.length === 0) {
      sections.push({
        children: [new Paragraph({ text: "ไม่มีข้อมูลผู้สมัครที่อนุมัติแล้ว" })]
      });
    }

    const doc = new Document({
      sections: sections,
    });

    const buffer = await Packer.toBuffer(doc);

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename="candidate_applications.docx"',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    });

  } catch (error) {
    console.error('Export Word Error:', error);
    return new NextResponse('Error exporting data', { status: 500 });
  }
}
