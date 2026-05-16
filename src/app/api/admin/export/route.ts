import { NextResponse } from 'next/server';
import { storageService } from '@/services/StorageService';
import { isAuthenticated } from '@/utils/auth';
import * as XLSX from 'xlsx';

export async function GET(request: Request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limitStr = searchParams.get('limit');
    const limit = limitStr ? parseInt(limitStr) : 50;

    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json({ error: 'Invalid limit' }, { status: 400 });
    }

    const settings = await storageService.getAdminSettings();
    const currentExportedCount = settings?.exportedCount || 0;

    const allSubmissions = await storageService.getSubmissions();
    // getSubmissions is sorted by desc by default in our adapters, but for export history logic
    // we should probably use asc to export the "oldest first" among the new ones.
    // However, our current adapters don't have a specific sort option in the interface.
    // Let's sort them here for consistency.
    const sortedSubmissions = [...allSubmissions].sort((a, b) => 
      new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
    );

    const toExport = sortedSubmissions.slice(currentExportedCount, currentExportedCount + limit);

    if (toExport.length === 0) {
      return NextResponse.json({ error: 'No new submissions to export' }, { status: 404 });
    }

    // Prepare data for Excel
    const data = toExport.map(sub => ({
      ID: sub.id,
      'Full Name': sub.fullName,
      Email: sub.email,
      Phone: sub.phone,
      DOB: sub.dob,
      Gender: sub.gender,
      Address: sub.address,
      'Previous Course': sub.previousCourse === 'Other' ? sub.previousCourseOther : sub.previousCourse,
      'Course to Learn': sub.courseToLearn === 'Other' ? sub.courseToLearnOther : sub.courseToLearn,
      'Education History': sub.educationHistory,
      'Guardian Name': sub.guardianName,
      'Guardian Phone': sub.guardianPhone,
      Status: sub.status,
      'Submitted At': sub.createdAt
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Update history count
    await storageService.updateAdminSettings({
      ...settings!,
      exportedCount: currentExportedCount + toExport.length
    });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=submissions_${Date.now()}.xlsx`
      }
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
