import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating images for candidates...');

  const cands = await prisma.candidate.findMany();
  
  for (let i = 0; i < cands.length; i++) {
    // Determine gender roughly by title/name (นาง, น.ส., นางสาว -> women, otherwise men)
    const cand = cands[i];
    const isWoman = cand.name.includes('นาง') || cand.name.includes('น.ส.');
    const gender = isWoman ? 'women' : 'men';
    const randomId = Math.floor(Math.random() * 90); // 0-90
    const imageUrl = `https://randomuser.me/api/portraits/${gender}/${randomId}.jpg`;

    await prisma.candidate.update({
      where: { id: cand.id },
      data: { imageUrl }
    });
    console.log(`Updated Candidate ${cand.name} with ${imageUrl}`);
  }

  // Do the same for candidate applications
  const apps = await prisma.candidateApplication.findMany();
  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    const isWoman = app.name.includes('นาง') || app.name.includes('น.ส.') || (app.title && (app.title.includes('นาง') || app.title.includes('น.ส.')));
    const gender = isWoman ? 'women' : 'men';
    const randomId = Math.floor(Math.random() * 90);
    const imageUrl = `https://randomuser.me/api/portraits/${gender}/${randomId}.jpg`;

    await prisma.candidateApplication.update({
      where: { id: app.id },
      data: { imageUrl }
    });
    console.log(`Updated App ${app.name} with ${imageUrl}`);
  }

  console.log('Done updating images!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
