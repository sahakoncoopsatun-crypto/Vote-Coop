const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedAgendas() {
  await prisma.agenda.deleteMany();
  await prisma.agenda.createMany({
    data: [
      { number: 1, title: 'เรื่องที่ประธานแจ้งให้ที่ประชุมทราบ', description: 'สรุปผลการดำเนินงานในรอบปีที่ผ่านมา', result: 'รับทราบ', approveVotes: 0, disapproveVotes: 0 },
      { number: 2, title: 'รับรองรายงานการประชุมใหญ่สามัญประจำปี 2568', description: 'พิจารณารายงานการประชุมครั้งที่ผ่านมา', result: 'รับรอง', approveVotes: 1450, disapproveVotes: 12 },
      { number: 3, title: 'พิจารณาอนุมัติงบดุลและรายงานผู้สอบบัญชี', description: 'งบการเงินสิ้นสุดวันที่ 31 ธันวาคม 2568', result: 'อนุมัติ', approveVotes: 1300, disapproveVotes: 45 },
      { number: 4, title: 'พิจารณาจัดสรรกำไรสุทธิประจำปี 2568', description: 'เงินปันผล 6.5% และเงินเฉลี่ยคืน 10%', result: 'อนุมัติ', approveVotes: 1500, disapproveVotes: 5 },
      { number: 5, title: 'พิจารณาแผนงานและงบประมาณรายจ่ายประจำปี 2569', description: '', result: 'อนุมัติ', approveVotes: 1250, disapproveVotes: 80 }
    ]
  });
  console.log('Agendas seeded with votes');
}

seedAgendas().then(() => prisma.$disconnect());
