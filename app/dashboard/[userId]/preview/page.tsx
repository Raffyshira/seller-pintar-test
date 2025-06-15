'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import { useUser } from '@/hooks/use-user';

import { ArrowLeft } from 'lucide-react';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function PreviewPage() {
    const { user } = useUser();

    const router = useRouter()
    const [data, setData] = useState<{ title: string, content: string, thumbnail: string } | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem('preview-data')
        if (!stored) {
            router.push('/404') // atau notFound()
            return
        }
        setData(JSON.parse(stored))
    }, [])

    if (!data) return <p>Loading preview...</p>

    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col items-center space-y-4 mt-20">
            <div>
                <span className='text-sm font-medium text-slate-600'>4 Februari 2025 - Created by Admin</span>
            </div>
            <h1 className="text-3xl w-1/2 text-center font-bold">{data.title}</h1>
            <div className='py-5 w-full'>
                {data.thumbnail && (
                    <Image
                        src={data.thumbnail}
                        alt="Thumbnail"
                        className="w-full h-[32rem] object-cover rounded-md"
                        width={1120}
                        height={420}
                    />
                )}
            </div>


            <article className="prose dark:prose-invert max-w-none">
                <Markdown remarkPlugins={[remarkGfm]}>
                    {data.content}
                </Markdown>
            </article>
            <Link className='flex items-center mt-5' href={`/dashboard/${user?.id}`}>
                <ArrowLeft className='mr-2' size={16} aria-hidden />
                <span>Back to Dashboard</span>
            </Link>
        </div>
    )
}
