import { NextResponse } from "next/server";
import { books, borrows } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { getServerAuthSession } from "@/lib/auth";
export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Get the books borrowed by the user
  const [borrowedBooks] = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      isbn: books.isbn,
      description: books.description,
      language: books.language,
      coverImage: books.coverImage,
      publishedAt: books.publishedAt,
      addedAt: books.addedAt,
      size: books.size,
      available: books.available,
    })
    .from(books)
    .leftJoin(borrows, eq(books.id, borrows.bookId))
    .where(eq(borrows.userId, session.user.id))
    .execute();

  return NextResponse.json({ borrowedBooks }, { status: 200 });
}
