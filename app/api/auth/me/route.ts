// app/api/auth/me/route.ts
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { payload } = await jwtVerify(token, secret);

        return NextResponse.json({
            user: {
                id: payload.id,
                username: payload.username,
                role: payload.role,

            },
        });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }
}
