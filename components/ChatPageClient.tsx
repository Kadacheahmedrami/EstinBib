"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Send, RefreshCw, BookOpen, Sparkles, Copy, Share, Bookmark } from "lucide-react"

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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const shareMessage = (content: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Book Recommendation",
        text: content,
      })
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-red-50/30">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600"
                      : "bg-gradient-to-br from-[#e63946] to-[#c1121f]"
                  }`}
                >
                  {message.role === "user" ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/30" />
                  ) : (
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className="flex-1">
                  <div
                    className={`p-3 sm:p-4 rounded-2xl shadow-sm backdrop-blur-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                        : "bg-white/90 border border-gray-200/60 text-gray-800"
                    }`}
                  >
                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                      {message.content}
                    </p>

                    {/* Book Suggestions */}
                    {message.bookSuggestions && message.bookSuggestions.books.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                          <Sparkles className="w-4 h-4 text-[#e63946]" />
                          <span className="text-sm font-semibold text-gray-700">Recommended Books</span>
                        </div>
                        <div className="space-y-3">
                          {message.bookSuggestions.books.map((book) => (
                            <div
                              key={book.id}
                              className="group p-3 rounded-xl border border-gray-200/60 bg-gradient-to-r from-white to-gray-50/50 hover:from-red-50/30 hover:to-red-50/50 hover:border-red-200/60 transition-all duration-300 cursor-pointer active:scale-[0.98] shadow-sm hover:shadow-md"
                              onClick={() => navigateToBook(book.id)}
                            >
                              <div className="flex gap-3">
                                <div className="w-12 h-16 sm:w-14 sm:h-20 relative flex-shrink-0 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                                  <Image
                                    src={book.coverImage || "/placeholder.svg?height=80&width=56"}
                                    alt={book.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-1 group-hover:text-[#e63946] transition-colors">
                                    {book.title}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-gray-600 mb-2">by {book.author}</p>
                                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                                    {book.description}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span
                                      className={`px-2 py-1 text-xs rounded-full text-white font-medium shadow-sm ${
                                        book.available
                                          ? "bg-gradient-to-r from-green-500 to-green-600"
                                          : "bg-gradient-to-r from-gray-400 to-gray-500"
                                      }`}
                                    >
                                      {book.available ? "Available" : "Not Available"}
                                    </span>
                                    {book.relevance && (
                                      <span className="text-xs text-[#e63946] bg-red-50 border border-red-200 px-2 py-1 rounded-full font-medium">
                                        {Math.round(book.relevance * 100)}% match
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Actions */}
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-1 mt-2 ml-2">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="p-1.5 text-gray-400 hover:text-[#e63946] hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-95"
                        title="Copy message"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => shareMessage(message.content)}
                        className="p-1.5 text-gray-400 hover:text-[#e63946] hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-95"
                        title="Share message"
                      >
                        <Share className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="p-1.5 text-gray-400 hover:text-[#e63946] hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-95"
                        title="Save message"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%]">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#e63946] to-[#c1121f] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-white/90 border border-gray-200/60 text-gray-800 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#e63946] animate-bounce"></div>
                      <div
                        className="w-2 h-2 rounded-full bg-[#e63946] animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-[#e63946] animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t  border-gray-200/60 bg-white/80 backdrop-blur-xl p-3 sm:p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex  items-end gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about books..."
                className="w-full resize-none mt-1 bg-gray-50/80 border border-gray-300/60 rounded-2xl px-3 sm:px-4 py-3 pr-4 text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/20 min-h-[48px] max-h-32 overflow-y-auto transition-all duration-200 backdrop-blur-sm"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = "auto"
                  target.style.height = Math.min(target.scrollHeight, 128) + "px"
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-12 my-auto w-12 bg-gradient-to-br from-[#e63946] to-[#c1121f] hover:from-[#c1121f] hover:to-[#a61e1e] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-200 active:scale-95 flex items-center justify-center shadow-lg hover:shadow-xl"
              aria-label="Send message"
            >
              {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
