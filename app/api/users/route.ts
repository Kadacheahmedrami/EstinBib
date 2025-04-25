import { NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { getServerAuthSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerAuthSession()

    if (!session?.user || session.user.role !== "LIBRARIAN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const results = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .orderBy(users.name)

    return NextResponse.json(results)
  } catch (error) {
    console.error("[USERS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 