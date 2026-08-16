import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const districts = [
  'เมืองสตูล',
  'ควนโดน',
  'ควนกาหลง',
  'ท่าแพ',
  'ละงู',
  'ทุ่งหว้า',
  'มะนัง'
];

async function main() {
  for (const name of districts) {
    await prisma.district.upsert({
      where: { name },
      update: {},
      create: { name, quota: 0 },
    });
  }
  console.log('Seeded 7 districts.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
