import { StudentSubmission } from '@/types';
import { StorageAdapter } from './StorageAdapter';

export class MemoryStorageAdapter implements StorageAdapter {
  private submissions: Map<string, StudentSubmission> = new Map();

  async init(): Promise<void> {
    // No initialization needed for memory storage
    console.log('MemoryStorageAdapter initialized');
  }

  async saveSubmission(data: StudentSubmission): Promise<StudentSubmission> {
    const id = Date.now().toString();
    const submission = { ...data, id, status: 'pending' as const, createdAt: new Date().toISOString() };
    this.submissions.set(id, submission);
    return submission;
  }

  async getSubmissions(): Promise<StudentSubmission[]> {
    return Array.from(this.submissions.values()).sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }

  async getSubmissionById(id: string): Promise<StudentSubmission | null> {
    return this.submissions.get(id) || null;
  }

  async updateSubmissionStatus(id: string, status: string): Promise<StudentSubmission | null> {
    const submission = this.submissions.get(id);
    if (submission) {
      submission.status = status as any;
      this.submissions.set(id, submission);
      return submission;
    }
    return null;
  }
}
