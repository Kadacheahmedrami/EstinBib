import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { users, borrows } from "@/db/schema"
import { getServerSession } from "next-auth"
import { eq, sql } from "drizzle-orm"

export async function GET(req: NextRequest) {



  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") as "STUDENT" | "LIBRARIAN" | undefined

    const offset = (page - 1) * limit

    // Build base query
    const baseQuery = db
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
    if (search) {
      baseQuery.where(sql`${users.name} ILIKE ${`%${search}%`} OR ${users.email} ILIKE ${`%${search}%`}`)
    }

    if (role) {
      baseQuery.where(eq(users.role, role))
    }

    // Get total count
    // const [{ count }] = await db
    //   .select({ count: sql<number>`count(*)` })
    //   .from(users)
    //   .execute()

    // Get paginated results
    const results = await baseQuery
      .limit(limit)
      .offset(offset)
      .orderBy(users.name)
      .execute()

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession()


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
    if (userId === session!.user.id) {
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