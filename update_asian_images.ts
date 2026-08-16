import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating Asian images for candidates...');

  const cands = await prisma.candidate.findMany();
  
  const maleImages = ['/mock-faces/man_1.jpg', '/mock-faces/man_2.jpg'];
  const femaleImages = ['/mock-faces/woman_1.jpg'];

  let maleIndex = 0;
  let femaleIndex = 0;
  
  for (let i = 0; i < cands.length; i++) {
    const cand = cands[i];
    const isWoman = cand.name.includes('นาง') || cand.name.includes('น.ส.');
    
    let imageUrl = '';
    if (isWoman) {
      imageUrl = femaleImages[femaleIndex % femaleImages.length];
      femaleIndex++;
    } else {
      imageUrl = maleImages[maleIndex % maleImages.length];
      maleIndex++;
    }

    await prisma.candidate.update({
      where: { id: cand.id },
      data: { imageUrl }
    });
    console.log(`Updated Candidate ${cand.name} with ${imageUrl}`);
  }

  // Do the same for candidate applications
  const apps = await prisma.candidateApplication.findMany();
  maleIndex = 0;
  femaleIndex = 0;
  
  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    const isWoman = app.name.includes('นาง') || app.name.includes('น.ส.') || (app.title && (app.title.includes('นาง') || app.title.includes('น.ส.')));
    
    let imageUrl = '';
    if (isWoman) {
      imageUrl = femaleImages[femaleIndex % femaleImages.length];
      femaleIndex++;
    } else {
      imageUrl = maleImages[maleIndex % maleImages.length];
      maleIndex++;
    }

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
