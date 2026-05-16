const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  const settings = await prisma.adminSettings.findUnique({ where: { id: 1 } });
  console.log('Settings:', JSON.stringify(settings, null, 2));
}

check().catch(console.error).finally(() => {
  prisma.$disconnect();
  pool.end();
});
