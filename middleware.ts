import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const url = req.nextUrl;


    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const { payload } = await jwtVerify(token, SECRET);

        if (payload.role !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', req.url));
        }

        return NextResponse.next();
    } catch (err) {
        console.error('❌ JWT Error:', err);
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*', '/'],
};
