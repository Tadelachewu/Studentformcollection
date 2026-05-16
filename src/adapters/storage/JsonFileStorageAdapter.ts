import { StudentSubmission, AdminSettings } from '@/types';
import { StorageAdapter } from './StorageAdapter';
import fs from 'fs/promises';
import path from 'path';

export class JsonFileStorageAdapter implements StorageAdapter {
  private filePath: string;
  private settingsPath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), 'data', 'submissions.json');
    this.settingsPath = path.join(process.cwd(), 'data', 'settings.json');
  }

  async init(): Promise<void> {
    try {
      const dir = path.dirname(this.filePath);
      await fs.mkdir(dir, { recursive: true });
      
      // Ensure submissions file exists
      try {
        await fs.access(this.filePath);
      } catch {
        await fs.writeFile(this.filePath, JSON.stringify([]));
      }

      // Ensure settings file exists
      try {
        await fs.access(this.settingsPath);
      } catch {
        await fs.writeFile(this.settingsPath, JSON.stringify(null));
      }
      
      console.log('JsonFileStorageAdapter initialized');
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

  async updateSubmissionStatus(id: string, status: string): Promise<boolean> {
    const submissions = await this.readData();
    const index = submissions.findIndex(s => s.id === id);
    if (index !== -1) {
      submissions[index].status = status as any;
      await this.writeData(submissions);
      return true;
    }
    return false;
  }

  async deleteSubmission(id: string): Promise<boolean> {
    const submissions = await this.readData();
    const filtered = submissions.filter(s => s.id !== id);
    if (filtered.length < submissions.length) {
      await this.writeData(filtered);
      return true;
    }
    return false;
  }

  async getAdminSettings(): Promise<AdminSettings | null> {
    try {
      const data = await fs.readFile(this.settingsPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async updateAdminSettings(settings: AdminSettings): Promise<boolean> {
    try {
      await fs.writeFile(this.settingsPath, JSON.stringify(settings, null, 2));
      return true;
    } catch {
      return false;
    }
  }
}
