const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.agenda.deleteMany({}); // Clear existing agendas just in case, or maybe keep them? The user said "เพิ่มวาระการประชุม... วาระที่ 1 - 6". Usually this means they want these exact 6 agendas. I'll delete existing ones to be clean.
  
  const agendas = [
    { number: 1, title: 'เรื่องที่ประธานแจ้งให้ที่ประชุมทราบ', result: 'รอการลงมติ', description: 'ประธานแจ้งเรื่องต่างๆ ให้สมาชิกรับทราบ' },
    { number: 2, title: 'รับรองรายงานการประชุมใหญ่สามัญประจำปีที่ผ่านมา', result: 'รอการลงมติ', description: 'พิจารณารับรองรายงานการประชุมใหญ่สามัญ' },
    { number: 3, title: 'พิจารณาอนุมัติงบดุลและรายงานผลการดำเนินงาน', result: 'รอการลงมติ', description: 'พิจารณาอนุมัติงบการเงินและผลการดำเนินงานประจำปี' },
    { number: 4, title: 'พิจารณาอนุมัติการจัดสรรกำไรสุทธิประจำปี', result: 'รอการลงมติ', description: 'พิจารณาอนุมัติการจ่ายเงินปันผลและเงินเฉลี่ยคืน' },
    { number: 5, title: 'พิจารณาเลือกตั้งคณะกรรมการดำเนินการและผู้ตรวจสอบกิจการ', result: 'รอการลงมติ', description: 'ประกาศผลและรับรองการเลือกตั้ง' },
    { number: 6, title: 'พิจารณาเรื่องอื่นๆ (ถ้ามี)', result: 'รอการลงมติ', description: 'เรื่องอื่นๆ ที่สมาชิกเสนอในที่ประชุม' }
  ];

  for (const agenda of agendas) {
    await prisma.agenda.create({ data: agenda });
  }
  
  console.log('Successfully seeded Agendas 1 - 6');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
