import { NextRequest, NextResponse } from "next/server";
import { desc, sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { books, bookCategories, categories } from "@/db/schema";
import { db } from "@/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q");
  const sizeParam = searchParams.get("size"); // Format: "min-max"
  const categoryParam = searchParams.get("categories"); // Format: "cat1+cat2"
  const availableParam = searchParams.get("available"); // "true" or "false"

  // Start with a default condition that always evaluates to true.
  let conditions = sql`true`;
  let selectRank = sql`0`; // Default rank when not searching
  let orderByClause = desc(books.addedAt); // Default ordering by addedAt

  if (q) {
    // Build a tsquery for full-text search with prefix matching.
    // For example, "fict" becomes "fict:*", and "how works" becomes "how:* & works:*"
    const modifiedSearch = q
      .trim()
      .split(/\s+/)
      .map((term) => `${term}:*`)
      .join(" & ");
    const tsQuery = sql`to_tsquery('english', ${modifiedSearch})`;

    // Build a weighted text vector using title, author, and category name.
    const weightedVector = sql`
      (
        setweight(to_tsvector('english', ${books.title}), 'A') ||
        setweight(to_tsvector('english', ${books.author}), 'B') ||
        setweight(to_tsvector('english', ${categories.name}), 'C')
      )
    `;

    // Use the full-text search condition.
    conditions = sql`${weightedVector} @@ ${tsQuery}`;
    // Calculate rank based on the match.
    selectRank = sql`ts_rank(${weightedVector}, ${tsQuery})`;
    // Order by relevance when searching.
    orderByClause = sql`ts_rank(${weightedVector}, ${tsQuery}) DESC`;
  }

  // Add size filter if provided.
  if (sizeParam) {
    const [minStr, maxStr] = sizeParam.split("-");
    const minSize = Number(minStr);
    const maxSize = Number(maxStr);
    if (!isNaN(minSize) && !isNaN(maxSize)) {
      conditions = sql`${conditions} AND ${books.size} BETWEEN ${minSize} AND ${maxSize}`;
    }
  }

  // Add category filter if provided.
  if (categoryParam) {
    const categoryList = categoryParam.split("+").map((cat) => cat.trim());
    conditions = sql`${conditions} AND ${
      categories.name
    } = ANY(ARRAY[${sql.join(categoryList)}])`;
  }

  // Add availability filter if provided.
  if (availableParam !== null) {
    const available = availableParam.toLowerCase() === "true";
    conditions = sql`${conditions} AND ${books.available} = ${available}`;
  }

  try {
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
        rank: selectRank,
      })
      .from(books)
      .leftJoin(bookCategories, eq(books.id, bookCategories.bookId))
      .leftJoin(categories, eq(bookCategories.categoryId, categories.id))
      .where(conditions)
      .orderBy(orderByClause)
      .execute();

    return NextResponse.json({ books: results });
  } catch (error) {
    console.error("Error executing query:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
