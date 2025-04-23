// app/api/chat/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"
import { books } from "@/db/schema"
import { db } from "@/db"
import { BaseBook } from "@/types/_types"

// Simple vector operations for semantic search
class VectorOperations {
  // Convert text to embedding using Gemini
  static async getEmbedding(text: string, genAI: GoogleGenerativeAI): Promise<number[]> {
    try {
      const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" })
      const result = await embeddingModel.embedContent(text)
      const embedding = result.embedding.values
      return embedding
    } catch (error) {
      console.error("Error generating embedding:", error)
      // Return empty array if embedding fails
      return []
    }
  }

  // Calculate cosine similarity between two vectors
  static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i]
      normA += vecA[i] * vecA[i]
      normB += vecB[i] * vecB[i]
    }

    if (normA === 0 || normB === 0) return 0
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }
}

// Book with embedding for vector search
interface BookWithEmbedding {
  book: BaseBook
  embedding: number[]
}

// In-memory storage for book embeddings
const bookEmbeddingsCache: BookWithEmbedding[] = []

// Define the request payload type
interface ChatRequest {
  message: string
  conversation: string[] // Keep track of the conversation history
}

// POST handler for generating AI chat content
export async function POST(req: NextRequest) {
  try {
    const { message, conversation = [] }: ChatRequest = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Initialize the Google Generative AI with the API key
    const genAI = new GoogleGenerativeAI("AIzaSyAs44KUuNewiuVQynu3ywdByeJCepX0TzE")
    const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Add the current message to the conversation history
    const updatedConversation = [...conversation, `User: ${message}`]

    // Retrieve all books from the database
    const allBooks = await db.select().from(books).execute()

    if (!allBooks.length) {
      const noBookResponse = "I don't have any books in my database to discuss yet."
      updatedConversation.push(`AI: ${noBookResponse}`)

      return NextResponse.json(
        {
          text: noBookResponse,
          conversation: updatedConversation,
        },
        { status: 200 },
      )
    }

    // Get embedding for the user's query
    const queryEmbedding = await VectorOperations.getEmbedding(message, genAI)

    // Find or create embeddings for books
    if (bookEmbeddingsCache.length === 0) {
      console.log("Generating embeddings for books...")
      for (const book of allBooks) {
        // Create a rich text representation of the book for embedding
        const bookText = `Title: ${book.title}. Author: ${book.author}. Description: ${book.description || ""}. Language: ${book.language || ""}`
        const embedding = await VectorOperations.getEmbedding(bookText, genAI)
        bookEmbeddingsCache.push({ book, embedding })
      }
      console.log(`Generated embeddings for ${bookEmbeddingsCache.length} books`)
    }

    // Find similar books using vector similarity
    const similarityScores = bookEmbeddingsCache.map((item) => ({
      book: item.book,
      similarity: VectorOperations.cosineSimilarity(queryEmbedding, item.embedding),
    }))

    // Sort by similarity score (descending)
    similarityScores.sort((a, b) => b.similarity - a.similarity)

    // Take top 2 most relevant books (changed from 5 to 2)
    const topBooks = similarityScores.slice(0, 2)

    // Create context from most relevant books
    const booksContext = topBooks
      .map((item) => {
        const book = item.book
        return `Title: ${book.title}, Author: ${book.author}, Description: ${book.description || "No description available"}, Language: ${book.language || "Unknown"}, Published: ${book.publishedAt instanceof Date ? book.publishedAt.toDateString() : "Unknown date"}, Relevance: ${(item.similarity * 100).toFixed(1)}%`
      })
      .join("\n\n")

    // Create the system prompt for the RAG chatbot
    const systemPrompt = `
    You are a knowledgeable book assistant with expertise in literature. Your role is to help users find books and provide information about books in the library's database. Follow these guidelines:

    1. **Book Focus Only:** Only discuss books that exist in the database. If asked about a book not in the database, politely explain you can only discuss books available in the library's collection.
    2. **No Fictional Responses:** Do not make up information about books. Rely solely on the data provided.
    3. **Helpful Recommendations:** When appropriate, recommend books from the database based on user preferences.
    4. **Engage Naturally:** Maintain a conversational, friendly tone while providing accurate information.
    5. **Suggest Books Inline:** When recommending books, mention that the user can click on the book cards below your message to view more details.
    6. **Limited Suggestions:** You will only suggest the top 2 most relevant books for each query.

    MOST RELEVANT BOOKS FOR THIS QUERY:
    ${booksContext}
    
    TOTAL BOOKS IN DATABASE: ${allBooks.length}
    
    Remember to focus your responses primarily on the most relevant books listed above, but you can mention other books from the database if they're more appropriate for the user's question.
    `

    // Generate the content using the provided message and conversation context
    const result = await chatModel.generateContent(`${systemPrompt}\n${updatedConversation.join("\n")}`)

    const aiResponse = result.response.text()

    // Add AI's response to the conversation history
    updatedConversation.push(`AI: ${aiResponse}`)

    // Return the AI response, updated conversation, and complete book details
    return NextResponse.json({
      text: aiResponse,
      conversation: updatedConversation,
      relevantBooks: topBooks.map((item) => ({
        id: item.book.id,
        title: item.book.title,
        author: item.book.author,
        description: item.book.description || "No description available",
        coverImage: item.book.coverImage,
        isbn: item.book.isbn,
        size: item.book.size,
        available: item.book.available,
        publishedAt: item.book.publishedAt,
        language: item.book.language,
        relevance: item.similarity,
      })),
    })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json({ error: "Failed to process chat request", details: String(error) }, { status: 500 })
  }
}
