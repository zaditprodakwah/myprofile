import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin_session')?.value;
    
    if (adminSession !== 'authenticated') {
      // Could redirect to a login page or just block. For now, since there's no login page 
      // other than the dashboard itself handling the form, wait... 
      // The dashboard IS the login page right now. 
      // If we redirect them away, they can never login.
      // We should check how the dashboard handles auth currently.
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
