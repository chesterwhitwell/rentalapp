import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const publicRoutes = ['/', '/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  if (publicRoutes.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return response;
  }

  const hasSession = request.cookies.get('sb-access-token') || request.cookies.get('sb:token');
  if (!hasSession && pathname !== '/sign-in') {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
