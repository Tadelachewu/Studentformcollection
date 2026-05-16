import { StorageAdapter } from '../adapters/storage/StorageAdapter';
import { JsonFileStorageAdapter } from '../adapters/storage/JsonFileStorageAdapter';
import { SupabaseStorageAdapter } from '../adapters/storage/SupabaseStorageAdapter';
import { PrismaStorageAdapter } from '../adapters/storage/PrismaStorageAdapter';
import { StudentSubmission, AdminSettings } from '@/types';

class StorageService {
  private adapter: StorageAdapter | null = null;

  async getAdapter(): Promise<StorageAdapter> {
    if (this.adapter) return this.adapter;

    const provider = process.env.STORAGE_PROVIDER || (process.env.DATABASE_URL ? 'prisma' : 'json');

    try {
      if (provider === 'prisma' || (provider === 'supabase' && process.env.DATABASE_URL)) {
        this.adapter = new PrismaStorageAdapter();
      } else if (provider === 'supabase') {
        this.adapter = new SupabaseStorageAdapter();
      } else if (provider === 'json') {
        this.adapter = new JsonFileStorageAdapter();
      } else {
        console.warn(`Storage provider '${provider}' not natively supported. Defaulting to JSON storage.`);
        this.adapter = new JsonFileStorageAdapter();
      }

      await this.adapter.init();
      return this.adapter;
    } catch (error) {
      console.error('Failed to initialize storage adapter:', error);
      // On Vercel, JSON adapter will likely fail too, but we try to provide a fallback
      // or at least let the error bubble up if it's a critical failure
      if (!this.adapter || this.adapter instanceof JsonFileStorageAdapter) {
        throw error; // Rethrow if we can't even fall back or if the fallback failed
      }
      
      this.adapter = new JsonFileStorageAdapter();
      await this.adapter.init();
      return this.adapter;
    }
  }

  async saveSubmission(data: StudentSubmission) {
    const adapter = await this.getAdapter();
    return adapter.saveSubmission(data);
  }

  async getSubmissions() {
    const adapter = await this.getAdapter();
    return adapter.getSubmissions();
  }

  async getSubmissionById(id: string) {
    const adapter = await this.getAdapter();
    return adapter.getSubmissionById(id);
  }

  async updateSubmissionStatus(id: string, status: string) {
    const adapter = await this.getAdapter();
    return adapter.updateSubmissionStatus(id, status);
  }

  async deleteSubmission(id: string) {
    const adapter = await this.getAdapter();
    return adapter.deleteSubmission(id);
  }

  async getAdminSettings() {
    const adapter = await this.getAdapter();
    return adapter.getAdminSettings();
  }

  async updateAdminSettings(settings: AdminSettings) {
    const adapter = await this.getAdapter();
    return adapter.updateAdminSettings(settings);
  }
}

// Export as a singleton
export const storageService = new StorageService();
