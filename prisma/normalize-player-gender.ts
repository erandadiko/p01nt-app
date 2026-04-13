import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const before = await prisma.player.groupBy({
    by: ['gender'],
    _count: { _all: true },
  });
  console.log('Player gender distribution before migration:', before);

  const maleResult = await prisma.player.updateMany({
    where: { gender: 'M' },
    data: { gender: 'MALE' },
  });

  const femaleResult = await prisma.player.updateMany({
    where: { gender: 'F' },
    data: { gender: 'FEMALE' },
  });

  console.log('Updated M -> MALE rows:', maleResult.count);
  console.log('Updated F -> FEMALE rows:', femaleResult.count);

  const after = await prisma.player.groupBy({
    by: ['gender'],
    _count: { _all: true },
  });
  console.log('Player gender distribution after migration:', after);
}

main()
  .catch((error) => {
    console.error('Gender normalization migration failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
