"use client"

import { useState, useEffect, useCallback } from "react"
import { Trash2, Search, Edit2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface Complaint {
  id: string
  user: User
  title: string
  description: string
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED"
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  adminNotes?: string
  isPrivate: boolean
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isEditing, setIsEditing] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [complaintStatus, setComplaintStatus] = useState<Complaint["status"]>("PENDING")
  const { toast } = useToast()
  
  const loadComplaints = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/dashboard/complaints")
      if (!response.ok) {
        throw new Error(await response.text())
      }
      
      const data = await response.json()
      setComplaints(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load complaints",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const handleSearch = useCallback(async () => {
    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (searchQuery) {
        queryParams.append('query', searchQuery)
        if (searchType !== 'all') {
          queryParams.append('type', searchType)
        }
      }
      
      if (statusFilter !== 'all') {
        queryParams.append('status', statusFilter)
      }
      
      const url = `/api/dashboard/complaints${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(await response.text())
      }
      
      const data = await response.json()
      setComplaints(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to search complaints",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, searchType, statusFilter, toast])

  useEffect(() => {
    loadComplaints()
  }, [loadComplaints])

  const handleDeleteComplaint = async (id: string) => {
    if (!confirm("Are you sure you want to delete this complaint?")) return

    try {
      const response = await fetch(`/api/dashboard/complaints/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      await loadComplaints()
      toast({
        title: "Success",
        description: "Complaint deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete complaint",
        variant: "destructive",
      })
    }
  }

  const handleViewComplaint = async (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setAdminNotes(complaint.adminNotes || "")
    setComplaintStatus(complaint.status)
    setIsEditing(false)
  }

  const handleUpdateComplaint = async () => {
    if (!selectedComplaint) return

    try {
      const response = await fetch(`/api/dashboard/complaints/${selectedComplaint.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: complaintStatus,
          adminNotes: adminNotes,
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      await loadComplaints()
      setSelectedComplaint(null)
      toast({
        title: "Success",
        description: "Complaint updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update complaint",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: Complaint["status"]) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>
      case "IN_PROGRESS":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">In Progress</Badge>
      case "RESOLVED":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Resolved</Badge>
      case "REJECTED":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>
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
        <h1 className="text-2xl font-bold">Complaints Management</h1>
      </div>

      {/* Search and filter functionality */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search complaints..."
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
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="description">Description</SelectItem>
              <SelectItem value="user">Student Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSearch} className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
        <Button variant="outline" onClick={loadComplaints}>
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {complaints.map((complaint) => (
          <Card key={complaint.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <div className="flex-1 truncate pr-2">{complaint.title}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteComplaint(complaint.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
              <div className="flex justify-between items-center">
                <CardDescription>
                  {complaint.isPrivate ? "Anonymous" : complaint.user.name} • {new Date(complaint.createdAt).toLocaleDateString()}
                </CardDescription>
                {getStatusBadge(complaint.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm">{complaint.description}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleViewComplaint(complaint)}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
        {complaints.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No complaints found
          </div>
        )}
      </div>

      {selectedComplaint && (
        <Dialog open={true} onOpenChange={() => setSelectedComplaint(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>Complaint Details</span>
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1"
                  >
                    <Edit2 className="h-4 w-4" />
                    Update Status
                  </Button>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{selectedComplaint.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Submitted by {selectedComplaint.user.name} • {selectedComplaint.user.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedComplaint.createdAt).toLocaleDateString()} at {new Date(selectedComplaint.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>{getStatusBadge(selectedComplaint.status)}</div>
                </div>
                <h4 className="font-medium mt-4 mb-1">Description:</h4>
                <p className="whitespace-pre-wrap text-sm">{selectedComplaint.description}</p>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <Select value={complaintStatus} onValueChange={(value: Complaint["status"]) => setComplaintStatus(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Admin Notes</label>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes about this complaint (only visible to admins)"
                      rows={4}
                    />
                  </div>
                </div>
              ) : (
                selectedComplaint.adminNotes && (
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h4 className="font-medium mb-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Admin Notes:
                    </h4>
                    <p className="whitespace-pre-wrap text-sm">{selectedComplaint.adminNotes}</p>
                  </div>
                )
              )}

              {selectedComplaint.resolvedAt && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">
                    Resolved on {new Date(selectedComplaint.resolvedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <DialogFooter>
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateComplaint}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}