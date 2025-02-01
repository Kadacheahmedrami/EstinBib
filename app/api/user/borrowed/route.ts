import { NextResponse } from "next/server";
import { books, borrows } from "@/db/schema";
import { db } from "@/db";
import { eq, and, isNull } from "drizzle-orm";
import { getServerAuthSession } from "@/lib/auth";

export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const borrowedBooks = await db
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
    })
    .from(borrows)
    .leftJoin(books, eq(books.id, borrows.bookId))
    .where(and(eq(borrows.userId, session.user.id), isNull(borrows.returnedAt)))
    .execute();
  return NextResponse.json(borrowedBooks);
}
