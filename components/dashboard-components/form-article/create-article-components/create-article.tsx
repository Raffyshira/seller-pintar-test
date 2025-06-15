'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';


import { useUser } from '@/hooks/use-user';
import { supabase } from '@/lib/supabaseClient';

import PreviewButton from '@/components/dashboard-components/button-preview';

// form validation zod
import { ArticleInput, articleSchema } from '@/lib/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import UploadThumnails from './file-upload';
import MDXEditorWrapper from './markdown-editor';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';


export default function FormCreateArticle() {
    const router = useRouter();
    const { user } = useUser();

    const [categories, setCategories] = useState<any[]>([])

    const form = useForm<ArticleInput>({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            title: '',
            content: '',
            category_id: '',
            thumbnail: ''
        },
    })

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('*')
            setCategories(data || [])
        }
        fetchCategories()
    }, [])


    const generateSlug = (text: string) =>
        text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')

    const onSubmit = async (values: ArticleInput) => {
        const slug = generateSlug(values.title)
        const { error } = await supabase.from('articles').insert({
            ...values,
            user_id: user?.id,
            slug,
        })

        if (!error) {
            router.push(`/dashboard/${user?.id}`);
            toast.success("Article Berhasil Dibuat");
        } else {
            toast.error('Gagal membuat artikel: ' + error.message)
        }
    }

    // for preview page
    const watchTitle = form.watch('title');
    const watchContent = form.watch('content');
    const watchThumbnail = form.watch('thumbnail');


    return (
        <Card className="p-5">
            <Link
                className="flex items-center space-x-2 mb-4"
                href={`/dashboard/${user?.id}`}
            >
                <ArrowLeft size={16} />
                <span>Create Articles</span>
            </Link>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((cat) => (
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
                        <Button variant='outline' asChild>
                            <Link href={`/dashboard/${user?.id}`}>Cancel</Link>
                        </Button>
                        <PreviewButton
                            title={watchTitle}
                            content={watchContent}
                            thumbnail={watchThumbnail}
                            className='bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 h-9 px-4 py-2 has-[>svg]:px-3'
                        />
                        <Button
                            type="submit"
                            className="bg-blue-600 text-white"
                        >
                            Upload
                        </Button>
                    </div>
                </form>
            </Form>
        </Card>
    )
}
