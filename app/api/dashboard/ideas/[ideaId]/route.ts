import { NextResponse } from "next/server"
import { db } from "@/db"
import { ideas } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getServerAuthSession } from "@/lib/auth"

type Context = {
  params: Promise<{
    ideaId: string | string[] | undefined
  }>
}

export async function DELETE(
  request: Request,
  context: Context
) {
  try {
    const session = await getServerAuthSession()
    const params = await context.params
    const ideaId = Array.isArray(params.ideaId) ? params.ideaId[0] : params.ideaId

    if (!ideaId) {
      return new NextResponse("Invalid idea ID", { status: 400 })
    }

    if (!session?.user || session.user.role !== "LIBRARIAN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Delete idea
    const [deleted] = await db
      .delete(ideas)
      .where(eq(ideas.id, ideaId))
      .returning()

    if (!deleted) {
      return new NextResponse("Idea not found", { status: 404 })
    }

    return NextResponse.json(deleted)
  } catch (error) {
    console.error("[IDEA_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 