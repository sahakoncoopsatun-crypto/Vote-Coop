import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPath = request.nextUrl.pathname === '/admin/login';
  
  if (isAdminPath && !isLoginPath) {
    const token = request.cookies.get('adminToken');
    if (!token || token.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (isLoginPath) {
    const token = request.cookies.get('adminToken');
    if (token && token.value === 'authenticated') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
}

export const config = {
  matcher: '/admin/:path*',
};
