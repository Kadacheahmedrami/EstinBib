import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { users, borrows } from "@/db/schema"
import { getServerSession } from "next-auth"
import { eq, sql, and, or, ilike } from "drizzle-orm"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") as "STUDENT" | "LIBRARIAN" | undefined

    const offset = (page - 1) * limit

    // Build search condition
    let searchCondition = undefined
    if (search) {
      searchCondition = or(
        ilike(users.name, `%${search}%`),
        ilike(users.email, `%${search}%`)
      )
    }

    // Build role condition
    let roleCondition = undefined
    if (role) {
      roleCondition = eq(users.role, role)
    }

    // Combine conditions
    let whereCondition = undefined
    if (searchCondition && roleCondition) {
      whereCondition = and(searchCondition, roleCondition)
    } else if (searchCondition) {
      whereCondition = searchCondition
    } else if (roleCondition) {
      whereCondition = roleCondition
    }

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereCondition || sql`1=1`)
      .execute()

    // Get user data with borrow statistics
    const usersQuery = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        image: users.image,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        borrowCount: sql<number>`count(distinct ${borrows.id})`.as("borrow_count"),
        activeLoans: sql<number>`count(distinct case when ${borrows.returnedAt} is null then ${borrows.id} end)`.as("active_loans"),
        overdueLoans: sql<number>`count(distinct case when ${borrows.returnedAt} is null and ${borrows.dueDate} < now() then ${borrows.id} end)`.as("overdue_loans"),
      })
      .from(users)
      .leftJoin(borrows, eq(borrows.userId, users.id))
      .groupBy(users.id)

    // Apply filters
    if (whereCondition) {
      usersQuery.where(whereCondition)
    }

    // Get paginated results
    const results = await usersQuery
      .limit(limit)
      .offset(offset)
      .orderBy(users.name)
      .execute()

    return NextResponse.json({
      users: results,
      pagination: {
        total: Number(count),
        page,
        limit,
        pages: Math.ceil(Number(count) / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession()

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { userId, role } = await req.json()

    if (!userId || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate role
    if (!["STUDENT", "LIBRARIAN"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Don't allow changing own role
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 400 }
      )
    }

    const [updatedUser] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning()

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}