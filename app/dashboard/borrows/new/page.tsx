"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, Loader2, Plus, Search, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useDebounce } from "use-debounce" // Make sure to install this package

// Type definitions
interface User {
  id: string
  name: string
  email: string
  role?: string
  activeLoans?: number
  overdueLoans?: number
}

interface Book {
  id: string
  title: string
  author: string
  isbn?: string
  available?: boolean
  categories?: Array<{ id: string; name: string }>
}

export default function NewBorrowPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  // Active step tracking
  const [activeStep, setActiveStep] = useState<"user" | "book" | "confirm">("user")
  
  // Search state
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [bookSearchQuery, setBookSearchQuery] = useState("")
  const [debouncedUserQuery] = useDebounce(userSearchQuery, 300)
  const [debouncedBookQuery] = useDebounce(bookSearchQuery, 300)
  const [isUserSearching, setIsUserSearching] = useState(false)
  const [isBookSearching, setIsBookSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Data state
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [bookAvailabilityFilter, setBookAvailabilityFilter] = useState<string>("all")
  
  // Search users from API based on the actual API implementation
  const searchUsers = useCallback(async (query: string) => {
    if (query === "" && filteredUsers.length > 0) return
    
    setIsUserSearching(true)
    try {
      // Using the SQL ILIKE search from the API route
      const apiUrl = `/api/dashboard/users?limit=20${query ? `&search=${encodeURIComponent(query)}` : ""}`
        
      const response = await fetch(apiUrl)
      if (!response.ok) throw new Error(await response.text())
      
      // The user API returns an array directly
      const userData = await response.json()
      
      // Process the user data to ensure it has the right format
      // The API returns additional fields like borrowCount, activeLoans, overdueLoans
      setFilteredUsers(userData)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to search users",
        variant: "destructive",
      })
      setFilteredUsers([])
    } finally {
      setIsUserSearching(false)
    }
  }, [toast, filteredUsers.length])

  // Search books from API based on the actual API implementation
  const searchBooks = useCallback(async (query: string, availabilityFilter: string) => {
    if (query === "" && filteredBooks.length > 0 && availabilityFilter === bookAvailabilityFilter) return
    
    setIsBookSearching(true)
    try {
      // From the API implementation, we can see it supports:
      // - search parameter for title/author
      // - category parameter (not used in our UI currently)
      // - page and limit parameters
      let apiUrl = `/api/dashboard/books?limit=20`
      
      if (query) {
        apiUrl += `&search=${encodeURIComponent(query)}`
      }
      
      // The API doesn't have a direct "available" filter as of now
      // We'll need to filter on the client side
        
      const response = await fetch(apiUrl)
      if (!response.ok) throw new Error(await response.text())
      
      const bookData = await response.json()
      const books = bookData.books || []
      
      // Client-side filtering for availability
      const filteredBooksData = availabilityFilter === "available" 
        ? books.filter((book: Book) => book.available !== false)
        : books
        
      setFilteredBooks(filteredBooksData)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to search books",
        variant: "destructive",
      })
      setFilteredBooks([])
    } finally {
      setIsBookSearching(false)
    }
  }, [toast, filteredBooks.length, bookAvailabilityFilter])

  // Load initial data
  useEffect(() => {
    searchUsers("")
  }, [searchUsers])

  // Trigger user search when debounced query changes
  useEffect(() => {
    searchUsers(debouncedUserQuery)
  }, [debouncedUserQuery, searchUsers])

  // Trigger book search when either debounced query or availability filter changes
  useEffect(() => {
    if (activeStep === "book") {
      searchBooks(debouncedBookQuery, bookAvailabilityFilter)
    }
  }, [debouncedBookQuery, bookAvailabilityFilter, activeStep, searchBooks])

  // Handle user selection
  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    setActiveStep("book")
    // Reset books and trigger initial book search when moving to book step
    setFilteredBooks([])
    searchBooks("", bookAvailabilityFilter)
  }

  // Handle book selection
  const handleBookSelect = (book: Book) => {
    setSelectedBook(book)
    setActiveStep("confirm")
  }

  // Handle book availability filter change
  const handleBookFilterChange = (value: string) => {
    setBookAvailabilityFilter(value)
    searchBooks(bookSearchQuery, value)
  }

  // Handle borrow submission
  const handleBorrow = async () => {
    if (!selectedUser || !selectedBook) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/dashboard/borrows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          bookId: selectedBook.id,
        }),
      })

      if (!response.ok) throw new Error(await response.text())

      toast({ title: "Success", description: "Book borrowed successfully" })
      router.push("/dashboard/borrows")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to borrow book",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <Link href="/dashboard/borrows" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">New Borrow</h1>
      </div>

      {/* Step indicator */}
      <div className="mb-6">
        <div className="flex items-center">
          <div 
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
              activeStep === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            1
          </div>
          <div className="h-px w-12 bg-border mx-2"></div>
          <div 
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
              activeStep === "book" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            2
          </div>
          <div className="h-px w-12 bg-border mx-2"></div>
          <div 
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
              activeStep === "confirm" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            3
          </div>

          <div className="ml-4 text-sm">
            {activeStep === "user" && <span>Select User</span>}
            {activeStep === "book" && <span>Select Book</span>}
            {activeStep === "confirm" && <span>Confirm</span>}
          </div>
        </div>
      </div>

      {/* Content based on active step */}
      <div className=" rounded-lg border shadow-sm">
        {/* Step 1: Select User */}
        {activeStep === "user" && (
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Select a User</h2>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="pl-10"
              />
              {userSearchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={() => setUserSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {isUserSearching ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No users found</p>
                ) : (
                  filteredUsers.map(user => (
                    <Card 
                      key={user.id} 
                      className={cn(
                        "cursor-pointer hover:border-primary transition-colors",
                        selectedUser?.id === user.id && "border-primary ring-1 ring-primary"
                      )}
                      onClick={() => handleUserSelect(user)}
                    >
                      <CardContent className="flex items-start p-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{user.name}</p>
                            {user.role && (
                              <Badge variant={user.role === "LIBRARIAN" ? "default" : "outline"} className="text-xs">
                                {user.role}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex gap-2 mt-1 text-xs">
                            {/* Use the activeLoans field from API (renamed from borrow_count) */}
                            {user.activeLoans && user.activeLoans > 0 && (
                              <span className="text-blue-600">
                                {user.activeLoans} active loan{user.activeLoans !== 1 ? 's' : ''}
                              </span>
                            )}
                            {/* Use the overdueLoans field from API */}
                            {user.overdueLoans && user.overdueLoans > 0 && (
                              <span className="text-red-600">
                                {user.overdueLoans} overdue
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Book */}
        {activeStep === "book" && (
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2" 
                onClick={() => setActiveStep("user")}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <h2 className="text-lg font-medium">Select a Book</h2>
            </div>

            <div className="mb-6 p-3 bg-muted rounded-md">
              <p className="font-medium">Selected User:</p>
              <p>{selectedUser?.name}</p>
              <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, ISBN..."
                value={bookSearchQuery}
                onChange={(e) => setBookSearchQuery(e.target.value)}
                className="pl-10"
              />
              {bookSearchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={() => setBookSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Tabs 
              defaultValue="all" 
              value={bookAvailabilityFilter}
              onValueChange={handleBookFilterChange}
              className="mb-4"
            >
              <TabsList>
                <TabsTrigger value="all">All Books</TabsTrigger>
                <TabsTrigger value="available">Available</TabsTrigger>
              </TabsList>
            </Tabs>

            {isBookSearching ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredBooks.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No books found</p>
                ) : (
                  filteredBooks.map(book => (
                    <Card 
                      key={book.id} 
                      className={cn(
                        "cursor-pointer hover:border-primary transition-colors",
                        !book.available && "opacity-60",
                        selectedBook?.id === book.id && "border-primary ring-1 ring-primary"
                      )}
                      onClick={() => book.available !== false && handleBookSelect(book)}
                    >
                      <CardContent className="flex items-start p-4">
                        <div className="flex-1">
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-muted-foreground">
                            by {book.author}
                            {book.isbn && ` • ISBN: ${book.isbn}`}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {book.available === false && (
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-800">
                                Not Available
                              </Badge>
                            )}
                            {book.categories && book.categories.map(cat => (
                              <Badge key={cat.id} variant="outline" className="text-xs">
                                {cat.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Confirm */}
        {activeStep === "confirm" && (
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2" 
                onClick={() => setActiveStep("book")}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <h2 className="text-lg font-medium">Confirm Borrow</h2>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">USER</h3>
                  <div className="mb-1 font-medium">{selectedUser?.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedUser?.email}</div>
                  <div className="flex gap-2 mt-1 text-xs">
                    {selectedUser?.activeLoans && selectedUser.activeLoans > 0 && (
                      <span className="text-blue-600">
                        {selectedUser.activeLoans} active loan{selectedUser.activeLoans !== 1 ? 's' : ''}
                      </span>
                    )}
                    {selectedUser?.overdueLoans && selectedUser.overdueLoans > 0 && (
                      <span className="text-red-600">
                        {selectedUser.overdueLoans} overdue
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">BOOK</h3>
                  <div className="mb-1 font-medium">{selectedBook?.title}</div>
                  <div className="text-sm text-muted-foreground">
                    by {selectedBook?.author}
                    {selectedBook?.isbn && ` • ISBN: ${selectedBook.isbn}`}
                  </div>
                  {selectedBook?.categories && selectedBook.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedBook.categories.map(cat => (
                        <Badge key={cat.id} variant="outline" className="text-xs">
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-md text-sm">
                <p className="font-medium text-amber-800">Borrowing Terms</p>
                <p className="text-amber-700">
                  This item will be due back in 14 days. Late returns may incur fees.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Link href="/dashboard/borrows" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button
                  onClick={handleBorrow}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Confirm Borrow
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}