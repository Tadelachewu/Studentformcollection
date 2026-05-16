import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Seed Admin Credentials
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  await prisma.adminSettings.upsert({
    where: { id: 1 },
    update: {
      username: adminUsername,
      password: adminPassword,
    },
    create: {
      id: 1,
      username: adminUsername,
      password: adminPassword,
    },
  });
  console.log(`Admin account seeded: ${adminUsername}`);

  // 2. Seed Sample Submissions
  const sampleSubmissions = [
    {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      courseToLearn: 'Web Development',
      status: 'pending',
      address: '123 Tech Lane, Silicon Valley',
      dob: '1995-05-15',
      gender: 'Male',
      educationHistory: 'BSc in Computer Science',
    },
    {
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '0987654321',
      courseToLearn: 'Mobile App Development',
      status: 'accepted',
      address: '456 Mobile St, New York',
      dob: '1998-10-20',
      gender: 'Female',
      educationHistory: 'High School Diploma',
    }
  ];

  for (const sub of sampleSubmissions) {
    await prisma.submission.create({
      data: sub,
    });
  }
  console.log('Sample submissions seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
