"use client"

import { useState, useEffect } from "react"
import { Plus, ArrowLeft, Loader2 } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { format, isAfter } from "date-fns"

interface User {
  id: string
  name: string
  email: string
}

interface Book {
  id: string
  title: string
  author: string
  isbn?: string
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
  const [borrows, setBorrows] = useState<Borrow[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedBook, setSelectedBook] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadBorrows()
    loadUsers()
    loadBooks()
  }, [])

  const loadBorrows = async () => {
    try {
      const response = await fetch("/api/dashboard/borrows")
      const data = await response.json()
      setBorrows(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load borrows",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    }
  }

  const loadBooks = async () => {
    try {
      const response = await fetch("/api/books?available=true")
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive",
      })
    }
  }

  const handleBorrow = async () => {
    if (!selectedUser || !selectedBook) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/dashboard/borrows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser,
          bookId: selectedBook,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      setSelectedUser("")
      setSelectedBook("")
      await loadBorrows()
      await loadBooks() // Reload books to update availability
      toast({
        title: "Success",
        description: "Book borrowed successfully",
      })
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

  const handleReturn = async (id: string) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/dashboard/borrows/${id}/return`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      await loadBorrows()
      await loadBooks() // Reload books to update availability
      toast({
        title: "Success",
        description: "Book returned successfully",
      })
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

  const getBorrowStatus = (borrow: Borrow) => {
    if (borrow.returnedAt) {
      return {
        label: "Returned",
        color: "text-green-600",
      }
    }

    if (isAfter(new Date(), new Date(borrow.dueDate))) {
      return {
        label: "Overdue",
        color: "text-red-600",
      }
    }

    return {
      label: "Borrowed",
      color: "text-yellow-600",
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Borrows & Returns</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={isSubmitting}>
              <Plus className="h-4 w-4 mr-2" />
              New Borrow
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Borrow</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger>
                  <SelectValue placeholder="Select book" />
                </SelectTrigger>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title} - {book.author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleBorrow}
                disabled={isSubmitting || !selectedUser || !selectedBook}
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
          {borrows.map((borrow) => {
            const status = getBorrowStatus(borrow)
            return (
              <TableRow key={borrow.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{borrow.book.title}</span>
                    <span className="text-sm text-muted-foreground">
                      by {borrow.book.author}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{borrow.user.name}</span>
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
                <TableCell className={status.color}>
                  {status.label}
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
          {borrows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
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