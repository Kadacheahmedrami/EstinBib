"use client"

import { useState, useEffect, useCallback } from "react"
import { Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface SNDLDemand {
  id: string
  user: User
  requestReason: string
  status: string
  adminNotes: string | null
  requestedAt: string
  processedAt: string | null
  processedBy: string | null
}

interface PaginationInfo {
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

export default function SNDLDemandsPage() {
  const [demands, setDemands] = useState<SNDLDemand[]>([])
  const [selectedDemand, setSelectedDemand] = useState<SNDLDemand | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("all")
  const [statusFilter, setStatusFilter] = useState("")
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  })
  const { toast } = useToast()
  
  const loadDemands = useCallback(async () => {
    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams()
      
      // Pagination parameters
      queryParams.append('page', pagination.page.toString())
      queryParams.append('limit', pagination.limit.toString())
      
      // Search parameters
      if (searchQuery) {
        queryParams.append('query', searchQuery)
        queryParams.append('type', searchType)
      }
      
      // Status filter
      if (statusFilter && statusFilter !== 'all') {
        queryParams.append('status', statusFilter)
      }
      
      const url = `/api/dashboard/sndl?${queryParams.toString()}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(await response.text())
      }
      
      const data = await response.json()
      setDemands(data.demands)
      setPagination(data.pagination)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load demands",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [pagination.page, pagination.limit, searchQuery, searchType, statusFilter, toast])

  useEffect(() => {
    loadDemands()
  }, [loadDemands])

  const handleSearch = () => {
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleDeleteDemand = async (id: string) => {
    if (!confirm("Are you sure you want to delete this demand?")) return

    try {
      const response = await fetch(`/api/dashboard/sndl/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      await loadDemands()
      toast({
        title: "Success",
        description: "Demand deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete demand",
        variant: "destructive",
      })
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderPagination = () => {
    const { page, totalPages } = pagination
    
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => page > 1 && handlePageChange(page - 1)}
              className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
          
          {/* Show first page */}
          {totalPages > 0 && (
            <PaginationItem>
              <PaginationLink 
                isActive={page === 1}
                onClick={() => handlePageChange(1)}
              >
                1
              </PaginationLink>
            </PaginationItem>
          )}
          
          {/* Ellipsis for many pages */}
          {page > 3 && (
            <PaginationItem>
              <PaginationLink>...</PaginationLink>
            </PaginationItem>
          )}
          
          {/* Show current page and surrounding pages */}
          {page > 2 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(page - 1)}>
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          
          {page !== 1 && page !== totalPages && (
            <PaginationItem>
              <PaginationLink isActive onClick={() => handlePageChange(page)}>
                {page}
              </PaginationLink>
            </PaginationItem>
          )}
          
          {page < totalPages - 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          
          {/* Ellipsis for many pages */}
          {page < totalPages - 2 && (
            <PaginationItem>
              <PaginationLink>...</PaginationLink>
            </PaginationItem>
          )}
          
          {/* Show last page */}
          {totalPages > 1 && (
            <PaginationItem>
              <PaginationLink 
                isActive={page === totalPages}
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => page < totalPages && handlePageChange(page + 1)}
              className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  if (isLoading && demands.length === 0) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">SNDL Demands</h1>
      </div>

      {/* Search functionality */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search demands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger>
              <SelectValue placeholder="Search in..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              <SelectItem value="name">Student Name</SelectItem>
              <SelectItem value="email">Student Email</SelectItem>
              <SelectItem value="reason">Request Reason</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSearch} className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            setSearchQuery("")
            setSearchType("all")
            setStatusFilter("")
            setPagination(prev => ({ ...prev, page: 1 }))
          }}
        >
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demands.map((demand) => (
          <Card key={demand.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="truncate">{demand.user.name}</span>
                  <CardDescription className="truncate">{demand.user.email}</CardDescription>
                </div>
                <span 
                  className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(demand.status)}`}
                >
                  {demand.status}
                </span>
              </CardTitle>
              <CardDescription>
                Requested: {new Date(demand.requestedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm">{demand.requestReason}</p>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedDemand(demand)}
              >
                View Details
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleDeleteDemand(demand.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
        {demands.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No demands found
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        {pagination.totalPages > 0 && renderPagination()}
      </div>

      {/* Results summary */}
      <div className="mt-2 text-center text-sm text-muted-foreground">
        Showing {demands.length} of {pagination.totalItems} results
      </div>

      {selectedDemand && (
        <Dialog open={true} onOpenChange={() => setSelectedDemand(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Demand Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Student</h3>
                  <p>{selectedDemand.user.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                  <p>{selectedDemand.user.email}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(selectedDemand.status)}`}>
                    {selectedDemand.status}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Requested At</h3>
                  <p>{new Date(selectedDemand.requestedAt).toLocaleString()}</p>
                </div>
                {selectedDemand.processedAt && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Processed At</h3>
                    <p>{new Date(selectedDemand.processedAt).toLocaleString()}</p>
                  </div>
                )}
                {selectedDemand.processedBy && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Processed By</h3>
                    <p>{selectedDemand.processedBy}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Request Reason</h3>
                <p className="whitespace-pre-wrap mt-1 p-3 bg-muted rounded-md">{selectedDemand.requestReason}</p>
              </div>

              {selectedDemand.adminNotes && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Admin Notes</h3>
                  <p className="whitespace-pre-wrap mt-1 p-3 bg-muted rounded-md">{selectedDemand.adminNotes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}