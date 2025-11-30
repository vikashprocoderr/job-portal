import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const token = request.cookies.get('authToken')?.value;

    // Protected routes - sirf logged-in users ja sakte hain
    const PROTECTED_ROUTES = ['/dashboard', '/jobs', '/profile'];
    
    // Agar protected route par jana chahta hai
    if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
        // Agar token nahi hai to login par bhej do
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Agar logged-in user login/register page par jane ki koshish kare
    // Lekin landing page ("/") par kabhi bhi auto-redirect na ho
    if ((pathname === '/login' || pathname === '/register') && token) {
        // Dashboard par bhej do
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
