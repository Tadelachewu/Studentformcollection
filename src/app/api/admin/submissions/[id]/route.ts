import { NextResponse } from 'next/server';
import { storageService } from '@/services/StorageService';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { status } = await request.json();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const updatedSubmission = await storageService.updateSubmissionStatus(id, status);

    if (!updatedSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
