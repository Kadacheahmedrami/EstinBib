import { NextRequest, NextResponse } from "next/server";
import { books } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookid: string }> }
) {
  try {
    const bookid = (await params).bookid;
    const book = await db
      .select()
      .from(books)
      .where(eq(books.id, bookid))
      .execute();

    return NextResponse.json({ book }, { status: 200 });
  } catch (error) {
    console.error(error); // Changed console.log to console.error
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}
