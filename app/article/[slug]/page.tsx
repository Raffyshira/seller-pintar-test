import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    await Promise.resolve(params); // solve false-positive warning

    const slug = params.slug;
    const { data: article, error } = await supabase
        .from('articles')
        .select(`
          id, title, slug, content, created_at, thumbnail, category_id,
          categories ( name )`)
        .eq('slug', slug)
        .single();

    if (error || !article) {
        return notFound();
    }

    // Fetch related articles from same category
    const { data: relatedArticles } = await supabase
        .from('articles')
        .select('id, title, slug, thumbnail, created_at, content, categories ( name )')
        .eq('category_id', article.category_id)
        .neq('id', article.id)
        .order('created_at', { ascending: false })
        .limit(3);



    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col items-center space-y-4 mt-20">
            <div>
                <span className="text-sm font-medium text-slate-600">
                    {new Date(article.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}{' '}
                    - Created by Admin
                </span>
            </div>

            <h1 className="text-3xl w-full sm:w-1/2 text-center font-bold">{article.title}</h1>

            <div className="py-5 w-full">
                {article.thumbnail && (
                    <Image
                        src={article.thumbnail}
                        alt="Thumbnail"
                        className="w-full min-h-[200px] sm:h-[24rem] object-cover rounded-md"
                        width={600}
                        height={420}
                    />
                )}
            </div>

            <article className="prose dark:prose-invert max-w-none">
                <Markdown remarkPlugins={[remarkGfm]}>{article.content}</Markdown>
            </article>

            {/* Related articles */}
            {relatedArticles && relatedArticles.length > 0 && (
                <div className="mt-16 w-full">
                    <h2 className="text-xl font-semibold mb-4 text-center">Artikel Lainnya</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedArticles.map((related, index) => (
                            <Link key={index} href={`/article/${related.slug}`}>
                                <Card className="overflow-hidden p-0 shadow-none border-none w-fit">
                                    <CardHeader className="p-0">
                                        <div className="aspect-video overflow-hidden">
                                            <Image
                                                src={related.thumbnail}
                                                width={300}
                                                height={300}
                                                loading="lazy"
                                                alt={related.title}
                                                className="w-full h-full rounded-md object-cover"
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="text-sm text-muted-foreground mb-1">
                                            {new Date(related.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "2-digit",
                                            })}
                                        </div>
                                        <h3 className="text-xl font-bold line-clamp-2 py-2">{related.title}</h3>
                                        <p className="text-muted-foreground mb-1 line-clamp-2">
                                            {related.content?.slice(80, 160) ?? ""}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="px-0 pb-6 pt-0">
                                        <div className="flex gap-2">
                                            <Badge
                                                variant='secondary'
                                                className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                                            >
                                                {related.categories?.name || "Desain"}
                                            </Badge>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
