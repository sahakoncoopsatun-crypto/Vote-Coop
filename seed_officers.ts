import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding districts and officer applications...');

  const districtsData = [
    { name: 'อำเภอเมืองสตูล', quota: 5 },
    { name: 'อำเภอควนโดน', quota: 2 },
    { name: 'อำเภอละงู', quota: 3 },
  ];

  const createdDistricts = [];
  
  for (const d of districtsData) {
    let district = await prisma.district.findUnique({ where: { name: d.name } });
    if (!district) {
      district = await prisma.district.create({ data: d });
    }
    createdDistricts.push(district);
  }

  const applications = [
    {
      memberId: '11001',
      name: 'นาย สมชาย รักชาติ',
      phone: '081-111-1111',
      districtId: createdDistricts[0].id,
      status: 'pending'
    },
    {
      memberId: '11002',
      name: 'นาง สมศรี ดีใจ',
      phone: '082-222-2222',
      districtId: createdDistricts[0].id,
      status: 'approved'
    },
    {
      memberId: '11003',
      name: 'นาย วิชาญ ชำนาญ',
      phone: '083-333-3333',
      districtId: createdDistricts[0].id,
      status: 'pending'
    },
    {
      memberId: '22001',
      name: 'น.ส. มาลี สุขสันต์',
      phone: '084-444-4444',
      districtId: createdDistricts[1].id,
      status: 'approved'
    },
    {
      memberId: '33001',
      name: 'นาย สมศักดิ์ ภักดี',
      phone: '085-555-5555',
      districtId: createdDistricts[2].id,
      status: 'rejected'
    },
    {
      memberId: '33002',
      name: 'นาง กัลยา สวยงาม',
      phone: '086-666-6666',
      districtId: createdDistricts[2].id,
      status: 'pending'
    },
  ];

  for (const app of applications) {
    // Basic check to prevent huge duplicates if run multiple times
    const existing = await prisma.officerApplication.findFirst({
      where: { memberId: app.memberId }
    });
    
    if (!existing) {
      await prisma.officerApplication.create({ data: app });
    }
  }

  console.log('Successfully seeded mock data for officers!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
