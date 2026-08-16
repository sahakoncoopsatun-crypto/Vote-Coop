const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function initStats() {
  await prisma.setting.upsert({ where: { key: 'electionTotalVoters' }, update: { value: '3456' }, create: { key: 'electionTotalVoters', value: '3456' } });
  await prisma.setting.upsert({ where: { key: 'electionEligibleVoters' }, update: { value: '4500' }, create: { key: 'electionEligibleVoters', value: '4500' } });
  await prisma.setting.upsert({ where: { key: 'agmTotalAttendees' }, update: { value: '1850' }, create: { key: 'agmTotalAttendees', value: '1850' } });
  await prisma.setting.upsert({ where: { key: 'agmEligibleAttendees' }, update: { value: '4500' }, create: { key: 'agmEligibleAttendees', value: '4500' } });
  console.log('Stats initialized');
}

initStats().then(() => prisma.$disconnect());
