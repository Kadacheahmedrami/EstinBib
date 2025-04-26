// app/dashboard/books/page.tsx
'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookSearch } from "@/components/dashboard/BookSearch"

interface Book {
  id: string
  title: string
  author: string
  available: boolean
  coverImage: string
  description: string
  isbn: string | null
  addedAt: string
}

interface Category {
  id: string
  name: string
}

interface BooksResponse {
  books: Book[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export default function BooksPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [data, setData] = useState<BooksResponse | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const search = searchParams.get("search") || ""
  const categoryId = searchParams.get("category") || ""
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "12")

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/dashboard/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    fetchCategories()
  }, [])

  // Fetch books whenever search parameters change
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      setError(null)
      try {
        const queryParams = new URLSearchParams()
        if (search) queryParams.set("search", search)
        if (categoryId) queryParams.set("category", categoryId)
        queryParams.set("page", page.toString())
        queryParams.set("limit", limit.toString())

        const response = await fetch(`/api/dashboard/books?${queryParams.toString()}`)
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("You need to be logged in to view books")
          } else {
            throw new Error("Failed to fetch books")
          }
        }
        
        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error("Error:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [search, categoryId, page, limit])

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete("category")
    } else {
      params.set("category", value)
    }
    params.set("page", "1") // Reset to first page when changing category
    router.push(`/dashboard/books?${params.toString()}`)
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Books</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Books</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Books</h1>
        <Link href="/dashboard/books/add">
          <Button>Add New Book</Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-2">
            <BookSearch defaultValue={search} />
          </div>
          <div>
            <Select defaultValue={categoryId || "all"} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!data || data.books.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No books found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.books.map((book) => (
                <Link key={book.id} href={`/dashboard/books/${book.id}`} className="group">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-[2/3] relative bg-gray-100 dark:bg-gray-600">
                      {book.coverImage && (
                        <div 
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${book.coverImage})` }}
                        />
                      )}
                      {!book.available && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-medium px-2 py-1 rounded">
                            Borrowed
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{book.author}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {data.pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={page <= 1}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      params.set("page", (page - 1).toString())
                      router.push(`/dashboard/books?${params.toString()}`)
                    }}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {page} of {data.pagination.pages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={page >= data.pagination.pages}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      params.set("page", (page + 1).toString())
                      router.push(`/dashboard/books?${params.toString()}`)
                    }}
                  >
                    Next
                  </Button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}