import { supabase } from "@/lib/supabaseClient"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const page = Number(searchParams.get('page') || 1)
    const pageSize = 10
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, count, error } = await supabase
        .from('categories')
        .select('*', { count: 'exact' })
        .ilike('name', `%${search}%`)
        .range(from, to)

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

    return Response.json({ data, count, page, pageSize })
}