import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { StorageAdapter } from './StorageAdapter';
import { StudentSubmission, AdminSettings } from '@/types';

export class PrismaStorageAdapter implements StorageAdapter {
  private prisma: PrismaClient;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    this.prisma = new PrismaClient({ adapter });
  }

  async init(): Promise<void> {
    await this.prisma.$connect();
  }

  async saveSubmission(data: StudentSubmission): Promise<StudentSubmission> {
    const submission = await this.prisma.submission.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        dob: data.dob,
        gender: data.gender,
        address: data.address,
        previousCourse: data.previousCourse,
        previousCourseOther: data.previousCourseOther,
        courseToLearn: data.courseToLearn,
        courseToLearnOther: data.courseToLearnOther,
        educationHistory: data.educationHistory,
        educationDocument: data.educationDocument,
        educationDocumentName: data.educationDocumentName,
        guardianName: data.guardianName,
        guardianPhone: data.guardianPhone,
        notes: data.notes,
        status: 'pending',
      },
    });

    return {
      ...submission,
      createdAt: submission.createdAt.toISOString(),
    } as StudentSubmission;
  }

  async getSubmissions(): Promise<StudentSubmission[]> {
    const submissions = await this.prisma.submission.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return submissions.map(s => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
    })) as StudentSubmission[];
  }

  async getSubmissionById(id: string): Promise<StudentSubmission | null> {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
    });

    if (!submission) return null;

    return {
      ...submission,
      createdAt: submission.createdAt.toISOString(),
    } as StudentSubmission;
  }

  async updateSubmissionStatus(id: string, status: string): Promise<boolean> {
    try {
      await this.prisma.submission.update({
        where: { id },
        data: { status },
      });
      return true;
    } catch {
      return false;
    }
  }

  async deleteSubmission(id: string): Promise<boolean> {
    try {
      await this.prisma.submission.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async getAdminSettings(): Promise<AdminSettings | null> {
    const settings = await this.prisma.adminSettings.findUnique({
      where: { id: 1 },
    });

    if (!settings) return null;

    return {
      username: settings.username,
      password: settings.password,
      exportedCount: settings.exportedCount,
    };
  }

  async updateAdminSettings(settings: AdminSettings): Promise<boolean> {
    try {
      await this.prisma.adminSettings.upsert({
        where: { id: 1 },
        update: {
          username: settings.username,
          password: settings.password || undefined,
          exportedCount: settings.exportedCount,
        },
        create: {
          id: 1,
          username: settings.username,
          password: settings.password!,
          exportedCount: settings.exportedCount || 0,
        },
      });
      return true;
    } catch {
      return false;
    }
  }
}
