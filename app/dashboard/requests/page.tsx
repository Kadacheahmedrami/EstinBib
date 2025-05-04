"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Trash2, ChevronLeft, ChevronRight, Search } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface User {
  id: string
  name: string
  email: string
}

interface BookRequest {
  id: string
  user: User
  title: string
  author: string
  isbn?: string
  requestedAt: string
}

interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<BookRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [sortBy, setSortBy] = useState("requestedAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Handle search debounce
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }
    
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)
    
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }
    }
  }, [searchQuery])

  const loadRequests = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        sortOrder,
      })
      
      if (debouncedSearch) {
        params.append("search", debouncedSearch)
      }
      
      const response = await fetch(`/api/dashboard/requests?${params.toString()}`)
      if (!response.ok) {
        throw new Error(await response.text())
      }
      
      const data = await response.json()
      setRequests(data.requests)
      setPagination(data.pagination)
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to load book requests",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, pagination.page, pagination.limit, debouncedSearch, sortBy, sortOrder])

  useEffect(() => {
    loadRequests()
  }, [loadRequests])

  const handleDeleteRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return
    try {
      const response = await fetch(`/api/dashboard/requests/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(await response.text())
      }
      
      // Refresh the requests after deletion
      loadRequests()
      
      toast({
        title: "Success",
        description: "Book request deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete book request",
        variant: "destructive",
      })
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleLimitChange = (newLimit: string) => {
    setPagination(prev => ({ ...prev, page: 1, limit: parseInt(newLimit) }))
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      // Set new sort column and default to descending
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  if (isLoading && requests.length === 0) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Book Requests</h1>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search by title, author, ISBN, student name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <div className="w-40">
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="requestedAt">Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="author">Author</SelectItem>
                <SelectItem value="userName">Student Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-40">
            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("title")}
            >
              Title {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("author")}
            >
              Author {sortBy === "author" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("userName")}
            >
              Requested By {sortBy === "userName" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("requestedAt")}
            >
              Date {sortBy === "requestedAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No book requests found
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.title}</TableCell>
                <TableCell>{request.author}</TableCell>
                <TableCell>{request.isbn || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{request.user.name}</span>
                    <span className="text-sm text-gray-500">
                      {request.user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(request.requestedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteRequest(request.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-500">
          Showing {pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}-
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={pagination.limit.toString()}
            onValueChange={handleLimitChange}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
              <SelectItem value="100">100 per page</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={pagination.page <= 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center justify-center px-3 h-10 border rounded">
              {pagination.page} / {pagination.totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="icon"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}