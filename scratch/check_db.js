const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  const all = await prisma.submission.findMany();
  console.log('All Names:', all.map(s => s.fullName).join(', '));
}

check().catch(console.error).finally(() => {
  prisma.$disconnect();
  pool.end();
});
