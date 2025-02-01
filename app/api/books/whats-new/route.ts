// app/api/books/whats-new/route.ts

import { NextResponse } from "next/server";
import { books } from "@/db/schema";
import { db } from "@/db";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const res = await db
      .select()
      .from(books)
      .orderBy(desc(books.addedAt))
      .limit(5)
      .execute();
    return NextResponse.json(
      {
        books: res,
        total: res.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch newest books" },
      { status: 500 }
    );
  }
}
