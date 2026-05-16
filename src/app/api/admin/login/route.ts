import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { storageService } from '@/services/StorageService';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Check database settings first
    const dbSettings = await storageService.getAdminSettings();
    
    const adminUser = dbSettings?.username || process.env.ADMIN_USERNAME || 'admin';
    const adminPass = dbSettings?.password || process.env.ADMIN_PASSWORD || 'admin123';

    if (username === adminUser && password === adminPass) {
      // Set a simple session cookie
      // In a real app, this should be a JWT or a session ID stored in a database
      const cookieStore = await cookies();
      cookieStore.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
