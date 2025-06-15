'use client'

import { Card } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField, FormItem, FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from '@/components/ui/select'
import { supabase } from '@/lib/supabaseClient'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import UploadThumnails from '../create-article-components/file-upload'

import PreviewButton from '@/components/dashboard-components/button-preview'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/use-user'
import { ArticleInput, articleSchema } from '@/lib/validator'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import MDXEditorWrapper from '../create-article-components/markdown-editor'


export default function EditArticleForm() {
    const router = useRouter()
    const { user } = useUser();
    const { articleId } = useParams()
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const form = useForm<ArticleInput>({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            title: '',
            content: '',
            category_id: '',
            thumbnail: '',
        },
    })

    // Fetch existing article + categories
    useEffect(() => {
        const fetchData = async () => {
            const { data: article, error: articleErr } = await supabase
                .from('articles')
                .select('*')
                .eq('id', articleId)
                .single()

            if (articleErr) {
                console.error('Gagal fetch article:', articleErr)
            } else {
                form.reset({
                    title: article.title,
                    content: article.content,
                    thumbnail: article.thumbnail,
                    category_id: article.category_id
                })
            }

            const { data: cats } = await supabase.from('categories').select('*')
            setCategories(cats ?? [])
            setLoading(false)
        }

        fetchData()
    }, [articleId, form])


    const onSubmit = async (values: ArticleInput) => {
        const { error } = await supabase
            .from('articles')
            .update(values)
            .eq('id', articleId)

        if (!error) {
            // router.push(`/dashboard/${user?.id}`);
            toast.success("Edit Article Berhasil")
        } else {
            toast.error('Gagal update artikel: ' + error.message)
        }
    }

    if (loading) return <p className="p-4">Loading...</p>

    const watchTitle = form.watch('title');
    const watchContent = form.watch('content');
    const watchThumbnail = form.watch('thumbnail');


    return (
        <Card className='p-5'>
            <Link
                className="flex items-center space-x-2 mb-4"
                href={`/dashboard/${user?.id}`}
            >
                <ArrowLeft size={16} />
                <span>Edit Articles</span>
            </Link>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
                    {/* Thumbnail */}
                    <FormField
                        control={form.control}
                        name="thumbnail"
                        render={({ field }) => (
                            <FormItem>
                                <UploadThumnails
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={form.formState.errors.thumbnail?.message}
                                />
                            </FormItem>
                        )}
                    />

                    {/* Title */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category */}
                    <FormField
                        control={form.control}
                        name="category_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Markdown Content */}
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <MDXEditorWrapper value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex items-center justify-end gap-4'>
                        <PreviewButton
                            title={watchTitle}
                            content={watchContent}
                            thumbnail={watchThumbnail}
                        />
                        <Button type="submit">
                            Update Article
                        </Button>
                    </div>

                    {/* Submit */}

                </form>
            </Form>
        </Card>

    )
}
