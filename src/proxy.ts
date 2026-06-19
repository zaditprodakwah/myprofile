import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin_session');
    
    // Check if user has authenticated session
    if (!adminSession || adminSession.value !== 'authenticated') {
      // Allow access to the dashboard page itself (it handles the login form)
      // but protect other internal routes under /admin if they exist.
      // Wait, the login form is ON /admin/dashboard. So we can't block /admin/dashboard completely
      // unless we move the login form to /admin/login.
      // Let's protect all API routes starting with /api/admin instead, except /api/admin/verify.
    }
  }

  if (request.nextUrl.pathname.startsWith('/api/admin') && !request.nextUrl.pathname.startsWith('/api/admin/verify')) {
    const adminSession = request.cookies.get('admin_session');
    if (!adminSession || adminSession.value !== 'authenticated') {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
