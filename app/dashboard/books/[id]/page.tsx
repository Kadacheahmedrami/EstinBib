import { getServerSession } from "next-auth/next"
import { db } from "@/db"
import { books, categories, bookCategories, borrows, users } from "@/db/schema"
import { eq, and, isNull } from "drizzle-orm"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { BorrowBookButton } from "@/components/dashboard/BorrowBookButton"
import { ReturnBookButton } from "@/components/dashboard/ReturnBookButton"


interface PageProps {
  params: Promise<{ id: string }>
  
}
export default async function BookDetailsPage({ params }: PageProps) {
  const session = await getServerSession()


  // Get book details
  const book = await db.query.books.findFirst({
    where: eq(books.id, (await params).id),
  })

  if (!book) {
    notFound()
  }

  // Get book categories
  const bookCategoriesResult = await db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(bookCategories)
    .innerJoin(categories, eq(bookCategories.categoryId, categories.id))
    .where(eq(bookCategories.bookId, book.id))

  // Get current borrow status if not available
  let currentBorrow = null
  if (!book.available) {
    currentBorrow = await db
      .select({
        id: borrows.id,
        userName: users.name,
        borrowedAt: borrows.borrowedAt,
        dueDate: borrows.dueDate,
      })
      .from(borrows)
      .innerJoin(users, eq(borrows.userId, users.id))
      .where(and(eq(borrows.bookId, book.id), isNull(borrows.returnedAt)))
      .limit(1)
  }

  // Check if current user has borrowed this book
  let userHasBorrowed = false
  if (session?.user?.id) {
    const userBorrow = await db
      .select({ id: borrows.id })
      .from(borrows)
      .where(and(eq(borrows.bookId, book.id), eq(borrows.userId, session.user.id), isNull(borrows.returnedAt)))
      .limit(1)

    userHasBorrowed = userBorrow.length > 0
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Book Details</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/books">Back to Books</Link>
          </Button>
          { (
            <Button asChild>
              <Link href={`/dashboard/books/${book.id}/edit`}>Edit Book</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 lg:w-1/4">
              <Image
                src={book.coverImage || "/placeholder.svg"}
                alt={book.title}
                className="object-cover w-full h-full"
                width={500}
                height={750}
              />
          </div>
          <div className="p-6 md:w-2/3 lg:w-3/4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold mr-2">{book.title}</h2>
              <Badge variant={book.available ? "default" : "destructive"}>
                {book.available ? "Available" : "Borrowed"}
              </Badge>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">by {book.author}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ISBN</h3>
                <p>{book.isbn || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Language</h3>
                <p>{book.language}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Published Date</h3>
                <p>{format(new Date(book.publishedAt), "MMMM d, yyyy")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Size</h3>
                <p>{book.size} pages</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Added to Library</h3>
                <p>{format(new Date(book.addedAt), "MMMM d, yyyy")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Categories</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {bookCategoriesResult.map((category) => (
                    <Badge key={category.id} variant="outline">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300">{book.description}</p>
            </div>

            {!book.available && currentBorrow && currentBorrow.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Current Borrow Status</h3>
                <p>
                  Borrowed by: <span className="font-medium">{currentBorrow[0].userName}</span>
                </p>
                <p>Borrowed on: {format(new Date(currentBorrow[0].borrowedAt), "MMMM d, yyyy")}</p>
                <p>Due date: {format(new Date(currentBorrow[0].dueDate), "MMMM d, yyyy")}</p>
                {  (
                  <div className="mt-3">
                    <ReturnBookButton borrowId={currentBorrow[0].id} />
                  </div>
                )}
              </div>
            )}

            { (
              <div className="mt-6">
                {book.available ? (
                  <BorrowBookButton bookId={book.id} />
                ) : userHasBorrowed ? (
                  <Button disabled>Currently Borrowed By You</Button>
                ) : (
                  <Button disabled>Currently Unavailable</Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}