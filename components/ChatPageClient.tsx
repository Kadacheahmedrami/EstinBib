"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Book {
  id: string
  title: string
  author: string
  description: string
  coverImage: string
  isbn?: string
  size: number
  available: boolean
  publishedAt: string
  language: string
  relevance?: number
}

interface BookSuggestion {
  books: Book[]
}

interface Message {
  role: "user" | "assistant"
  content: string
  bookSuggestions?: BookSuggestion
}

export default function ChatPageClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your book recommendation assistant. What kind of books are you interested in?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversation, setConversation] = useState<string[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) setIsMenuOpen(false)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isMenuOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message to chat
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Send message to API with conversation history
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          conversation: conversation,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      // Add assistant response to chat with book suggestions if available
      const assistantMessage: Message = {
        role: "assistant",
        content: data.text,
      }

      // Add book suggestions if available
      if (data.relevantBooks && Array.isArray(data.relevantBooks) && data.relevantBooks.length > 0) {
        assistantMessage.bookSuggestions = {
          books: data.relevantBooks,
        }
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Update conversation history
      setConversation(data.conversation || [])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToBook = (bookId: string) => {
    router.push(`/catalog/${bookId}`)
  }



  return (
    <div className="min-h-[90vh] overflow-hidden bg-white text-gray-800 flex flex-col">
    
      <main className="flex-1 h-full container mx-auto px-3 sm:px-4 py-3 sm:py-6 flex flex-col">
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
          {/* Chat Container */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex-1 flex flex-col shadow-sm">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-6 bg-gray-50">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%] p-3 sm:p-4 rounded-lg ${
                      message.role === "user"
                        ? "bg-[#e63946] text-white"
                        : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-[#e63946]"
                        >
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

                      {/* Book Suggestions - Optimized for mobile */}
                      {message.bookSuggestions && message.bookSuggestions.books.length > 0 && (
                        <div className="mt-3 sm:mt-4 space-y-2">
                          <p className="text-xs sm:text-sm font-medium text-gray-700">Top Book Suggestions:</p>
                          <div className="flex flex-col gap-2 sm:gap-3 mt-2">
                            {message.bookSuggestions.books.map((book) => (
                              <div
                                key={book.id}
                                className="flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
                                onClick={() => navigateToBook(book.id)}
                              >
                                <div className="flex-shrink-0 w-12 h-18 sm:w-16 sm:h-24 relative">
                                  <Image
                                    src={book.coverImage || "/placeholder.svg?height=96&width=64"}
                                    alt={book.title}
                                    fill
                                    className="object-cover rounded-md"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-gray-800 text-xs sm:text-sm truncate">
                                    {book.title}
                                  </h3>
                                  <p className="text-xs text-gray-600 truncate">by {book.author}</p>
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 hidden sm:block">
                                    {book.description}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-1 sm:hidden">
                                    {book.description}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                                    <span
                                      className={`px-1 sm:px-1.5 py-0.5 text-[10px] sm:text-xs rounded-full text-white ${
                                        book.available ? "bg-green-600" : "bg-gray-500"
                                      }`}
                                    >
                                      {book.available ? "Available" : "Not Available"}
                                    </span>
                                    {book.relevance && (
                                      <span className="text-[10px] sm:text-xs text-gray-500">
                                        {Math.round(book.relevance * 100)}% match
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%] p-3 sm:p-4 rounded-lg bg-white border border-gray-200 text-gray-800 shadow-sm">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#e63946]"
                      >
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#e63946] animate-bounce"></div>
                      <div
                        className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#e63946] animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#e63946] animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Optimized for mobile */}
            <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about books..."
                  className="flex-1 resize-none bg-white border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] min-h-[45px] sm:min-h-[60px]"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-2.5 sm:p-3 bg-[#e63946] hover:bg-[#c1121f] text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
