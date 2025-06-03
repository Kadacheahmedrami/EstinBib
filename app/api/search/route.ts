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
  type?: string;
  language?: string;
  periodicalFrequency?: string;
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
      type: searchParams.get("type") || undefined,
      language: searchParams.get("language") || undefined,
      periodicalFrequency: searchParams.get("periodicalFrequency") || undefined,
      sortBy: searchParams.get("sortBy") || "relevance",
      sortOrder: searchParams.get("sortOrder") || "desc"
    };

    // Build conditions array
    const conditions: DrizzleCondition[] = [];

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

    // Size filter - handle both "250-500" and "250 - 500 pages" formats
    if (params.size) {
      const cleanSize = params.size.replace(/\s*pages?\s*/i, '').replace(/\s*-\s*/, '-');
      const sizeRange = cleanSize.split("-").map(s => parseInt(s.trim()));
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

    // Book type filter
    if (params.type) {
      const types = params.type.split(",").map(t => t.trim() as "BOOK" | "DOCUMENT" | "PERIODIC" | "ARTICLE");
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

    // Periodical frequency filter
    if (params.periodicalFrequency) {
      const frequencies = params.periodicalFrequency.split(",").map(pf => pf.trim());
      conditions.push(inArray(books.periodicalFrequency, frequencies));
    }

    // Combine all conditions
    const finalCondition = conditions.length > 0 ? and(...conditions) : undefined;

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

    // Build main query with relevance score for sorting
    let baseQuery;
    
    if (params.sortBy === "relevance" && params.q) {
      // For relevance sorting with search query, include relevance score in SELECT
      const relevanceScore = sql`CASE 
        WHEN LOWER(${books.title}) LIKE LOWER(${`%${params.q}%`}) THEN 1
        WHEN LOWER(${books.author}) LIKE LOWER(${`%${params.q}%`}) THEN 2
        WHEN LOWER(${books.description}) LIKE LOWER(${`%${params.q}%`}) THEN 3
        ELSE 4
      END`.as('relevance_score');

      baseQuery = db
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
          relevance_score: relevanceScore,
        })
        .from(books)
        .leftJoin(bookCategories, eq(books.id, bookCategories.bookId))
        .leftJoin(categories, eq(bookCategories.categoryId, categories.id))
        .limit(limit)
        .offset(offset);
    } else {
      // For other sorting options, use regular query
      baseQuery = db
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
    }

    // Determine sort order
    let orderByClause;
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
        if (params.q) {
          // Use the relevance_score column we included in SELECT
          orderByClause = sql`relevance_score ASC, ${books.addedAt} DESC`;
        } else {
          orderByClause = desc(books.addedAt);
        }
        break;
    }

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

    // Attach categories to books and remove relevance_score from results
    const booksWithCategories: BookResult[] = results.map(book => {
      const { relevance_score, ...bookData } = book as any;
      return {
        ...bookData,
        categories: categoriesByBook[book.id] || []
      };
    });

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