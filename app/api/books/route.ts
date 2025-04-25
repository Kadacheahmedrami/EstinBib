import { NextResponse } from "next/server";
import { books } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { getServerAuthSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const available = searchParams.get("available") === "true";

    const query = db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        isbn: books.isbn,
      })
      .from(books)
      .orderBy(books.title);

    if (available) {
      query.where(eq(books.available, true));
    }

    const results = await query.execute();

    return NextResponse.json(results);
  } catch (error) {
    console.error("[BOOKS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
