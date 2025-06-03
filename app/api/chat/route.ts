// app/api/chat/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"
import { books } from "@/db/schema"
import { db } from "@/db"
import { BaseBook } from "@/types/_types"
import {  isInappropriateQuery } from "@/lib/semantic"
import { checkSpecialTriggers } from "@/lib/triggers"

/**
 * Enhanced Vector Operations Class
 * - Improved embedding logic
 * - Better similarity calculation
 * - Added caching mechanism
 */
class VectorOperations {
  private static embeddingCache = new Map<string, number[]>()
  
  // Convert text to embedding using Gemini with caching
  static async getEmbedding(text: string, genAI: GoogleGenerativeAI): Promise<number[]> {
    const cacheKey = text.slice(0, 100) // Use first 100 chars as cache key
    
    // Check cache first
    if (this.embeddingCache.has(cacheKey)) {
      return this.embeddingCache.get(cacheKey)!
    }
    
    try {
      const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" })
      const result = await embeddingModel.embedContent(text)
      const embedding = result.embedding.values
      
      // Cache the result
      this.embeddingCache.set(cacheKey, embedding)
      return embedding
    } catch (error) {
      console.error("Error generating embedding:", error)
      return []
    }
  }

  // Calculate cosine similarity between two vectors
  static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA.length || !vecB.length || vecA.length !== vecB.length) return 0

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i]
      normA += vecA[i] * vecA[i]
      normB += vecB[i] * vecB[i]
    }

    const normProduct = Math.sqrt(normA) * Math.sqrt(normB)
    if (normProduct === 0) return 0
    
    // Ensure result is between -1 and 1
    return Math.max(-1, Math.min(1, dotProduct / normProduct))
  }
  
  // Get better text representation for embedding
  static getBookEmbeddingText(book: BaseBook): string {
    return [
      `Title: ${book.title}`,
      `Author: ${book.author}`,
      `Description: ${book.description || ""}`,
      `Language: ${book.language || ""}`,
      `ISBN: ${book.isbn || ""}`,
      `Published: ${book.publishedAt instanceof Date ? book.publishedAt.getFullYear() : ""}`
    ].filter(Boolean).join(". ")
  }
}

// Book with embedding for vector search
interface BookWithEmbedding {
  book: BaseBook
  embedding: number[]
}

// Enhanced conversation message with potential book references
interface ConversationMessage {
  role: 'user' | 'ai'
  content: string
  // Track which books were referenced in this message
  referencedBooks?: {
    id: string
    title: string
  }[]
}

// Define the enhanced request payload type
interface ChatRequest {
  message: string
  conversation: ConversationMessage[]
  discussedBookIds?: string[] // Track specific book IDs being discussed
}

// In-memory storage for book embeddings
const bookEmbeddingsCache: BookWithEmbedding[] = []
// Minimum similarity threshold for relevant books
const SIMILARITY_THRESHOLD = 0.6

// Topic relevance threshold (higher = stricter)
const TOPIC_RELEVANCE_THRESHOLD = 0.7

// Maximum number of books to suggest
const MAX_SUGGESTIONS = 3

// POST handler for generating AI chat content
export async function POST(req: NextRequest) {
  try {
    const { message, conversation = [], discussedBookIds = [] }: ChatRequest = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }
    
    // Check for special "123" triggers first with improved fuzzy matching
    const specialResponse = checkSpecialTriggers(message);
    
    if (specialResponse) {
      const updatedConversation = [
        ...conversation,
        { role: 'user', content: message },
        { role: 'ai', content: specialResponse }
      ];
      
      return NextResponse.json({
        text: specialResponse,
        conversation: updatedConversation,
        discussedBookIds: discussedBookIds,
        relevantBooks: [] // No books to suggest for special queries
      }, { status: 200 });
    }
    
    // Continue with regular processing if not a special trigger
    
    // Check for inappropriate content early
    if (isInappropriateQuery(message)) {
      const inappropriateResponse = "I'm focused on helping you find books in our library collection. I don't have materials on that topic. Would you like recommendations for fiction, non-fiction or another category?"
      
      return NextResponse.json({
        text: inappropriateResponse,
        conversation: [...conversation, 
          { role: 'user', content: message },
          { role: 'ai', content: inappropriateResponse }
        ],
        discussedBookIds: discussedBookIds,
        relevantBooks: [] // No books to suggest for inappropriate queries
      }, { status: 200 })
    }
    console.log(process.env.GeminiApiKey )
    // Initialize the Google Generative AI with the API key
    const genAI = new GoogleGenerativeAI(process.env.GeminiApiKey || "No api key")
    const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Add the current message to the conversation history
    const updatedConversation = [
      ...conversation,
      { role: 'user', content: message }
    ]

    // Track books being discussed
    const currentDiscussedBookIds = [...discussedBookIds]

    // Retrieve all books from the database
    const allBooks = await db.select().from(books).execute()

    // Handle empty database early to avoid contradictions
    if (!allBooks.length) {
      const noBookResponse = "I don't have any books in my database to discuss yet. Once books are added, I'll be able to recommend them based on your interests."
      
      return NextResponse.json(
        {
          text: noBookResponse,
          conversation: [...updatedConversation, { role: 'ai', content: noBookResponse }],
          discussedBookIds: [],
          relevantBooks: []
        },
        { status: 200 },
      )
    }

    // First, evaluate if the query has any relevant books in our collection
    // Get a classification from Gemini about the topic relevance
    try {
      const topicClassifier = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      // First check if the query is about books or authors we might have
      const classificationPrompt = `
        You are a book database classifier. Analyze if this query is asking about books or authors that might 
        exist in a typical library collection. Don't analyze specific titles, just general topics.
        
        USER QUERY: "${message}"
        
        Rate how likely our library would have books on this topic on a scale from 0 to 1:
        - 0: Definitely not book-related or requesting adult/inappropriate content
        - 0.3: Possibly book-related but unlikely to be in our collection
        - 0.5: Moderately likely to be in our collection
        - 0.7: Highly likely to be in our collection
        - 1.0: Certainly in our collection (general fiction, classic literature, popular non-fiction, etc.)
        
        Respond with ONLY a number between 0 and 1.
      `
      
      const classificationResult = await topicClassifier.generateContent(classificationPrompt)
      const topicRelevanceText = classificationResult.response.text().trim()
      const topicRelevance = parseFloat(topicRelevanceText) || 0
      
      console.log(`Topic relevance score: ${topicRelevance} for query: "${message}"`)
      
      // If the topic relevance is very low, don't even try to find books
      if (topicRelevance < TOPIC_RELEVANCE_THRESHOLD) {
        const noRelevantBooksResponse = `I don't have any books in the database that address the topic of "${message}". My collection focuses on general literature, non-fiction, and academic subjects. Is there another type of book you're interested in?`
        
        return NextResponse.json({
          text: noRelevantBooksResponse,
          conversation: [...updatedConversation, { role: 'ai', content: noRelevantBooksResponse }],
          discussedBookIds: currentDiscussedBookIds,
          relevantBooks: [] // No books to suggest
        }, { status: 200 })
      }
    } catch (error) {
      console.error("Error in topic classification:", error)
      // Continue with regular flow if classification fails
    }
    
    // Get embedding for the user's query
    const queryEmbedding = await VectorOperations.getEmbedding(message, genAI)

    // Find or create embeddings for books
    if (bookEmbeddingsCache.length === 0) {
      console.log("Generating embeddings for books...")
      for (const book of allBooks) {
        const bookText = VectorOperations.getBookEmbeddingText(book)
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

    // Get books previously discussed
    const discussedBooks = allBooks.filter(book => currentDiscussedBookIds.includes(book.id))
    
    // Get top relevant books based on semantic search that meet the threshold
    const relevantBooks = similarityScores
      .filter(item => item.similarity >= SIMILARITY_THRESHOLD)
      .slice(0, MAX_SUGGESTIONS)
      
    // If no books meet the similarity threshold, return a message saying no relevant books were found
    if (relevantBooks.length === 0) {
      const noRelevantBooksResponse = `I don't have any books in the database that closely match your query about "${message}". Would you like recommendations on another topic?`
      
      return NextResponse.json({
        text: noRelevantBooksResponse,
        conversation: [...updatedConversation, { role: 'ai', content: noRelevantBooksResponse }],
        discussedBookIds: currentDiscussedBookIds,
        relevantBooks: [] // No books to suggest
      }, { status: 200 })
    }
    
    // Add newly discovered relevant books to tracking list
    relevantBooks.forEach(item => {
      if (!currentDiscussedBookIds.includes(item.book.id)) {
        currentDiscussedBookIds.push(item.book.id)
      }
    })

    // Create context from previously discussed books
    const discussedBooksContext = discussedBooks.length > 0 
      ? `PREVIOUSLY DISCUSSED BOOKS:\n${discussedBooks.map(book => 
          `Title: ${book.title}, Author: ${book.author}, Description: ${book.description || "No description available"}`
        ).join("\n\n")}`
      : "";

    // Include relevant books only if they meet similarity threshold
    const relevantBooksContext = relevantBooks.length > 0
      ? relevantBooks.map((item) => {
          const book = item.book
          return `Title: ${book.title}, Author: ${book.author}, Description: ${book.description || "No description available"}, Language: ${book.language || "Unknown"}, Published: ${book.publishedAt instanceof Date ? book.publishedAt.toDateString() : "Unknown date"}, Relevance: ${(item.similarity * 100).toFixed(1)}%`
        }).join("\n\n")
      : "No highly relevant books found for this specific query.";

    // Create the system prompt for the RAG chatbot
    const systemPrompt = `
    You are a knowledgeable book assistant with expertise in literature. Your role is to help users find books and provide information about books in the library's database. Follow these guidelines:
    
    1. **Book Focus Only:** Only discuss and recommend books that exist in the database.
    2. **No Fictional Responses:** Never make up information about books. Rely solely on the data provided.
    3. **Helpful Recommendations:** When appropriate, recommend books from the database based on user preferences.
    4. **Engage Naturally:** Maintain a conversational, friendly tone while providing accurate information.
    5. **Suggest Books Inline:** When recommending books, mention that the user can click on the book cards below your message to view more details.
    6. **Limited Suggestions:** You will only suggest the most relevant books for each query.
    7. **Remember Previous Context:** If the user is referring to a previously discussed book, continue the conversation about that book.
    8. **IMPORTANT - STRICT RULE:** If there are no books listed as "MOST RELEVANT BOOKS FOR THIS QUERY" below, you MUST NOT suggest any books or indicate that you have relevant books. Say clearly that you don't have books on that topic and suggest alternative topics.
    9. **Be Honest About Relevance:** If the books available aren't closely related to the user's query, acknowledge this but suggest the best matches available ONLY if they are listed below.
    
    ${discussedBooksContext ? discussedBooksContext + "\n\n" : ""}
    MOST RELEVANT BOOKS FOR THIS QUERY:
    ${relevantBooksContext}
    
    TOTAL BOOKS IN DATABASE: ${allBooks.length}
    `
    

    // Create a clean conversation history for Gemini
    const formattedConversation = updatedConversation.map(msg => 
      `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`
    ).join("\n")

    // Generate the content using the provided message and conversation context
    const result = await chatModel.generateContent(`${systemPrompt}\n${formattedConversation}`)

    const aiResponse = result.response.text()

    // Add AI's response to the conversation history
    const aiResponseMessage: ConversationMessage = { 
      role: 'ai' as const, 
      content: aiResponse
    }
    
    if (relevantBooks.length > 0) {
      aiResponseMessage.referencedBooks = relevantBooks.map(item => ({ 
        id: item.book.id, 
        title: item.book.title 
      }))
    }
    
    updatedConversation.push(aiResponseMessage)

    // Return the AI response, updated conversation, and complete book details
    return NextResponse.json({
      text: aiResponse,
      conversation: updatedConversation,
      discussedBookIds: currentDiscussedBookIds,
      relevantBooks: relevantBooks.length > 0 ? relevantBooks.map((item) => ({
        id: item.book.id,
        title: item.book.title,
        author: item.book.author,
        description: item.book.description || "No description available",
        coverImage: item.book.coverImage || "/placeholder-book.jpg",
        isbn: item.book.isbn,
        size: item.book.size,
        available: item.book.available,
        publishedAt: item.book.publishedAt,
        language: item.book.language,
        relevance: item.similarity,
      })) : [],
    })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json({ 
      error: "Failed to process chat request", 
      details: String(error) 
    }, { status: 500 })
  }
}
