"use client"

import { useState, useEffect } from "react"
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
  const { toast } = useToast()

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      const response = await fetch(`/api/dashboard/requests`)
      const data = await response.json()
      setRequests(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load book requests",
        variant: "destructive",
      })
    }
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
        </TableBody>
      </Table>
    </div>
  )
} 