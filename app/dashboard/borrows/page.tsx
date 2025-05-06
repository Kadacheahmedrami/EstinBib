"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, Loader2, Plus, ChevronLeft, ChevronRight, Search, X, CalendarRange } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Type definitions
interface User {
  id: string
  name: string
  email: string
  educationYear?: string
  role?: string
}

interface Book {
  id: string
  title: string
  author: string
  isbn?: string
  barcode?: string
  coverImage?: string
  categories?: Array<{ id: string; name: string }>
}

interface Borrow {
  id: string
  borrowedAt: string
  dueDate: string
  returnedAt: string | null
  extensionCount: number
  isOverdue: boolean
  user: User
  book: Book
}

interface PaginationInfo {
  page: number
  pageSize: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface BorrowsResponse {
  data: Borrow[]
  pagination: PaginationInfo
}

interface ExtendBorrowFormData {
  weeks: number
  reason?: string
}

export default function BorrowsPage() {
  // Core state
  const [borrows, setBorrows] = useState<Borrow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })
  
  // Dialog states
  const [returnDialogOpen, setReturnDialogOpen] = useState(false)
  const [extendDialogOpen, setExtendDialogOpen] = useState(false)
  const [activeBorrowId, setActiveBorrowId] = useState<string | null>(null)
  const [extensionFormData, setExtensionFormData] = useState<ExtendBorrowFormData>({
    weeks: 2,
    reason: ""
  })
  
  const { toast } = useToast()

  // Load borrows data with pagination and filters
  const loadBorrows = useCallback(async () => {
    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams()
      queryParams.set("page", pagination.page.toString())
      queryParams.set("pageSize", pagination.pageSize.toString())
      
      if (status) {
        queryParams.set("status", status)
      }
      
      if (searchTerm) {
        queryParams.set("search", searchTerm)
      }
      
      const response = await fetch(`/api/dashboard/borrows?${queryParams.toString()}`)
      
      if (!response.ok) throw new Error(await response.text())
      
      const result: BorrowsResponse = await response.json()
      setBorrows(result.data)
      setPagination(result.pagination)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load borrows",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, pagination.page, pagination.pageSize, status, searchTerm])

  // Initial load and reload when filters/pagination change
  useEffect(() => {
    loadBorrows()
  }, [loadBorrows])

  // Change page
  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }))
    }
  }

  // Open return confirmation dialog
  const openReturnDialog = (id: string) => {
    setActiveBorrowId(id)
    setReturnDialogOpen(true)
  }

  // Open extend borrow dialog
  const openExtendDialog = (id: string) => {
    setActiveBorrowId(id)
    setExtensionFormData({
      weeks: 2, // Reset to default
      reason: ""
    })
    setExtendDialogOpen(true)
  }

  // Handle book return
  const handleReturn = async () => {
    if (!activeBorrowId) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/dashboard/borrows/${activeBorrowId}/return`, { 
        method: "POST"
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to return book")
      }
      
      await loadBorrows()
      toast({ title: "Success", description: "Book returned successfully" })
      setReturnDialogOpen(false)
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

  // Handle borrow extension
  const handleExtend = async () => {
    if (!activeBorrowId) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/dashboard/borrows/${activeBorrowId}/extend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weeks: extensionFormData.weeks,
          reason: extensionFormData.reason || undefined
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to extend borrow")
      }
      
      await loadBorrows()
      toast({ 
        title: "Success", 
        description: `Borrow extended by ${extensionFormData.weeks} week${extensionFormData.weeks !== 1 ? 's' : ''}` 
      })
      setExtendDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to extend borrow",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(searchQuery)
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setSearchTerm("")
  }

  // Loading state
  if (isLoading && !borrows.length) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Borrows & Returns</h1>
        <Link href="/dashboard/borrows/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Borrow
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by book title, ISBN, barcode, student name or email..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={clearSearch}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="submit">Search</Button>
        </div>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <Select 
            value={status || "all"} 
            onValueChange={(value) => setStatus(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="borrowed">Borrowed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Items per page:</span>
          <Select 
            value={pagination.pageSize.toString()} 
            onValueChange={(value) => {
              setPagination(prev => ({ 
                ...prev, 
                page: 1, // Reset to first page when changing page size
                pageSize: parseInt(value) 
              }))
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {searchTerm && (
          <Badge 
            variant="outline" 
            className="gap-1 ml-auto"
          >
            Search: {searchTerm}
            <button onClick={clearSearch}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
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
            <TableHead>Extensions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {borrows.map((borrow) => {
            const isReturned = borrow.returnedAt !== null
            const isOverdue = borrow.isOverdue
            
            let status = { label: "Borrowed", badgeVariant: "default" as "default" | "outline" | "destructive" }
            if (isReturned) {
              status = { label: "Returned", badgeVariant: "outline" as const }
            } else if (isOverdue) {
              status = { label: "Overdue", badgeVariant: "destructive" as const }
            }
            
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
                    {borrow.book.barcode && (
                      <span className="text-xs text-muted-foreground">
                        Barcode: {borrow.book.barcode}
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
                    {borrow.user.educationYear && (
                      <span className="text-xs text-muted-foreground">
                        Year: {borrow.user.educationYear}
                      </span>
                    )}
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
                  <span className="text-sm">
                    {borrow.extensionCount} / 3
                  </span>
                </TableCell>
                <TableCell>
                  {!isReturned && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReturnDialog(borrow.id)}
                        disabled={isSubmitting}
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Return
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openExtendDialog(borrow.id)}
                        disabled={isSubmitting || borrow.extensionCount >= 3}
                        title={borrow.extensionCount >= 3 ? "Maximum extensions reached" : "Extend borrow period"}
                      >
                        <CalendarRange className="h-4 w-4 mr-1" />
                        Extend
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
          {borrows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground py-8"
              >
                {searchTerm ? "No results found for your search" : "No borrows found"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.pageSize) + 1}-
            {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of {pagination.totalCount}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm mx-2">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Return Book Dialog */}
      <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Return</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this book as returned?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setReturnDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReturn}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirm Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Extend Borrow Dialog */}
      <Dialog open={extendDialogOpen} onOpenChange={setExtendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Borrow Period</DialogTitle>
            <DialogDescription>
              Select how many weeks you want to extend the borrow period.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="extension-weeks" className="text-sm font-medium">
                Extension Period
              </label>
              <Select 
                value={extensionFormData.weeks.toString()} 
                onValueChange={(value) => setExtensionFormData({
                  ...extensionFormData,
                  weeks: parseInt(value)
                })}
              >
                <SelectTrigger id="extension-weeks">
                  <SelectValue placeholder="2 weeks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 week</SelectItem>
                  <SelectItem value="2">2 weeks</SelectItem>
                  <SelectItem value="3">3 weeks</SelectItem>
                  <SelectItem value="4">4 weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="extension-reason" className="text-sm font-medium">
                Reason (Optional)
              </label>
              <Textarea
                id="extension-reason"
                placeholder="Why is this extension needed?"
                value={extensionFormData.reason || ""}
                onChange={(e) => setExtensionFormData({
                  ...extensionFormData,
                  reason: e.target.value
                })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setExtendDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleExtend}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Extend Borrow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}