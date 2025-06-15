// app/api/articles/route.ts
import { supabase } from '@/lib/supabaseClient'
import { articleSchema } from '@/lib/validator'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const parsed = articleSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
        }

        const { data, error } = await supabase.from('articles').insert([{
            ...parsed.data,
            slug: parsed.data.title.toLowerCase().replace(/\s+/g, '-'),
        }])

        if (error) {
            return NextResponse.json({ error }, { status: 500 })
        }

        return NextResponse.json({ data }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '5')
    const offset = parseInt(searchParams.get('offset') || '0')

    let baseQuery = supabase
        .from('articles')
        .select('id, title, categories(name)', { count: 'exact' })
        .order('created_at', { ascending: false })

    if (search) {
        baseQuery = baseQuery.or(`title.ilike.%${search}%,categories.name.ilike.%${search}%`)
    }

    if (category) {
        baseQuery = baseQuery.eq('category_id', category)
    }

    const { data, error, count } = await baseQuery.range(offset, offset + limit - 1)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const totalPages = Math.ceil((count || 0) / limit)

    const formatted = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        category_name: item.categories?.name || '-',
    }))

    return NextResponse.json({ articles: formatted, totalPages })
}

