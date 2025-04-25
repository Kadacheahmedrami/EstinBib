import { NextResponse } from "next/server"
import { db } from "@/db"
import { borrows, users } from "@/db/schema"
import { count, eq, and, sql } from "drizzle-orm"
import { getServerAuthSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerAuthSession()

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get current timestamp for calculations
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get active borrowers (users with current borrows)
    const activeBorrowers = await db
      .select({
        count: count(),
      })
      .from(borrows)
      .where(
        and(
          sql`${borrows.returnedAt} IS NULL`,
          sql`${borrows.borrowedAt} > ${thirtyDaysAgo}`
        )
      )

    // Get top borrowers
    const topBorrowers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        borrowCount: count(borrows.id),
      })
      .from(users)
      .leftJoin(borrows, eq(users.id, borrows.userId))
      .where(sql`${borrows.borrowedAt} > ${thirtyDaysAgo}`)
      .groupBy(users.id, users.name, users.email, users.image)
      .orderBy(sql`count(${borrows.id}) desc`)
      .limit(5)

    // Get overdue borrows count
    const overdueBorrows = await db
      .select({
        count: count(),
      })
      .from(borrows)
      .where(
        and(
          sql`${borrows.returnedAt} IS NULL`,
          sql`${borrows.dueDate} < ${now}`
        )
      )

    return NextResponse.json({
      activeBorrowers: activeBorrowers[0]?.count ?? 0,
      overdueBorrows: overdueBorrows[0]?.count ?? 0,
      topBorrowers,
    })
  } catch (error) {
    console.error("[USERS_ACTIVITY_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 