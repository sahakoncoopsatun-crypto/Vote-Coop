import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding missing districts for Satun...');

  const allDistricts = [
    { name: 'อำเภอเมืองสตูล', quota: 5 },
    { name: 'อำเภอควนโดน', quota: 2 },
    { name: 'อำเภอละงู', quota: 3 },
    { name: 'อำเภอควนกาหลง', quota: 2 },
    { name: 'อำเภอท่าแพ', quota: 2 },
    { name: 'อำเภอทุ่งหว้า', quota: 2 },
    { name: 'อำเภอมะนัง', quota: 1 },
  ];

  for (const d of allDistricts) {
    const existing = await prisma.district.findUnique({ where: { name: d.name } });
    if (!existing) {
      await prisma.district.create({ data: d });
      console.log(`Created: ${d.name}`);
    }
  }

  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
