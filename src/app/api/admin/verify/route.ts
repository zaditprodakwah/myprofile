import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { key } = await request.json();
    const adminKey = process.env.ADMIN_SECRET_KEY;

    if (!adminKey) {
      console.error('ADMIN_SECRET_KEY not configured on server.');
      return new NextResponse('Server misconfiguration', { status: 500 });
    }

    if (key === adminKey) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600 // 1 hour
      });
      return response;
    }

    return NextResponse.json({ success: false }, { status: 401 });
  } catch {
    return new NextResponse('Bad Request', { status: 400 });
  }
}
