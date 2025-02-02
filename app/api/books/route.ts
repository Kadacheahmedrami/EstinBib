import { NextResponse } from "next/server";
import { books } from "@/db/schema";
import { db } from "@/db";

export async function GET() {
  try {
    const res = await db
      .select()
      .from(books)
      .execute(); // No order or limit applied
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
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
