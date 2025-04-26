import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { ideas } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getServerSession } from "next-auth"

type Context = {
  params: Promise<{
    ideaId: string | string[] | undefined
  }>
}

export async function DELETE(
  request: NextRequest,
  context: Context
) {
  const session = await getServerSession()
  const params = await context.params
  const ideaId = Array.isArray(params.ideaId) ? params.ideaId[0] : params.ideaId

  if (!ideaId) {
    return NextResponse.json({ error: "Invalid idea ID" }, { status: 400 })
  }

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const [deletedIdea] = await db
      .delete(ideas)
      .where(eq(ideas.id, ideaId))
      .returning()

    if (!deletedIdea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(deletedIdea)
  } catch (error) {
    console.error("Error deleting idea:", error)
    return NextResponse.json(
      { error: "Failed to delete idea" },
      { status: 500 }
    )
  }
}