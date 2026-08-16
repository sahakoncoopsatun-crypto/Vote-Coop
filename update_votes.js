const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateVotes() {
  const candidates = await prisma.candidate.findMany();
  for (const c of candidates) {
    const randomVotes = Math.floor(Math.random() * 500) + 100;
    await prisma.candidate.update({
      where: { id: c.id },
      data: { votes: randomVotes }
    });
  }
  console.log('Votes updated');
}

updateVotes().then(() => prisma.$disconnect());
