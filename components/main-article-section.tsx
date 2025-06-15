"use client"

import Link from "next/link";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useId, useState } from "react";

import removeMd from 'remove-markdown';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import { ArticleCardSkeleton } from "./skeletons/skeletons";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";

export default function MainArticleSection() {
    const [articles, setArticles] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const [currentPage, setCurrentPage] = useState<number>(1)
    const itemsPerPage = 8 // jumlah artikel per halaman

    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const debouncedCategories = useDebounce(selectedCategory, 500);

    const id = useId();

    useEffect(() => {
        setCurrentPage(1); // reset pagination saat filter berubah
    }, [searchTerm, selectedCategory]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from('categories').select('id, name')
            if (!error && data) {
                setCategories(data)
            }
        }

        fetchCategories()
    }, [])

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);

            const { data, error } = await supabase
                .from('articles')
                .select(`
          id, title, slug, content, created_at, thumbnail,
          categories ( name )
        `,)
                .order('created_at', { ascending: false })

            if (error) {
                setError(error.message)
            } else {
                setArticles(data)
                setFilteredArticles(data)
            }
            setIsLoading(false)
        }

        fetchArticles()
    }, [])

    useEffect(() => {
        const filtered = articles.filter((article) => {
            const matchSearch = article.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
            const matchCategory =
                !debouncedCategories || debouncedCategories === 'all'
                    ? true
                    : article.categories?.name === debouncedCategories;
            return matchSearch && matchCategory;
        });
        setFilteredArticles(filtered);
    }, [debouncedSearchTerm, debouncedCategories, articles]);

    const paginatedArticles = filteredArticles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);



    return (
        <>
            <div className="min-h-[600px] relative bg-blue-500 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('/img/hero-section-bg.jpg')", // Replace with your image URL
                    }}
                />
                <div className="absolute inset-0 bg-blue-600/80" />
                <div className="container mx-auto px-4 pt-16 pb-24 absolute left-1/2 bottom-1/2 translate-y-1/2 -translate-x-1/2 text-center">
                    <div className="text-white/90 mb-2 text-sm font-medium">Blog genzet</div>
                    <h1 className="text-white text-4xl md:text-5xl font-bold max-w-4xl mx-auto leading-tight drop-shadow-lg">
                        The Journal : Design Resources, Interviews, and Industry News
                    </h1>
                    <p className="text-white/95 mt-6 text-xl drop-shadow-md">Your daily dose of design insights!</p>

                    {/* Search and Filter */}
                    <div className="max-w-2xl mx-auto mt-12 bg-white/40 p-1.5 rounded-md flex flex-col sm:flex-row gap-3">
                        <div id={id} className="*:not-first:mt-2">
                            <Select onValueChange={(value) => setSelectedCategory(value)}>
                                <SelectTrigger className="w-[180px] mb-2 sm:mb-0 bg-white">
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    {categories.map((cat: any) => (
                                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div id={id} className="*:not-first:mt-2 relative flex-1">
                            <div className="relative">
                                <Input
                                    className="peer ps-9 pe-9 bg-white backdrop-blur-sm w-full"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    type="search"
                                />
                                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                    <SearchIcon size={16} />
                                </div>
                                <button
                                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label="Submit search"
                                    type="submit"
                                >
                                    <ArrowRightIcon size={16} aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto p-10">
                <h1 className="text-base font-medium pb-5">Showing : {paginatedArticles.length} of {filteredArticles.length} articles</h1>
                <div className=" w-full grid grid-cols-1 sm:grid-cols-3 gap-6 ">
                    {isLoading
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <ArticleCardSkeleton key={i} />
                        ))
                        : paginatedArticles.map((item, index) => (
                            <Link key={index} href={`/article/${item.slug}`}>
                                <Card className="overflow-hidden p-0 shadow-none border-none w-fit">
                                    <CardHeader className="p-0">
                                        <div className="aspect-video overflow-hidden">
                                            <Image
                                                src={item.thumbnail}
                                                width={300}
                                                height={300}
                                                loading="lazy"
                                                alt={item.title}
                                                className="w-full h-full rounded-md object-cover"
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="text-sm text-muted-foreground mb-1">
                                            {new Date(item.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "2-digit",
                                            })}
                                        </div>
                                        <h3 className="text-xl font-bold line-clamp-2 py-2">{item.title}</h3>
                                        <p className="text-muted-foreground mb-1 line-clamp-2">
                                            {removeMd(item.content ?? "").slice(0, 100)}
                                        </p>

                                    </CardContent>
                                    <CardFooter className="px-0 pb-6 pt-0">
                                        <div className="flex gap-2">
                                            <Badge
                                                variant="secondary"
                                                className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                                            >
                                                {item.categories?.name || "Tanpa Kategori"}
                                            </Badge>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                </div>
            </div>

            {filteredArticles.length > itemsPerPage && (
                <div className="flex items-center justify-center gap-2 pb-20">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} isDisabled={currentPage === 1} />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <PaginationItem key={i} onClick={() => setCurrentPage(i + 1)}>
                                    <PaginationLink>
                                        {i + 1}
                                    </PaginationLink>

                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} isDisabled={currentPage === totalPages} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

                </div>
            )}
        </>
    )
}