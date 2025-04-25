"use client"

import { useState, useEffect } from "react"
import { Check, X, Clock } from "lucide-react"
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
  status: "pending" | "approved" | "rejected"
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<BookRequest[]>([])
  const [filter, setFilter] = useState("pending")
  const { toast } = useToast()

  useEffect(() => {
    loadRequests()
  }, [filter])

  const loadRequests = async () => {
    try {
      const response = await fetch(`/api/requests?status=${filter}`)
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

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/dashboard/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        loadRequests()
        toast({
          title: "Success",
          description: `Request ${status} successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600"
      case "rejected":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Book Requests</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
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
              <TableCell className={getStatusColor(request.status)}>
                <div className="flex items-center">
                  {request.status === "approved" && (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  {request.status === "rejected" && (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  {request.status === "pending" && (
                    <Clock className="h-4 w-4 mr-2" />
                  )}
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </div>
              </TableCell>
              <TableCell>
                {request.status === "pending" && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => handleUpdateStatus(request.id, "approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleUpdateStatus(request.id, "rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 