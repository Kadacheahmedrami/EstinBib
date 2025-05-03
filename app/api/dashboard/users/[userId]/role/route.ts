// File: app/api/dashboard/users/[userId]/role/route.ts
import { NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

type Context = {
  params: Promise<{
    userId: string | string[] | undefined
  }>
}

export async function PUT(
  request: Request,
  context: Context
) {
  try {

    const params = await context.params
    const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 })
    }

    // Optional: Uncomment if only librarians should update roles
    // if (!session?.user || session.user.role !== "LIBRARIAN") {
    //   return new NextResponse("Unauthorized", { status: 401 })
    // }

    // Parse the request body
    const body = await request.json()
    

    
    const { role } = body
    
    // Update the user's role in the database
    const [updatedUser] = await db
      .update(users)
      .set({ 
        role,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning({ id: users.id, role: users.role })
    
    if (!updatedUser) {
      return new NextResponse("User not found", { status: 404 })
    }
    
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[USER_ROLE_UPDATE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}