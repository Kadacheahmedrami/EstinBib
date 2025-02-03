import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { books, bookCategories, categories } from "@/db/schema";
import { db } from "@/db";

export async function GET(request: NextRequest) {
  // Get search query parameters from searchParams
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q");
  const sizeParam = searchParams.get("size"); // e.g., "100-200"
  const categoryParam = searchParams.get("categories"); // e.g., "business+commerce"
  const availableParam = searchParams.get("available"); // e.g., "true" or "false"

  if (!q) {
    return NextResponse.json(
      { error: "Missing query parameter 'q'" },
      { status: 400 }
    );
  }

  try {
    // Transform the search query into a tsquery with prefix matching.
    // e.g. "fict" becomes "fict:*", and "how works" becomes "how:* & works:*"
    const modifiedSearch = q
      .trim()
      .split(/\s+/)
      .map((term) => `${term}:*`)
      .join(" & ");

    // Build the tsquery using to_tsquery (with prefix matching)
    const tsQuery = sql`to_tsquery('english', ${modifiedSearch})`;

    // Build a weighted tsvector expression for title, author, and category name.
    const weightedVector = sql`
      (
        setweight(to_tsvector('english', ${books.title}), 'A') ||
        setweight(to_tsvector('english', ${books.author}), 'B') ||
        setweight(to_tsvector('english', ${categories.name}), 'C')
      )
    `;

    // Start building the query with all conditions
    let conditions = sql`${weightedVector} @@ ${tsQuery}`;

    // Add size condition if provided
    if (sizeParam) {
      const [minStr, maxStr] = sizeParam.split("-");
      const minSize = Number(minStr);
      const maxSize = Number(maxStr);
      if (!isNaN(minSize) && !isNaN(maxSize)) {
        conditions = sql`${conditions} AND ${books.size} BETWEEN ${minSize} AND ${maxSize}`;
      }
    }

    // Add categories condition if provided
    if (categoryParam) {
      const categoryList = categoryParam.split("+").map((cat) => cat.trim());
      conditions = sql`${conditions} AND ${
        categories.name
      } = ANY(ARRAY[${sql.join(categoryList)}])`;
    }

    // Add available condition if provided
    if (availableParam !== null) {
      const available = availableParam.toLowerCase() === "true";
      conditions = sql`${conditions} AND ${books.available} = ${available}`;
    }

    // Execute the final query with all conditions
    const results = await db
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
        rank: sql`ts_rank(${weightedVector}, ${tsQuery})`,
      })
      .from(books)
      .leftJoin(bookCategories, eq(books.id, bookCategories.bookId))
      .leftJoin(categories, eq(bookCategories.categoryId, categories.id))
      .where(conditions)
      .orderBy(sql`ts_rank(${weightedVector}, ${tsQuery}) DESC`)
      .execute();

    return NextResponse.json({ books: results });
  } catch (error) {
    console.error("Error executing full-text search:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
