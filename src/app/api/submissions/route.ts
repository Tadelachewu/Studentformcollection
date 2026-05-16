import { NextResponse } from 'next/server';
import { storageService } from '@/services/StorageService';
import { emailService } from '@/services/EmailService';
import { StudentSubmission } from '@/types';

export async function POST(request: Request) {
  try {
    const data: StudentSubmission = await request.json();

    // Basic server-side validation
    if (!data.fullName || !data.email || !data.phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to database-agnostic storage
    const savedSubmission = await storageService.saveSubmission(data);

    // Send emails (async, don't await if you don't want to block, but awaiting here for simplicity)
    if (savedSubmission.id) {
      await emailService.sendConfirmationEmail(data.email, data.fullName);
      await emailService.sendAdminNotification(savedSubmission.id, data.fullName);
    }

    return NextResponse.json(savedSubmission, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
