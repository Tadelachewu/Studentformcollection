const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function check() {
  const count = await prisma.submission.count();
  const all = await prisma.submission.findMany();
  console.log('Total submissions:', count);
  console.log('Submissions:', JSON.stringify(all, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
