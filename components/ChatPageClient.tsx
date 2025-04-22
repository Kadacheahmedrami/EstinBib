"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function ChatPageClient() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: "Hello! I'm your book recommendation assistant. What kind of books are you interested in?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversation, setConversation] = useState<string[]>([]) // Store conversation history
  const [relevantBooks, setRelevantBooks] = useState<any[]>([]) // Store relevant books
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
    const userMessage: { role: "user" | "assistant"; content: string } = { role: "user", content: input }
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
          conversation: conversation 
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      // Add assistant response to chat
      setMessages((prev) => [...prev, { role: "assistant", content: data.text }])
      
      // Update conversation history
      setConversation(data.conversation || [])
      
      // Update relevant books if available
      if (data.relevantBooks) {
        setRelevantBooks(data.relevantBooks)
      }
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <button onClick={() => router.push("/")} className="mr-4 text-gray-600 hover:text-gray-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold mb-1">Book Chat</h1>
          <p className="text-gray-600">Ask me about books in our library. I can help you find your next great read!</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chat Container - Takes 2/3 of space on medium screens and up */}
        <div className="md:col-span-2 flex flex-col h-[70vh] border rounded-lg overflow-hidden bg-white shadow-sm">
          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    message.role === "user" ? "ml-auto max-w-[80%] bg-blue-50" : "mr-auto max-w-[80%] bg-gray-100"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <Image src="/placeholder.svg?height=32&width=32" alt="AI" width={32} height={32} />
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <Image src="/placeholder.svg?height=32&width=32" alt="User" width={32} height={32} />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-gray-100 max-w-[80%] mr-auto">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about books in our library..."
                className="flex-1 resize-none border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Relevant Books Panel - Takes 1/3 of space on medium screens and up */}
        <div className="hidden md:block h-[70vh] border rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="font-semibold">Relevant Books</h2>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100%-58px)]">
            {relevantBooks.length > 0 ? (
              <div className="space-y-4">
                {relevantBooks.map((book) => (
                  <div key={book.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <h3 className="font-medium">{book.title}</h3>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                    <div className="mt-2 bg-blue-100 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${Math.round(book.relevance * 100)}%` }} 
                      />
                    </div>
                    <p className="text-xs text-right mt-1 text-gray-500">
                      {Math.round(book.relevance * 100)}% relevance
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No relevant books yet</p>
                <p className="text-sm mt-2">Ask a question to see matches</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}