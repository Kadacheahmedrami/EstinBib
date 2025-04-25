import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { ideas } from "@/db/schema"
import { getServerSession } from "next-auth"
import { eq } from "drizzle-orm"

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { ideaId: string } }
) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const [deletedIdea] = await db
      .delete(ideas)
      .where(eq(ideas.id, params.ideaId))
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