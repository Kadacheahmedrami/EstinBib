import { NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getServerAuthSession } from "@/lib/auth"

type Context = {
  params: Promise<{
    userId: string | string[] | undefined
  }>
}

/**
 * GET - Retrieve user(s) information
 */
export async function GET(
  request: Request,
  context: Context
) {
  try {
    const session = await getServerAuthSession()
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    
    const params = await context.params
    const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId
    
    // If userId is provided, return specific user
    if (userId) {
      // Regular users can only get their own data
      if (session.user.role !== "LIBRARIAN" && userId !== session.user.id) {
        return new NextResponse("Forbidden", { status: 403 })
      }
      
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
      
      if (!user.length) {
        return new NextResponse("User not found", { status: 404 })
      }
      
      return NextResponse.json(user[0])
    }
    
    // If no userId, return list of users (only for librarians)
    if (session.user.role !== "LIBRARIAN") {
      return new NextResponse("Forbidden", { status: 403 })
    }
    
    // Optional query parameters for pagination
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get("limit") || "10")
    const offset = parseInt(url.searchParams.get("offset") || "0")
    
    // Get all users with pagination
    const allUsers = await db
      .select()
      .from(users)
      .limit(limit)
      .offset(offset)
    
    return NextResponse.json(allUsers)
  } catch (error) {
    console.error("[USER_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

/**
 * DELETE - Remove a user
 */
export async function DELETE(
  request: Request,
  context: Context
) {
  try {
    const session = await getServerAuthSession()
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    
    // Check if user is authorized to delete users (e.g., admin or librarian)
    if (session.user.role !== "LIBRARIAN" ) {
      return new NextResponse("Forbidden", { status: 403 })
    }
    
    const params = await context.params
    const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId
    
    if (!userId) {
      return new NextResponse("Invalid user ID", { status: 400 })
    }
    
    // Prevent self-deletion
    if (userId === session.user.id) {
      return new NextResponse("Cannot delete your own account", { status: 400 })
    }
    
    // Delete user
    const [deleted] = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning()
    
    if (!deleted) {
      return new NextResponse("User not found", { status: 404 })
    }
    
    return NextResponse.json(deleted)
  } catch (error) {
    console.error("[USER_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}