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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface User {
  id: string
  name: string
  email: string
}

interface SNDLDemand {
  id: string
  user: User
  title: string
  description: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
  responseMessage?: string
}

export default function SNDLDemandsPage() {
  const [demands, setDemands] = useState<SNDLDemand[]>([])
  const [filter, setFilter] = useState("PENDING")
  const [selectedDemand, setSelectedDemand] = useState<SNDLDemand | null>(null)
  const [responseMessage, setResponseMessage] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadDemands()
  }, [filter])

  const loadDemands = async () => {
    try {
      const response = await fetch(`/api/dashboard/sndl?status=${filter}`)
      const data = await response.json()
      setDemands(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load SNDL demands",
        variant: "destructive",
      })
    }
  }

  const handleUpdateStatus = async (
    id: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      const response = await fetch(`/api/sndl/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, responseMessage }),
      })

      if (response.ok) {
        setSelectedDemand(null)
        setResponseMessage("")
        loadDemands()
        toast({
          title: "Success",
          description: `Demand ${status.toLowerCase()} successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update demand status",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "text-green-600"
      case "REJECTED":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">SNDL Demands</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demands.map((demand) => (
            <TableRow key={demand.id}>
              <TableCell>{demand.title}</TableCell>
              <TableCell className="max-w-md">
                <p className="truncate">{demand.description}</p>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{demand.user.name}</span>
                  <span className="text-sm text-gray-500">
                    {demand.user.email}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {new Date(demand.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className={getStatusColor(demand.status)}>
                <div className="flex items-center">
                  {demand.status === "APPROVED" && (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  {demand.status === "REJECTED" && (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  {demand.status === "PENDING" && (
                    <Clock className="h-4 w-4 mr-2" />
                  )}
                  {demand.status.charAt(0) + demand.status.slice(1).toLowerCase()}
                </div>
              </TableCell>
              <TableCell>
                {demand.status === "PENDING" && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => setSelectedDemand(demand)}
                    >
                      Review
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedDemand && (
        <Dialog open={true} onOpenChange={() => setSelectedDemand(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review SNDL Demand</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Title</h3>
                <p>{selectedDemand.title}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="whitespace-pre-wrap">{selectedDemand.description}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Response Message</h3>
                <Textarea
                  placeholder="Enter your response message..."
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    handleUpdateStatus(selectedDemand.id, "REJECTED")
                  }
                  className="text-red-600 hover:text-red-700"
                >
                  Reject
                </Button>
                <Button
                  onClick={() =>
                    handleUpdateStatus(selectedDemand.id, "APPROVED")
                  }
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 