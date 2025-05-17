import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;
  const isPublicPath = ['/', '/login', '/signup', '/reset-password', '/oauth/kakao'].includes(
    pathname
  );

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|icons).*)'],
};
