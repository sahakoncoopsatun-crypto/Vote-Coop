import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const settings = [
    { key: 'election_date', value: '21 พฤศจิกายน 2569' },
    { key: 'election_time', value: '09:00 - 15:00 น.' },
    { key: 'election_location', value: 'โรงเรียนสตูลวิทยา ตำบลคลองขุด อำเภอเมืองสตูล จังหวัดสตูล' },
    { key: 'agm_date', value: '21 พฤศจิกายน 2569' },
    { key: 'agm_time', value: '09:00 - 15:00 น.' },
    { key: 'agm_location', value: 'โรงเรียนสตูลวิทยา ตำบลคลองขุด อำเภอเมืองสตูล จังหวัดสตูล' },
    { key: 'countdown_target', value: '2026-11-21T09:00:00+07:00' }
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log('Settings updated successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
