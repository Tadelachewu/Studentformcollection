import { StudentSubmission } from '@/types';

export interface StorageAdapter {
  init(): Promise<void>;
  saveSubmission(data: StudentSubmission): Promise<StudentSubmission>;
  getSubmissions(): Promise<StudentSubmission[]>;
  getSubmissionById(id: string): Promise<StudentSubmission | null>;
  updateSubmissionStatus(id: string, status: string): Promise<StudentSubmission | null>;
}
