import { NextResponse } from "next/server";
import { books, borrows } from "@/db/schema";
import { db } from "@/db";
import { count, desc, eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const mostBorrowedBooks = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        borrowCount: count(borrows.bookId).as("borrowCount"),
      })
      .from(books)
      .leftJoin(borrows, eq(books.id, borrows.bookId))
      .groupBy(books.id)
      .orderBy(desc(sql`COUNT(${borrows.bookId})`))
      .limit(5);
    return NextResponse.json({ mostBorrowedBooks }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
