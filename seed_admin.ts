import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.admin.findUnique({
    where: { username: 'admin' },
  });

  if (!adminExists) {
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: 'password123', // In a real app this should be hashed, assuming raw for now or whatever the app expects.
      },
    });
    console.log('Admin user created: admin / password123');
  } else {
    // Ensure password is password123
    await prisma.admin.update({
      where: { username: 'admin' },
      data: { password: 'password123' },
    });
    console.log('Admin user already exists. Password reset to: password123');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
