import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.eligibility.upsert({
    where: { memberId: '12345' },
    update: {
      name: 'นาย ดำรงศักดิ์ ใจดี',
      idCard: '1910000000000',
      organization: 'โรงพยาบาลสตูล',
      sequenceNumber: 142,
      registrationDesk: 2,
      canVote: true,
      canAttend: true
    },
    create: {
      memberId: '12345',
      name: 'นาย ดำรงศักดิ์ ใจดี',
      idCard: '1910000000000',
      organization: 'โรงพยาบาลสตูล',
      sequenceNumber: 142,
      registrationDesk: 2,
      canVote: true,
      canAttend: true
    },
  });
  
  await prisma.eligibility.upsert({
    where: { memberId: '99999' },
    update: {
      name: 'นางสาว สมหญิง รักษาดี',
      idCard: '1910000000001',
      organization: 'สสจ.สตูล',
      sequenceNumber: 856,
      registrationDesk: 5,
      canVote: true,
      canAttend: true
    },
    create: {
      memberId: '99999',
      name: 'นางสาว สมหญิง รักษาดี',
      idCard: '1910000000001',
      organization: 'สสจ.สตูล',
      sequenceNumber: 856,
      registrationDesk: 5,
      canVote: true,
      canAttend: true
    },
  });

  console.log('Mock eligibility data seeded.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
