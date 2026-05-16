import { StudentSubmission, AdminSettings } from '@/types';

export interface StorageAdapter {
  init(): Promise<void>;
  saveSubmission(data: StudentSubmission): Promise<StudentSubmission>;
  getSubmissions(): Promise<StudentSubmission[]>;
  getSubmissionById(id: string): Promise<StudentSubmission | null>;
  updateSubmissionStatus(id: string, status: string): Promise<boolean>;
  deleteSubmission(id: string): Promise<boolean>;
  getAdminSettings(): Promise<AdminSettings | null>;
  updateAdminSettings(settings: AdminSettings): Promise<boolean>;
}
