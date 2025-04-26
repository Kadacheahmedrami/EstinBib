"use client"

import { useState, useEffect, useCallback } from "react"
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
        description: error instanceof Error ? error.message : "Failed to load book requests",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadRequests()
  }, [loadRequests])

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
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
            </TableRow>
          ))}
          {requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No book requests found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
} 