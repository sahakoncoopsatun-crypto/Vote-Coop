import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding candidates and applications...');

  // 1. Seed Candidate Applications (For Admin to review)
  const applications = [
    {
      memberId: 'M1001',
      name: 'นาย ประเสริฐ ใจดี',
      position: 'President',
      title: 'นาย',
      phone: '0812345678',
      vision: 'พัฒนาสหกรณ์ให้ก้าวหน้า มั่นคง และยั่งยืน',
      policy: '1. เพิ่มเงินปันผล 2. ลดดอกเบี้ยเงินกู้ 3. พัฒนาระบบออนไลน์',
      status: 'pending',
      age: '55',
      workplace: 'โรงพยาบาลสตูล',
      jobTitle: 'นายแพทย์เชี่ยวชาญ',
    },
    {
      memberId: 'M1002',
      name: 'นาง สมศรี รักสหกรณ์',
      position: 'Committee-Hospital',
      title: 'นาง',
      phone: '0898765432',
      vision: 'สมาชิกคือหัวใจ บริการฉับไว โปร่งใสตรวจสอบได้',
      policy: '1. ขยายเวลาทำการ 2. เพิ่มสวัสดิการสมาชิก',
      status: 'pending',
      age: '48',
      workplace: 'โรงพยาบาลละงู',
      jobTitle: 'พยาบาลวิชาชีพ',
    },
    {
      memberId: 'M1003',
      name: 'นาย วิทยา ก้าวไกล',
      position: 'Auditor',
      title: 'นาย',
      phone: '0855555555',
      vision: 'ตรวจสอบอย่างเป็นธรรม เพื่อผลประโยชน์ของสมาชิกทุกคน',
      policy: '1. ตรวจสอบบัญชีทุกไตรมาส 2. รายงานผลโปร่งใส',
      status: 'pending',
      age: '50',
      workplace: 'สสจ.สตูล',
      jobTitle: 'นักวิชาการสาธารณสุข',
    }
  ];

  for (const app of applications) {
    await prisma.candidateApplication.create({
      data: app,
    });
  }
  console.log('Successfully seeded candidate applications!');

  // 2. Seed Candidates (Approved candidates for voting and results)
  const candidates = [
    { name: 'นพ. สมชาย รักดี', position: 'President', number: 1, vision: 'บริหารงานโปร่งใส', policy: 'เพิ่มสวัสดิการ' },
    { name: 'ทพ. วีระ เก่งการ', position: 'President', number: 2, vision: 'ยกระดับสหกรณ์สู่ยุคดิจิทัล', policy: 'ระบบออนไลน์ 100%' },
    { name: 'นาง สุวิมล ใจสู้', position: 'Committee-Hospital', number: 1, vision: 'ดูแลพี่น้องโรงพยาบาล', policy: 'กู้ปุ๊บได้ปั๊บ' },
    { name: 'นาย อดิศร มั่นคง', position: 'Committee-Hospital', number: 2, vision: 'มุ่งมั่นตั้งใจ', policy: 'ลดดอกเบี้ย' },
    { name: 'นาง ยุพิน ถิ่นใต้', position: 'Committee-SSJ', number: 1, vision: 'สสจ. ต้องก้าวหน้า', policy: 'สวัสดิการครอบคลุม' },
    { name: 'นาย นพดล คนขยัน', position: 'Auditor', number: 1, vision: 'ตรวจสอบชัดเจน', policy: 'บัญชีโปร่งใส' },
    { name: 'นางสาว สมใจ ซื่อสัตย์', position: 'Auditor', number: 2, vision: 'รักษาผลประโยชน์', policy: 'ไม่มีทุจริต' },
  ];

  for (const cand of candidates) {
    await prisma.candidate.create({
      data: {
        ...cand,
        votes: Math.floor(Math.random() * 500) + 50, // Random votes for demo
        imageUrl: '',
      },
    });
  }
  console.log('Successfully seeded approved candidates!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
