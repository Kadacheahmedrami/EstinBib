"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Pencil, Trash2, Loader2, CheckCircle, XCircle, ChevronLeft, ChevronRight, Search, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Category {
  id: string
  name: string
  bookCount: number
}

interface Book {
  id: string
  title: string
  author: string
  inCategory: boolean
}

interface PaginationMeta {
  page: number
  pageSize: number
  totalBooks: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface BookResponse {
  books: Book[]
  pagination: PaginationMeta
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryBooks, setCategoryBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isBooksLoading, setIsBooksLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 5,
    totalBooks: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  })
  const [sortField, setSortField] = useState<string>("title")
  const [sortOrder, setSortOrder] = useState<string>("asc")
  const { toast } = useToast()

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const loadCategoryBooks = useCallback(async (categoryId: string) => {
    setIsBooksLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
        sort: sortField,
        order: sortOrder
      })
      
      if (debouncedSearchTerm) {
        queryParams.append("search", debouncedSearchTerm)
      }
      
      const url = `/api/dashboard/categories/${categoryId}/books?${queryParams.toString()}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(await response.text())
      }
      
      const data: BookResponse = await response.json()
      setCategoryBooks(data.books)
      setPagination(data.pagination)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load books",
        variant: "destructive",
      })
    } finally {
      setIsBooksLoading(false)
    }
  }, [toast, pagination.page, pagination.pageSize, debouncedSearchTerm, sortField, sortOrder])

  // Reset pagination when search changes
  useEffect(() => {
    if (editingCategory) {
      setPagination(prev => ({ ...prev, page: 1 }))
      loadCategoryBooks(editingCategory.id)
    }
  }, [debouncedSearchTerm, sortField, sortOrder, editingCategory, loadCategoryBooks])

  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard/categories")
      if (!response.ok) {
        throw new Error(await response.text())
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load categories",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    if (editingCategory) {
      loadCategoryBooks(editingCategory.id)
    }
  }, [editingCategory, loadCategoryBooks, pagination.page])

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/dashboard/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory.trim() }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      setNewCategory("")
      await loadCategories()
      toast({
        title: "Success",
        description: "Category added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add category",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateCategory = async (id: string, name: string) => {
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/dashboard/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      await loadCategories()
      toast({
        title: "Success",
        description: "Category updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/dashboard/categories/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      await loadCategories()
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleBookCategory = async (bookId: string, inCategory: boolean) => {
    if (!editingCategory) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/dashboard/categories/${editingCategory.id}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          bookId,
          action: inCategory ? "remove" : "add" 
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      // Update local state
      setCategoryBooks(prevBooks => 
        prevBooks.map(book => 
          book.id === bookId ? { ...book, inCategory: !inCategory } : book
        )
      )
      
      // Refresh category list to update book count
      await loadCategories()
      
      toast({
        title: "Success",
        description: `Book ${inCategory ? "removed from" : "added to"} category`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update book category",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handlePageSizeChange = (newSize: string) => {
    setPagination(prev => ({ ...prev, pageSize: parseInt(newSize), page: 1 }))
  }

  const handleSortChange = (field: string) => {
    if (field === sortField) {
      // Toggle order if same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      // New field, default to ascending
      setSortField(field)
      setSortOrder("asc")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={isSubmitting}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button 
                onClick={handleAddCategory}
                disabled={isSubmitting || !newCategory.trim()}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Books Count</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.bookCount}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingCategory(category)}
                    disabled={isSubmitting}
                    title="Edit category"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
        
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={isSubmitting}
                    title="Delete category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No categories found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {editingCategory && (
        <Dialog open={true} onOpenChange={(open) => {
          if (!open) setEditingCategory(null);
        }}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Category: {editingCategory.name}</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Category Details</TabsTrigger>
                <TabsTrigger value="books">Manage Books</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                <Input
                  placeholder="Category name"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                />
                <Button
                  onClick={() =>
                    handleUpdateCategory(editingCategory.id, editingCategory.name)
                  }
                  disabled={isSubmitting || !editingCategory.name.trim()}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Pencil className="h-4 w-4 mr-2" />
                  )}
                  Update Category
                </Button>
              </TabsContent>

              <TabsContent value="books" className="space-y-4 pt-4">
                <div className="flex space-x-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search books by title or author"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Sort:</span>
                    <Select value={sortField} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="author">Author</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    >
                      {sortOrder === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {isBooksLoading ? (
                  <div className="flex h-[200px] w-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="border rounded-md">
                    <div className="p-4">
                      <h3 className="mb-4 text-sm font-medium">
                        Books ({pagination.totalBooks})
                      </h3>
                      
                      {categoryBooks.length > 0 ? (
                        <div className="space-y-2">
                          {categoryBooks.map((book) => (
                            <div
                              key={book.id}
                              className="flex items-center justify-between space-x-2 rounded-md border p-2"
                            >
                              <div>
                                <p className="font-medium">{book.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {book.author}
                                </p>
                              </div>
                              <Button
                                variant={book.inCategory ? "outline" : "default"}
                                size="sm"
                                onClick={() => handleToggleBookCategory(book.id, book.inCategory)}
                                disabled={isSubmitting}
                              >
                                {book.inCategory ? (
                                  <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Remove
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Add
                                  </>
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          {searchTerm ? "No matching books found" : "No books available"}
                        </p>
                      )}
                      
                      {/* Pagination controls */}
                      {pagination.totalPages > 0 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <Select 
                              value={pagination.pageSize.toString()}
                              onValueChange={handlePageSizeChange}
                            >
                              <SelectTrigger className="w-[80px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                              </SelectContent>
                            </Select>
                            <span className="text-sm text-muted-foreground">per page</span>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              disabled={!pagination.hasPreviousPage || isBooksLoading}
                              onClick={() => handlePageChange(pagination.page - 1)}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline" 
                              size="icon"
                              disabled={!pagination.hasNextPage || isBooksLoading}
                              onClick={() => handlePageChange(pagination.page + 1)}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}