import { NextResponse } from 'next/server';
import { storageService } from '@/services/StorageService';
import { isAuthenticated } from '@/utils/auth';

export async function GET() {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const submissions = await storageService.getSubmissions();
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
