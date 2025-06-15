// app/api/auth/register/route.ts
import { supabase } from '@/lib/supabaseClient';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { username, password, role } = body;

    if (!username?.trim() || !password || !role) {
        return NextResponse.json({ error: 'Incomplete data' }, { status: 400 });
    }

    if (role !== 'user' && role !== 'admin') {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Optional: minimum password length
    if (password.length < 6) {
        return NextResponse.json({ error: 'Password too short (min. 6 chars)' }, { status: 400 });
    }



    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .maybeSingle();

    if (existingUser) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase.from('users').insert([
        {
            username: username,
            password: hashedPassword,
            role,
        },
    ]);

    if (error) {
        return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Registration successful' }, { status: 201 });
}
