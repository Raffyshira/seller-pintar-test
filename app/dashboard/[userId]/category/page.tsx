"use client"


import { useEffect, useState } from "react";

// Supabase Client
import { supabase } from "@/lib/supabaseClient";

// Custom Hooks
import { useDebounce } from "@/hooks/use-debounce";
import { useUser } from "@/hooks/use-user";

// Icon

// Custom Component

// Shadcn UI Components
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export default function CategoryPages() {
    // Get user data
    const { user } = useUser();

    // fetch article state
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

    // search state
    const [error, setError] = useState<string | null>(null);

    // pagination state
    const [currentPage, setCurrentPage] = useState(1);
    // item will be displayed for pagination
    const itemsPerPage = 8;

    // use debounced for search and category
    const [searchCategoryTerm, setSearchCategoryTerm] = useState('');
    const debouncedSearchCategoryTerm = useDebounce(searchCategoryTerm, 500);


    const handleAddCategory = async () => {
        const { data, error } = await supabase.from('categories').insert({ name: newCategoryName }).select();
        if (!error && data) {
            setCategories(prev => [...prev, ...data]);
            setNewCategoryName('');
            setIsDialogOpen(false);
        } else {
            toast.error(error?.message || 'Gagal menambahkan kategori');
        }
    };

    const handleEditCategory = async () => {
        if (!editingCategory || !editingCategoryName.trim()) {
            toast.error("Nama kategori tidak boleh kosong.");
            return;
        }

        const { error } = await supabase
            .from('categories')
            .update({ name: editingCategoryName.trim() })
            .eq('id', editingCategory.id);

        if (error) {
            toast.error(error.message || 'Gagal mengedit kategori');
        } else {
            setCategories(prev =>
                prev.map(cat =>
                    cat.id === editingCategory.id
                        ? { ...cat, name: editingCategoryName.trim() }
                        : cat
                )
            );
            setIsEditDialogOpen(false);
            toast.success("Kategori berhasil diedit.");
        }
    };

    const handleDeleteCategory = async (id: string) => {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (!error) {
            setCategories(prev => prev.filter(cat => cat.id !== id));
            toast.success("Kategori berhasil dihapus");
        } else {
            toast.error("Gagal menghapus kategori: " + error.message);
        }
    };


    useEffect(() => {
        setCurrentPage(1); // reset pagination saat filter berubah
    }, [searchCategoryTerm]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from('categories').select('id, name, created_at')
            if (!error && data) {
                setCategories(data)
            }
        }

        fetchCategories()
    }, [])

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(debouncedSearchCategoryTerm.toLowerCase())
    );




    if (error) return <p>Error fetching articles: {error}</p>

    return (
        <div>
            <div className="p-5">
                <Card className="p-0">
                    <h1 className="text-base font-medium border-b p-5">Total Article: {categories.length}</h1>
                    {/* Search Functionality and Category Start */}
                    <div className="flex  sm:items-center justify-between px-5 pb-4 border-b">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-3">
                            <Input
                                placeholder="Search categories..."
                                value={searchCategoryTerm}
                                onChange={(e) => setSearchCategoryTerm(e.target.value)}
                                className="mb-4 w-full"
                            />

                        </div>
                        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button className="bg-blue-600 text-white" asChild>
                                    <span className="hidden sm:flex">Add Articles</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="w-96 h-fit">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Add Category</AlertDialogTitle>
                                </AlertDialogHeader>
                                <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nama kategori" />
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleAddCategory} className="bg-blue-600 hover:bg-blue-800">Confirm</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </div>
                    {/* Search Functionality and Category End */}

                    {/* Content Table for articles start */}
                    {filteredCategories.length === 0 ? (
                        <p className="text-center text-sm text-gray-500 py-5">Tidak ada artikel ditemukan.</p>
                    ) : (
                        <div className="w-full px-6">
                            <div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead className="w-[120px] font-semibold text-gray-700">Category</TableHead>
                                            <TableHead className="w-[180px] font-semibold text-gray-700">Created at</TableHead>
                                            <TableHead className="w-[200px] font-semibold text-gray-700">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCategories.map((category) => (
                                            <TableRow key={category.id} className="hover:bg-gray-50">
                                                <TableCell className="py-4">
                                                    <div className="font-medium text-gray-900 leading-5">{category.name}</div>
                                                </TableCell>
                                                <TableCell className="py-4 text-gray-600 text-sm">
                                                    {new Date(category.created_at).toLocaleString('en-US', {
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
                                                        <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="link"
                                                                    size="sm"
                                                                    className="text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
                                                                    onClick={() => {
                                                                        setEditingCategory(category);
                                                                        setEditingCategoryName(category.name);
                                                                        setIsEditDialogOpen(true); // optional, kalau mau kontrol manual
                                                                    }}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogTitle>Edit Category</AlertDialogTitle>
                                                                <Input value={editingCategoryName} onChange={(e) => setEditingCategoryName(e.target.value)} />
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={handleEditCategory} className="bg-red-600 hover:bg-red-800">Confirm</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="link" onClick={() => setDeletingCategoryId(category.id)} size="sm" className="text-red-600 hover:text-red-800 p-0 h-auto font-normal">
                                                                    Delete
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                                                    <AlertDialogDescription className="w-[22rem]">
                                                                        Deleting this article is permanent and cannot be undone.
                                                                        All related content will be removed.
                                                                    </AlertDialogDescription>

                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => {
                                                                        if (deletingCategoryId) handleDeleteCategory(deletingCategoryId);
                                                                    }} className="bg-red-600 hover:bg-red-800" >Confirm</AlertDialogAction>
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

                                {/* Pagination end */}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
