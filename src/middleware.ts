import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Basic session check - in a real app this would check a cookie or header
  // For this MVP, we use the existence of an 'auth-storage' cookie (set by zustand persist if configured, 
  // though zustand uses localStorage by default. For SSR middleware, we'd need a cookie).
  // SINCE we are using client-side Zustand, middleware won't easily see localStorage.
  // So for this MVP, we'll keep it simple and skip complex middleware to avoid hydration loops 
  // UNLESS we move auth to cookies.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile'],
};
