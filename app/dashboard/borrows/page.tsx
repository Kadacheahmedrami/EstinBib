"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, ArrowLeft, Loader2, Search, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { format, isAfter } from "date-fns"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

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

interface Borrow {
  id: string
  borrowedAt: string
  dueDate: string
  returnedAt: string | null
  user: User
  book: Book
}

export default function BorrowsPage() {
  // Core state
  const [borrows, setBorrows] = useState<Borrow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  
  // Dialog and search state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [userSearchOpen, setUserSearchOpen] = useState(false)
  const [bookSearchOpen, setBookSearchOpen] = useState(false)
  const [userQuery, setUserQuery] = useState("")
  const [bookQuery, setBookQuery] = useState("")
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [isLoadingBooks, setIsLoadingBooks] = useState(false)
  
  // Selection state
  const [users, setUsers] = useState<User[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  
  const { toast } = useToast()

  // Load borrows data
  const loadBorrows = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/dashboard/borrows")
      if (!response.ok) throw new Error(await response.text())
      setBorrows(await response.json())
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load borrows",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Load users with search - updated to set users immediately
  const loadUsers = useCallback(async (search = "") => {
    setIsLoadingUsers(true)
    try {
      const response = await fetch(`/api/dashboard/users?search=${encodeURIComponent(search)}&limit=50`)
      if (!response.ok) throw new Error(await response.text())
      const userData = await response.json()
      setUsers(userData) // Immediately update the users state
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setIsLoadingUsers(false)
    }
  }, [toast])

  // Load books with search - updated to set books immediately
  const loadBooks = useCallback(async (search = "") => {
    setIsLoadingBooks(true)
    try {
      const response = await fetch(`/api/dashboard/books?search=${encodeURIComponent(search)}&limit=50`)
      if (!response.ok) throw new Error(await response.text())
      const data = await response.json()
      setBooks(data.books || []) // Immediately update the books state
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load books",
        variant: "destructive",
      })
    } finally {
      setIsLoadingBooks(false)
    }
  }, [toast])

  // Initial load
  useEffect(() => {
    loadBorrows()
  }, [loadBorrows])

  // Reset and load data when dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      setSelectedUser(null)
      setSelectedBook(null)
      setUserQuery("")
      setBookQuery("")
      // Proactively load initial data when dialog opens
      loadUsers("")
      loadBooks("")
    }
  }, [isDialogOpen, loadUsers, loadBooks])




  // Debounced search functions
  const debouncedUserSearch = useCallback((query: string) => {
    const timeoutId = setTimeout(() => loadUsers(query), 300)
    return () => clearTimeout(timeoutId)
  }, [loadUsers])
  
  const debouncedBookSearch = useCallback((query: string) => {
    const timeoutId = setTimeout(() => loadBooks(query), 300)
    return () => clearTimeout(timeoutId)
  }, [loadBooks])
  useEffect(() => {
    if (userSearchOpen && userQuery.length > 0) {
      debouncedUserSearch(userQuery)
    }
  }, [userQuery, userSearchOpen, debouncedUserSearch])

  // Load users when user search popover opens - simplified
  useEffect(() => {
    if (userSearchOpen && users.length === 0 && !isLoadingUsers) {
      loadUsers("")
    }
  }, [userSearchOpen, users.length, loadUsers, isLoadingUsers])

  // Handle book search input changes - simplified since we're updating books immediately
  useEffect(() => {
    if (bookSearchOpen && bookQuery.length > 0) {
      debouncedBookSearch(bookQuery)
    }
  }, [bookQuery, bookSearchOpen, debouncedBookSearch])
  
  // Load books when book search popover opens - simplified
  useEffect(() => {
    if (bookSearchOpen && books.length === 0 && !isLoadingBooks) {
      loadBooks("")
    }
  }, [bookSearchOpen, books.length, loadBooks, isLoadingBooks])

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

      setIsDialogOpen(false)
      await loadBorrows()
      toast({ title: "Success", description: "Book borrowed successfully" })
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

  // Handle book return
  const handleReturn = async (id: string) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/dashboard/borrows/${id}/return`, { method: "POST" })
      if (!response.ok) throw new Error(await response.text())
      
      await loadBorrows()
      toast({ title: "Success", description: "Book returned successfully" })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to return book",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get borrow status with styling
  const getBorrowStatus = (borrow: Borrow): { label: string; badgeVariant: "outline" | "destructive" | "default" } => {
    if (borrow.returnedAt) {
      return { label: "Returned", badgeVariant: "outline" }
    }
    if (isAfter(new Date(), new Date(borrow.dueDate))) {
      return { label: "Overdue", badgeVariant: "destructive" }
    }
    return { label: "Borrowed", badgeVariant: "default" }
  }

  // Filter borrows based on status
  const filteredBorrows = statusFilter
    ? borrows.filter(borrow => {
        const status = getBorrowStatus(borrow)
        return status.label.toLowerCase() === statusFilter.toLowerCase()
      })
    : borrows

  // Loading state
  if (isLoading && !borrows.length) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Render selected user card
  const renderSelectedUser = () => {
    if (!selectedUser) return null
    
    return (
      <div className="flex items-center mt-2 bg-muted p-2 rounded-md">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium">{selectedUser.name}</p>
            {selectedUser.role && (
              <Badge variant={selectedUser.role === "LIBRARIAN" ? "default" : "outline"} className="text-xs">
                {selectedUser.role}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
          <div className="flex gap-2 mt-1 text-xs">
            {selectedUser.activeLoans && selectedUser.activeLoans > 0 && (
              <span className="text-blue-600">
                {selectedUser.activeLoans} active loan{selectedUser.activeLoans !== 1 ? 's' : ''}
              </span>
            )}
            {selectedUser.overdueLoans && selectedUser.overdueLoans > 0 && (
              <span className="text-red-600">
                {selectedUser.overdueLoans} overdue
              </span>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // Render selected book card
  const renderSelectedBook = () => {
    if (!selectedBook) return null
    
    return (
      <div className="flex items-center mt-2 bg-muted p-2 rounded-md">
        <div className="flex-1">
          <p className="font-medium">{selectedBook.title}</p>
          <p className="text-xs text-muted-foreground">
            by {selectedBook.author}
            {selectedBook.isbn && ` • ISBN: ${selectedBook.isbn}`}
          </p>
          {selectedBook.categories && selectedBook.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedBook.categories.map(cat => (
                <Badge key={cat.id} variant="outline" className="text-xs">
                  {cat.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setSelectedBook(null)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Borrows & Returns</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={isSubmitting}>
              <Plus className="h-4 w-4 mr-2" />
              New Borrow
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>New Borrow</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 py-4">
              {/* User Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">User</label>
                <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={userSearchOpen}
                      className="w-full justify-between"
                    >
                      {selectedUser ? selectedUser.name : "Select user..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <div className="relative">
                        <CommandInput 
                          placeholder="Search users..." 
                          value={userQuery}
                          onValueChange={setUserQuery}
                          className="px-3 py-2"
                        />
                        {isLoadingUsers && (
                          <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3" />
                        )}
                      </div>
                      {users.length === 0 && !isLoadingUsers && (
                        <CommandEmpty>
                          {userQuery ? "No users found." : "Type to search users..."}
                        </CommandEmpty>
                      )}
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {users.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.id}
                            onSelect={() => {
                              setSelectedUser(user)
                              setUserSearchOpen(false)
                            }}
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{user.name}</span>
                                {user.role && (
                                  <Badge variant={user.role === "LIBRARIAN" ? "default" : "outline"} className="text-xs">
                                    {user.role}
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                              <div className="flex gap-2 mt-1 text-xs">
                                {user.activeLoans && user.activeLoans > 0 && (
                                  <span className="text-blue-600">
                                    {user.activeLoans} active loan{user.activeLoans !== 1 ? 's' : ''}
                                  </span>
                                )}
                                {user.overdueLoans && user.overdueLoans > 0 && (
                                  <span className="text-red-600">
                                    {user.overdueLoans} overdue
                                  </span>
                                )}
                              </div>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedUser?.id === user.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {renderSelectedUser()}
              </div>
              
              {/* Book Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Book</label>
                <Popover open={bookSearchOpen} onOpenChange={setBookSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={bookSearchOpen}
                      className="w-full justify-between"
                    >
                      {selectedBook ? selectedBook.title : "Select book..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <div className="relative">
                        <CommandInput 
                          placeholder="Search by title, author..." 
                          value={bookQuery}
                          onValueChange={setBookQuery}
                          className="px-3 py-2"
                        />
                        {isLoadingBooks && (
                          <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3" />
                        )}
                      </div>
                      {books.length === 0 && !isLoadingBooks && (
                        <CommandEmpty>
                          {bookQuery ? "No books found." : "Type to search books..."}
                        </CommandEmpty>
                      )}
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {books.map((book) => (
                          <CommandItem
                            key={book.id}
                            value={book.id}
                            onSelect={() => {
                              setSelectedBook(book)
                              setBookSearchOpen(false)
                            }}
                          >
                            <div className="flex flex-col">
                              <span>{book.title}</span>
                              <span className="text-xs text-muted-foreground">
                                by {book.author} {book.isbn && `• ISBN: ${book.isbn}`}
                              </span>
                              {book.categories && book.categories.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {book.categories.map(cat => (
                                    <Badge key={cat.id} variant="outline" className="text-xs">
                                      {cat.name}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedBook?.id === book.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {renderSelectedBook()}
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleBorrow}
                disabled={isSubmitting || !selectedUser || !selectedBook}
                className="w-full"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Borrow Book
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm font-medium">Filter:</span>
        <div className="flex gap-2">
          <Badge 
            variant={statusFilter === null ? "secondary" : "outline"}
            className="cursor-pointer"
            onClick={() => setStatusFilter(null)}
          >
            All
          </Badge>
          <Badge 
            variant={statusFilter === "borrowed" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setStatusFilter("borrowed")}
          >
            Borrowed
          </Badge>
          <Badge 
            variant={statusFilter === "overdue" ? "destructive" : "outline"}
            className="cursor-pointer"
            onClick={() => setStatusFilter("overdue")}
          >
            Overdue
          </Badge>
          <Badge 
            variant={statusFilter === "returned" ? "outline" : "outline"}
            className={cn(
              "cursor-pointer",
              statusFilter === "returned" && "bg-green-100 text-green-800 hover:bg-green-200"
            )}
            onClick={() => setStatusFilter("returned")}
          >
            Returned
          </Badge>
        </div>
      </div>

      {/* Borrows Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Borrowed Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBorrows.map((borrow) => {
            const status = getBorrowStatus(borrow)
            return (
              <TableRow key={borrow.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{borrow.book.title}</span>
                    <span className="text-sm text-muted-foreground">
                      by {borrow.book.author}
                    </span>
                    {borrow.book.isbn && (
                      <span className="text-xs text-muted-foreground">
                        ISBN: {borrow.book.isbn}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{borrow.user.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {borrow.user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(borrow.borrowedAt), "PPP")}
                </TableCell>
                <TableCell>
                  {format(new Date(borrow.dueDate), "PPP")}
                </TableCell>
                <TableCell>
                    <Badge variant={status.badgeVariant}>
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {!borrow.returnedAt && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReturn(borrow.id)}
                      disabled={isSubmitting}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Return
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
          {filteredBorrows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-8"
              >
                No borrows found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}