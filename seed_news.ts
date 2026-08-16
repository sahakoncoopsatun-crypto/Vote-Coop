import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mock news with PDF...');

  await prisma.news.create({
    data: {
      title: 'ประกาศรายชื่อผู้มีสิทธิเข้าร่วมประชุมใหญ่สามัญประจำปี 2569 (ฉบับร่าง)',
      content: 'สหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด ขอประกาศรายชื่อสมาชิกที่มีสิทธิเข้าร่วมประชุมใหญ่สามัญประจำปี 2569 และมีสิทธิลงคะแนนเลือกตั้งคณะกรรมการ\n\nสามารถตรวจสอบรายชื่อได้จากเอกสาร PDF ที่แนบมานี้ หรือค้นหาผ่านระบบตรวจสอบสิทธิ',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Example dummy PDF
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop', // Optional image
    }
  });

  await prisma.news.create({
    data: {
      title: 'แจ้งกำหนดการรับสมัครผู้แทนสมาชิกและกรรมการดำเนินการ',
      content: 'ขอเชิญสมาชิกที่มีความสนใจและมีคุณสมบัติครบถ้วน สมัครเพื่อรับเลือกตั้งเป็นกรรมการดำเนินการ และผู้ตรวจสอบกิจการ ประจำปี 2569\n\nเปิดรับสมัครตั้งแต่วันที่ 1-15 กันยายน 2569\nณ ที่ทำการสหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด',
      fileUrl: null, // No PDF for this one to show contrast
    }
  });

  console.log('Successfully seeded mock news!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
