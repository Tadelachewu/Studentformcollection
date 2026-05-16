import { StudentSubmission } from '@/types';
import { StorageAdapter } from './StorageAdapter';
import fs from 'fs/promises';
import path from 'path';

export class JsonFileStorageAdapter implements StorageAdapter {
  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), 'data', 'submissions.json');
  }

  async init(): Promise<void> {
    try {
      const dir = path.dirname(this.filePath);
      await fs.mkdir(dir, { recursive: true });
      try {
        await fs.access(this.filePath);
      } catch {
        await fs.writeFile(this.filePath, JSON.stringify([]));
      }
      console.log('JsonFileStorageAdapter initialized at', this.filePath);
    } catch (error) {
      console.error('Error initializing JsonFileStorageAdapter:', error);
      throw error;
    }
  }

  private async readData(): Promise<StudentSubmission[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private async writeData(data: StudentSubmission[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async saveSubmission(data: StudentSubmission): Promise<StudentSubmission> {
    const submissions = await this.readData();
    const id = Date.now().toString();
    const submission = { ...data, id, status: 'pending' as const, createdAt: new Date().toISOString() };
    submissions.push(submission);
    await this.writeData(submissions);
    return submission;
  }

  async getSubmissions(): Promise<StudentSubmission[]> {
    const submissions = await this.readData();
    return submissions.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }

  async getSubmissionById(id: string): Promise<StudentSubmission | null> {
    const submissions = await this.readData();
    return submissions.find(s => s.id === id) || null;
  }

  async updateSubmissionStatus(id: string, status: string): Promise<StudentSubmission | null> {
    const submissions = await this.readData();
    const index = submissions.findIndex(s => s.id === id);
    if (index !== -1) {
      submissions[index].status = status as any;
      await this.writeData(submissions);
      return submissions[index];
    }
    return null;
  }
}
