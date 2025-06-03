import { NextRequest, NextResponse } from "next/server";
import { desc, asc, sql, and, or, inArray, between, eq, count, ilike } from "drizzle-orm";
import { books, bookCategories, categories } from "@/db/schema";
import { db } from "@/db";

// Types for better type safety
interface SearchParams {
  q?: string;
  size?: string;
  categories?: string;
  available?: string;
  type?: string; // Changed from documentType to match schema
  language?: string;
  periodicalFrequency?: string; // Changed from periodicType to match schema
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface BookResult {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  barcode: string | null;
  description: string | null;
  language: string;
  coverImage: string | null;
  pdfUrl: string | null;
  publishedAt: Date | null;
  addedAt: Date;
  size: number;
  available: boolean;
  type: "BOOK" | "DOCUMENT" | "PERIODIC" | "ARTICLE";
  periodicalFrequency: string | null;
  periodicalIssue: string | null;
  articleJournal: string | null;
  documentType: string | null;
  categories: string[];
}

interface SearchResponse {
  books: BookResult[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    appliedFilters: Record<string, string>;
    resultsCount: number;
  };
}

type DrizzleCondition = ReturnType<typeof and> | ReturnType<typeof or> | ReturnType<typeof eq> | ReturnType<typeof ilike> | ReturnType<typeof between> | ReturnType<typeof inArray>;

export async function GET(request: NextRequest): Promise<NextResponse<SearchResponse | { error: string }>> {
  try {
    const { searchParams } = request.nextUrl;
    
    // Extract and validate pagination parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const offset = (page - 1) * limit;
    
    // Extract search parameters
    const params: SearchParams = {
      q: searchParams.get("q")?.trim() || undefined,
      size: searchParams.get("size") || undefined,
      categories: searchParams.get("categories") || undefined,
      available: searchParams.get("available") || undefined,
      type: searchParams.get("type") || undefined, // Fixed field name
      language: searchParams.get("language") || undefined,
      periodicalFrequency: searchParams.get("periodicalFrequency") || undefined, // Fixed field name
      sortBy: searchParams.get("sortBy") || "relevance",
      sortOrder: searchParams.get("sortOrder") || "desc"
    };

    // Build conditions array
    const conditions: DrizzleCondition[] = [];
    let orderByClause;

    // Text search using ILIKE for PostgreSQL compatibility
    if (params.q) {
      const searchTerm = `%${params.q.toLowerCase()}%`;
      conditions.push(
        or(
          ilike(books.title, searchTerm),
          ilike(books.author, searchTerm),
          ilike(books.description, searchTerm)
        )
      );
    }

    // Size filter
    if (params.size) {
      const sizeRange = params.size.split("-").map(s => parseInt(s.trim()));
      if (sizeRange.length === 2 && !sizeRange.some(isNaN)) {
        const [minSize, maxSize] = sizeRange;
        conditions.push(between(books.size, minSize, maxSize));
      }
    }

    // Category filter
    if (params.categories) {
      const categoryList = params.categories
        .split("+")
        .map(cat => decodeURIComponent(cat.trim()))
        .filter(cat => cat.length > 0);
      
      if (categoryList.length > 0) {
        conditions.push(inArray(categories.name, categoryList));
      }
    }

    // Availability filter
    if (params.available !== undefined && params.available !== "") {
      const available = params.available.toLowerCase() === "true";
      conditions.push(eq(books.available, available));
    }

    // Book type filter (fixed to match schema)
    if (params.type) {
      const types = params.type.split(",").map(t => t.trim() as "BOOK" | "DOCUMENT" | "PERIODIC" | "ARTICLE");
      // Validate that all types are valid enum values
      const validTypes = types.filter(type => ["BOOK", "DOCUMENT", "PERIODIC", "ARTICLE"].includes(type));
      if (validTypes.length > 0) {
        conditions.push(inArray(books.type, validTypes));
      }
    }

    // Language filter
    if (params.language) {
      const languages = params.language.split(",").map(lang => lang.trim());
      conditions.push(inArray(books.language, languages));
    }

    // Periodical frequency filter (fixed to match schema)
    if (params.periodicalFrequency) {
      const frequencies = params.periodicalFrequency.split(",").map(pf => pf.trim());
      conditions.push(inArray(books.periodicalFrequency, frequencies));
    }

    // Combine all conditions
    const finalCondition = conditions.length > 0 ? and(...conditions) : undefined;

    // Determine sort order
    switch (params.sortBy) {
      case "title":
        orderByClause = params.sortOrder === "asc" ? asc(books.title) : desc(books.title);
        break;
      case "author":
        orderByClause = params.sortOrder === "asc" ? asc(books.author) : desc(books.author);
        break;
      case "date":
        orderByClause = params.sortOrder === "asc" ? asc(books.publishedAt) : desc(books.publishedAt);
        break;
      case "added":
        orderByClause = params.sortOrder === "asc" ? asc(books.addedAt) : desc(books.addedAt);
        break;
      case "size":
        orderByClause = params.sortOrder === "asc" ? asc(books.size) : desc(books.size);
        break;
      case "relevance":
      default:
        // For relevance, prioritize exact matches in title, then author, then recent additions
        if (params.q) {
          orderByClause = sql`CASE 
            WHEN LOWER(${books.title}) LIKE LOWER(${`%${params.q}%`}) THEN 1
            WHEN LOWER(${books.author}) LIKE LOWER(${`%${params.q}%`}) THEN 2
            WHEN LOWER(${books.description}) LIKE LOWER(${`%${params.q}%`}) THEN 3
            ELSE 4
          END ASC, ${books.addedAt} DESC`;
        } else {
          orderByClause = desc(books.addedAt);
        }
        break;
    }

    // Build base query for counting
    const baseCountQuery = db
      .select({ count: count() })
      .from(books)
      .leftJoin(bookCategories, eq(books.id, bookCategories.bookId))
      .leftJoin(categories, eq(bookCategories.categoryId, categories.id));

    // Get total count
    const totalCountResult = finalCondition 
      ? await baseCountQuery.where(finalCondition)
      : await baseCountQuery;
    
    const totalItems = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    // Build main query with proper distinct handling
    const baseQuery = db
      .selectDistinct({
        id: books.id,
        title: books.title,
        author: books.author,
        isbn: books.isbn,
        barcode: books.barcode,
        description: books.description,
        language: books.language,
        coverImage: books.coverImage,
        pdfUrl: books.pdfUrl,
        publishedAt: books.publishedAt,
        addedAt: books.addedAt,
        size: books.size,
        available: books.available,
        type: books.type,
        periodicalFrequency: books.periodicalFrequency,
        periodicalIssue: books.periodicalIssue,
        articleJournal: books.articleJournal,
        documentType: books.documentType,
      })
      .from(books)
      .leftJoin(bookCategories, eq(books.id, bookCategories.bookId))
      .leftJoin(categories, eq(bookCategories.categoryId, categories.id))
      .limit(limit)
      .offset(offset);

    // Execute main query
    const results = finalCondition 
      ? await baseQuery.where(finalCondition).orderBy(orderByClause)
      : await baseQuery.orderBy(orderByClause);

    // Get categories for each book separately to avoid duplication issues
    const bookIds = results.map(book => book.id);
    const bookCategoriesData = bookIds.length > 0 ? await db
      .select({
        bookId: bookCategories.bookId,
        categoryName: categories.name,
      })
      .from(bookCategories)
      .leftJoin(categories, eq(bookCategories.categoryId, categories.id))
      .where(inArray(bookCategories.bookId, bookIds)) : [];

    // Group categories by book ID
    const categoriesByBook = bookCategoriesData.reduce((acc, row) => {
      if (!acc[row.bookId]) {
        acc[row.bookId] = [];
      }
      if (row.categoryName) {
        acc[row.bookId].push(row.categoryName);
      }
      return acc;
    }, {} as Record<string, string[]>);

    // Attach categories to books
    const booksWithCategories: BookResult[] = results.map(book => ({
      ...book,
      categories: categoriesByBook[book.id] || []
    }));

    // Build response
    const response: SearchResponse = {
      books: booksWithCategories,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filters: {
        appliedFilters: Object.fromEntries(
          Object.entries(params).filter(([, value]) => value !== undefined)
        ) as Record<string, string>,
        resultsCount: booksWithCategories.length,
      },
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error executing search query:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}