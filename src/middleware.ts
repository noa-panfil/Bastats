import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Assume 'auth_session' cookie indicates logged in state
    const authSession = request.cookies.get('auth_session');

    // Routes that are public
    const isLoginPage = request.nextUrl.pathname === '/login';
    const isPublicResource = request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/static') ||
        request.nextUrl.pathname.includes('.'); // images, icons etc

    // If user is not logged in and trying to access protected route
    if (!authSession && !isLoginPage && !isPublicResource) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If user is logged in and trying to access login page
    if (authSession && isLoginPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
