import { getServerSession } from "next-auth/next"
import { db } from "@/db"
import { books, borrows, users, bookRequests } from "@/db/schema"
import { count, eq, isNull, gt, and, sql } from "drizzle-orm"
import DashboardCard from "@/components/dashboard/DashboardCard"
import RecentBorrowsTable from "@/components/dashboard/RecentBorrowsTable"
import PopularBooksChart from "@/components/dashboard/PopularBooksChart"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"

interface PendingRequest {
  id: string
  title: string
  author: string
  requestedAt: Date
  userName: string
}

export default async function DashboardPage() {
  const session = await getServerSession()

  // Ensure only librarians can access this page
  // if (!session || session.user?.role !== "LIBRARIAN") {
  //   redirect("/")
  // }

  // Initialize default values
  let totalBooks = [{ count: 0 }]
  let availableBooks = [{ count: 0 }]
  let borrowedBooks = [{ count: 0 }]
  let overdueBooks = [{ count: 0 }]
  let pendingRequests: PendingRequest[] = []
  let error = null

  try {
    // Get stats
    [totalBooks, availableBooks, borrowedBooks, overdueBooks] = await Promise.all([
      db.select({ count: count() }).from(books),
      db.select({ count: count() }).from(books).where(eq(books.available, true)),
      db.select({ count: count() }).from(borrows).where(isNull(borrows.returnedAt)),
      db.select({ count: count() })
        .from(borrows)
        .where(and(isNull(borrows.returnedAt), gt(sql`CURRENT_DATE`, borrows.dueDate)))
    ])

    // Get pending requests
    pendingRequests = await db
      .select({
        id: bookRequests.id,
        title: bookRequests.title,
        author: bookRequests.author,
        requestedAt: bookRequests.requestedAt,
        userName: users.name,
      })
      .from(bookRequests)
      .innerJoin(users, eq(bookRequests.userId, users.id))
      .limit(5)

  } catch (e) {
    error = e
    console.error('Database error:', e)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Librarian Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/dashboard/books/add">
            <Button>Add New Book</Button>
          </Link>
          <Link href="/dashboard/users/add">
            <Button variant="outline">Add User</Button>
          </Link>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error loading dashboard data
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>Please try refreshing the page. If the problem persists, contact support.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard title="Total Books" value={totalBooks[0].count} icon="BookOpen" />
            <DashboardCard title="Available Books" value={availableBooks[0].count} icon="CheckCircle" color="green" />
            <DashboardCard title="Borrowed Books" value={borrowedBooks[0].count} icon="Users" color="blue" />
            <DashboardCard title="Overdue Books" value={overdueBooks[0].count} icon="Clock" color="red" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Popular Books</h3>
                <Link href="/dashboard/analytics" className="text-sm text-primary hover:text-primary/80">
                  View All Analytics
                </Link>
              </div>
              <PopularBooksChart />
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Borrows</h3>
                <Link href="/dashboard/borrows" className="text-sm text-primary hover:text-primary/80">
                  View All Borrows
                </Link>
              </div>
              <RecentBorrowsTable />
            </div>
          </div>

          {pendingRequests.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex justify-between items-center p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Book Requests</h3>
                <Link href="/dashboard/requests" className="text-sm text-primary hover:text-primary/80">
                  View All Requests
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Requested By
                      </th>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-700"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {pendingRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {request.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {request.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {request.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {new Date(request.requestedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/dashboard/requests/${request.id}`}
                            className="text-primary hover:text-primary/80"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
