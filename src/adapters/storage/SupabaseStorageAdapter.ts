import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StorageAdapter } from './StorageAdapter';
import { StudentSubmission, AdminSettings } from '@/types';

export class SupabaseStorageAdapter implements StorageAdapter {
  private supabase: SupabaseClient | null = null;

  async init() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error('Supabase credentials missing: SUPABASE_URL and SUPABASE_ANON_KEY must be set.');
    }

    this.supabase = createClient(url, key);
  }

  async saveSubmission(data: StudentSubmission): Promise<StudentSubmission> {
    if (!this.supabase) throw new Error('Supabase adapter not initialized');

    const id = Date.now().toString();
    const newSubmission = {
      ...data,
      id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const { error } = await this.supabase
      .from('submissions')
      .insert([newSubmission]);

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(`Failed to save submission to Supabase: ${error.message}`);
    }

    return newSubmission as any as StudentSubmission;
  }

  async getSubmissions(): Promise<StudentSubmission[]> {
    if (!this.supabase) throw new Error('Supabase adapter not initialized');

    const { data, error } = await this.supabase
      .from('submissions')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return [];
    }

    return (data || []) as any as StudentSubmission[];
  }

  async getSubmissionById(id: string): Promise<StudentSubmission | null> {
    if (!this.supabase) throw new Error('Supabase adapter not initialized');

    const { data, error } = await this.supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase fetch by ID error:', error);
      return null;
    }

    return data as any as StudentSubmission;
  }

  async updateSubmissionStatus(id: string, status: string): Promise<boolean> {
    if (!this.supabase) throw new Error('Supabase adapter not initialized');

    const { error } = await this.supabase
      .from('submissions')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Supabase update error:', error);
      return false;
    }

    return true;
  }

  async deleteSubmission(id: string): Promise<boolean> {
    if (!this.supabase) return false;
    const { error } = await this.supabase
      .from('submissions')
      .delete()
      .eq('id', id);
    return !error;
  }

  async getAdminSettings(): Promise<AdminSettings | null> {
    if (!this.supabase) return null;

    const { data, error } = await this.supabase
      .from('admin_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) return null;
    return {
      username: data.username,
      password: data.password,
      exportedCount: data.exportedCount || 0
    } as AdminSettings;
  }

  async updateAdminSettings(settings: AdminSettings): Promise<boolean> {
    if (!this.supabase) return false;

    const { error } = await this.supabase
      .from('admin_settings')
      .upsert({ 
        id: 1, 
        username: settings.username, 
        password: settings.password,
        exportedCount: settings.exportedCount || 0
      });

    return !error;
  }
}
