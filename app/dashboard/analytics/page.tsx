

import { db } from "@/db"
import { books, borrows, users } from "@/db/schema"
import { count, isNull, sql } from "drizzle-orm"
import BorrowsChart from "@/components/dashboard/analytics/BorrowsChart"
import CategoriesDistribution from "@/components/dashboard/analytics/CategoriesDistribution"
import TopBooksTable from "@/components/dashboard/analytics/TopBooksTable"
import UserActivityChart from "@/components/dashboard/analytics/UserActivityChart"

export default async function AnalyticsPage() {


  // Redirect if not librarian
  // if (session?.user?.role !== "LIBRARIAN") {
  //   redirect("/dashboard")
  // }

  // Get total counts
  const totalUsers = await db.select({ count: count() }).from(users)
  const totalBooks = await db.select({ count: count() }).from(books)
  const totalBorrows = await db.select({ count: count() }).from(borrows)
  const activeBorrows = await db.select({ count: count() }).from(borrows).where(isNull(borrows.returnedAt))

  // Get monthly borrows (last 6 months)
  const monthlyBorrows = await db
    .select({
      month: sql`TO_CHAR(${borrows.borrowedAt}, 'Month')`,
      count: count(),
    })
    .from(borrows)
    .where(sql`${borrows.borrowedAt} > NOW() - INTERVAL '6 months'`)
    .groupBy(sql`TO_CHAR(${borrows.borrowedAt}, 'Month')`)
    .orderBy(sql`MIN(${borrows.borrowedAt})`)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Library Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">Total Users</p>
          <p className="text-3xl font-bold">{totalUsers[0].count}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">Total Books</p>
          <p className="text-3xl font-bold">{totalBooks[0].count}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">Total Borrows</p>
          <p className="text-3xl font-bold">{totalBorrows[0].count}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">Active Borrows</p>
          <p className="text-3xl font-bold">{activeBorrows[0].count}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Monthly Borrows</h2>
          <BorrowsChart data={monthlyBorrows.map(item => ({
            month: String(item.month),
            count: item.count
          }))} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Categories Distribution</h2>
          <CategoriesDistribution />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Most Borrowed Books</h2>
          <TopBooksTable />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">User Activity</h2>
          <UserActivityChart />
        </div>
      </div>
    </div>
  )
}
