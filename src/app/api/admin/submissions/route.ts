import { NextResponse } from 'next/server';
import { storageService } from '@/services/StorageService';

export async function GET() {
  try {
    const submissions = await storageService.getSubmissions();
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
