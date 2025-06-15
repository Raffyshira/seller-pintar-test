import { z } from 'zod'

export const articleSchema = z.object({
    title: z.string().min(5, 'Title harus minimal 5 karakter'),
    content: z.string().min(20, 'Content harus minimal 20 karakter'),
    category_id: z.string().uuid({ message: 'Category wajib dipilih' }),
    thumbnail: z.string().url('Thumbnail harus berupa URL valid'),
})

export type ArticleInput = z.infer<typeof articleSchema>
