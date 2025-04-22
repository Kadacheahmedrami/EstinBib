// app/api/chat/route.ts

import { NextResponse } from "next/server";
import { books } from "@/db/schema";
import { db } from "@/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get API key from environment variables
    const apiKey = process.env.GeminiApiKey;
    
    if (!apiKey) {
      console.error("Gemini API key not found in environment variables");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    // Initialize Gemini API with the key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Retrieve all books from the database to use as context
    const allBooks = await db.select().from(books).execute();
    
    if (!allBooks.length) {
      return NextResponse.json(
        { response: "I don't have any books in my database to discuss yet." },
        { status: 200 }
      );
    }

    // Create context from available books using the correct schema properties
    const booksContext = allBooks.map(book => {
      return `Title: ${book.title}, Author: ${book.author}, Description: ${book.description}, Language: ${book.language}, Published: ${book.publishedAt instanceof Date ? book.publishedAt.toDateString() : book.publishedAt}`;
    }).join("\n");

    // Prepare prompt with RAG context
    const prompt = `
You are a helpful book recommendation assistant. You only discuss and recommend books from the following list.
If asked about books not in this list, politely explain you can only discuss books in the library's database.
Do not make up or reference books that aren't listed below.

AVAILABLE BOOKS IN DATABASE:
${booksContext}

USER QUERY: ${message}
`;

    // Generate response with Gemini
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json(
      { response },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request", details: String(error) },
      { status: 500 }
    );
  }
}