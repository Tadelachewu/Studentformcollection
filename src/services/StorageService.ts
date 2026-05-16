import { StorageAdapter } from '../adapters/storage/StorageAdapter';
import { MemoryStorageAdapter } from '../adapters/storage/MemoryStorageAdapter';
import { JsonFileStorageAdapter } from '../adapters/storage/JsonFileStorageAdapter';
import { StudentSubmission } from '@/types';

class StorageService {
  private adapter: StorageAdapter | null = null;

  async getAdapter(): Promise<StorageAdapter> {
    if (this.adapter) return this.adapter;

    const provider = process.env.STORAGE_PROVIDER || 'json';

    try {
      if (provider === 'memory') {
        this.adapter = new MemoryStorageAdapter();
      } else if (provider === 'json') {
        this.adapter = new JsonFileStorageAdapter();
      } else {
        console.warn(`Storage provider '${provider}' not natively supported in this demo. Falling back to JSON storage.`);
        this.adapter = new JsonFileStorageAdapter();
      }

      await this.adapter.init();
      return this.adapter;
    } catch (error) {
      console.error('Failed to initialize primary storage adapter, falling back to MemoryStorageAdapter:', error);
      this.adapter = new MemoryStorageAdapter();
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
}

// Export as a singleton
export const storageService = new StorageService();
