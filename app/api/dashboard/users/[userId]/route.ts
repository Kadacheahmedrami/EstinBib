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