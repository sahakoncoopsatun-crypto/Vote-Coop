import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'password123', // In a real app, hash this!
    },
  });
  console.log({ admin });

  // Add some mock candidates
  await prisma.candidate.createMany({
    data: [
      { name: 'นายแพทย์ สมชาย ใจดี', position: 'ประธานกรรมการ', number: 1, vision: 'บริหารโปร่งใส ใส่ใจสมาชิก', policy: 'เพิ่มสวัสดิการ ลดดอกเบี้ยเงินกู้' },
      { name: 'นางสาว สมหญิง รักดี', position: 'กรรมการหน่วยโรงพยาบาลสตูล', number: 1, vision: 'เป็นปากเป็นเสียงให้สมาชิก', policy: 'พัฒนาระบบสวัสดิการให้ครอบคลุม' },
      { name: 'นาย สมศักดิ์ มั่นคง', position: 'กรรมการหน่วยสำนักงานสาธารณสุขจังหวัดสตูล', number: 1, vision: 'มั่นคง ปลอดภัย ก้าวไกล', policy: 'ส่งเสริมการออม' },
      { name: 'นาง สมบูรณ์ พูนสุข', position: 'ผู้ตรวจสอบกิจการ', number: 1, vision: 'ตรวจสอบโปร่งใส', policy: 'รักษาผลประโยชน์สหกรณ์' },
    ]
  });

  // Add some mock news
  await prisma.news.create({
    data: {
      title: 'ประกาศรายชื่อผู้มีสิทธิเลือกตั้ง 2569',
      content: 'ขอให้สมาชิกทุกท่านตรวจสอบรายชื่อและสิทธิการเลือกตั้ง หากพบข้อผิดพลาด โปรดแจ้งเจ้าหน้าที่ภายในวันที่...'
    }
  });

  // Add mock eligibility
  await prisma.eligibility.create({
    data: {
      memberId: '12345',
      idCard: '1910000000000',
      name: 'นาย ทดสอบ ระบบ',
      canVote: true,
      canAttend: true,
      remark: 'ปกติ'
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
