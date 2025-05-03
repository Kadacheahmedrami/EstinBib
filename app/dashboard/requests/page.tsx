"use client"

import { useState, useEffect, useCallback } from "react"
import { Trash2 } from "lucide-react"
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

export default function RequestsPage() {
  const [requests, setRequests] = useState<BookRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const loadRequests = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/dashboard/requests`)
      if (!response.ok) {
        throw new Error(await response.text())
      }
      const data = await response.json()
      setRequests(data)
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
  }, [toast])

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
      setRequests((prev) => prev.filter((req) => req.id !== id))
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

  if (isLoading) {
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Date</TableHead>
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
    </div>
  )
}
