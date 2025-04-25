import { getServerSession } from "next-auth/next"
import { db } from "@/db"
import { books, categories, bookCategories } from "@/db/schema"
import { count, eq, like, or, sql, desc, and } from "drizzle-orm"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookSearch } from "@/components/dashboard/BookSearch"

interface SearchParams {
  search?: string
  category?: string
  page?: string
}

export default async function BooksPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const session = await getServerSession()
  const isLibrarian = session?.user?.role === "LIBRARIAN"

  const search = searchParams.search || ""
  const categoryId = searchParams.category || ""
  const page = Number.parseInt(searchParams.page || "1")
  const limit = 12
  const offset = (page - 1) * limit

  // Get all categories for filter
  const allCategories = await db.select().from(categories)

  // Build where conditions
  const whereConditions = []
  
  if (search) {
    whereConditions.push(
      or(
        like(books.title, `%${search}%`),
        like(books.author, `%${search}%`)
      )
    )
  }

  // Execute count query first
  const [{ value: total }] = await db
    .select({ value: count() })
    .from(books)
    .where(and(...whereConditions))

  // Build the subquery for category filter
  const bookIds = categoryId
    ? db
        .select({ id: books.id })
        .from(books)
        .innerJoin(bookCategories, eq(books.id, bookCategories.bookId))
        .where(eq(bookCategories.categoryId, categoryId))
    : undefined

  // Then execute the main query
  const booksResult = await db
    .select()
    .from(books)
    .where(
      and(
        ...whereConditions,
        bookIds ? sql`${books.id} IN (${bookIds})` : undefined
      )
    )
    .limit(limit)
    .offset(offset)
    .orderBy(desc(books.addedAt))

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Books</h1>
        {isLibrarian && (
          <Link href="/dashboard/books/add">
            <Button>Add New Book</Button>
          </Link>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-2">
            <BookSearch defaultValue={search} />
          </div>
          <div>
            <Select defaultValue={categoryId}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {booksResult.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No books found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {booksResult.map((book) => (
                <Link key={book.id} href={`/dashboard/books/${book.id}`} className="group">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-[2/3] relative">
                      <img
                        src={book.coverImage || "/placeholder.svg"}
                        alt={book.title}
                        className="object-cover w-full h-full"
                      />
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

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} asChild>
                    <Link
                      href={{
                        pathname: "/dashboard/books",
                        query: {
                          ...searchParams,
                          page: page - 1,
                        },
                      }}
                    >
                      Previous
                    </Link>
                  </Button>
                  <span className="text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
                    <Link
                      href={{
                        pathname: "/dashboard/books",
                        query: {
                          ...searchParams,
                          page: page + 1,
                        },
                      }}
                    >
                      Next
                    </Link>
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
