"use client"

import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";

// Supabase Client
import { supabase } from "@/lib/supabaseClient";

// Custom Hooks
import { useDebounce } from "@/hooks/use-debounce";
import { useUser } from "@/hooks/use-user";

// Icon
import { PlusIcon } from "lucide-react";

// Custom Component
import PreviewButton from "../../../components/dashboard-components/button-preview";

// Shadcn UI Components
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export default function DashBoardPage() {
  // Get user data
  const { user } = useUser();

  // fetch article state
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true)

  // search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  // item will be displayed for pagination
  const itemsPerPage = 8;

  // use debounced for search and category
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedCategories = useDebounce(selectedCategory, 500);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  // handle delete projects
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from('articles').delete().eq('id', id);
    setDeletingId(null);

    if (error) {
      toast.error("Gagal menghapus artikel: " + error.message);
    } else {
      toast.success("Artikel berhasil dihapus");
      setArticles(prev => prev.filter(article => article.id !== id));
    }
  };



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
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id, title, slug, content, created_at, thumbnail,
          categories ( name )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setArticles(data)
        setFilteredArticles(data)
      }
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


  if (error) return <p>Error fetching articles: {error}</p>

  return (
    <div>
      <div className="p-5">
        <Card className="p-0">
          <h1 className="text-base font-medium border-b p-5">Total Article: {filteredArticles.length}</h1>
          {/* Search Functionality and Category Start */}
          <div className="flex  sm:items-center justify-between px-5 pb-4 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-3">
              <Select onValueChange={(value) => setSelectedCategory(value)}>
                <SelectTrigger className="w-[180px] mb-2 sm:mb-0">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Search by article title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-blue-600 text-white" asChild>
              <Link className="flex items-center" href={`/dashboard/${user?.id}/create`}>
                <PlusIcon className="m-0 sm:mr-1" size={16} aria-hidden='true' />
                <span className="hidden sm:flex">Add Articles</span>
              </Link>
            </Button>
          </div>
          {/* Search Functionality and Category End */}

          {/* Content Table for articles start */}
          {filteredArticles.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-5">Tidak ada artikel ditemukan.</p>
          ) : (
            <div className="w-full px-6">
              <div className="">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[120px] font-semibold text-gray-700">Thumbnails</TableHead>
                      <TableHead className="font-semibold text-gray-700">Title</TableHead>
                      <TableHead className="w-[120px] font-semibold text-gray-700">Category</TableHead>
                      <TableHead className="w-[180px] font-semibold text-gray-700">Created at</TableHead>
                      <TableHead className="w-[200px] font-semibold text-gray-700">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedArticles.map((article) => (
                      <TableRow key={article.id} className="hover:bg-gray-50">
                        <TableCell className="py-4">
                          <div className="w-16 h-12 rounded-md overflow-hidden bg-gray-100">
                            <Image
                              src={article.thumbnail}
                              alt={`Thumbnail for ${article.title}`}
                              width={64}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="font-medium text-gray-900 leading-5">{article.title}</div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                            {article.categories?.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-gray-600 text-sm">
                          {new Date(article.created_at).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false,
                            // format matcher menghindari 'at'
                            formatMatcher: 'basic'
                          }).replace(' at', '')}


                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex gap-2">
                            <PreviewButton
                              title={article.title}
                              content={article.content}
                              thumbnail={article.thumbnail}
                            />

                            <Button
                              variant="link"
                              size="sm"
                              className="text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
                            >
                              <Link href={`/dashboard/${user?.id}/edit/${article.id}`}>
                                Edit
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="link" size="sm" className="text-red-600 hover:text-red-800 p-0 h-auto font-normal">
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Articls</AlertDialogTitle>
                                  <AlertDialogDescription className="w-[22rem]">
                                    Deleting this article is permanent and cannot be undone.
                                    All related content will be removed.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-600 hover:bg-red-800" onClick={() => handleDelete(article.id)}>Confirm</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* Content Table for articles end*/}

                {/* Pagination start */}
                {filteredArticles.length > itemsPerPage && (
                  <div className="flex items-center justify-center gap-2 py-4 border-t">
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
                {/* Pagination end */}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
