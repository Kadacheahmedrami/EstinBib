"use client"

import { useState, useEffect, useCallback } from "react"
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
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Image from "next/image"
// import {
//   processSndlDemand,

// } from "@/app/actions/sndl"

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
  status: "PENDING" | "APPROVED" | "REJECTED"
  requestedAt: string
  processedAt?: string
  sndlEmail?: string
  sndlPassword?: string
  adminNotes?: string
  emailSent: boolean
  emailSentAt?: string
}

export default function SNDLDemandsPage() {
  const [demands, setDemands] = useState<SNDLDemand[]>([])
  const [filter, setFilter] = useState("PENDING")
  const [selectedDemand, setSelectedDemand] = useState<SNDLDemand | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [sndlEmail, setSndlEmail] = useState("")
  const [sndlPassword, setSndlPassword] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  const loadDemands = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/dashboard/sndl?status=${filter}`)
      if (!res.ok) throw new Error(await res.text())
      setDemands(await res.json())
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }, [filter, toast])

  useEffect(() => {
    loadDemands()
  }, [loadDemands])

  const handleReview = (d: SNDLDemand) => {
    setSelectedDemand(d)
    setAdminNotes(d.adminNotes || "")
    setSndlEmail(d.sndlEmail || "")
    setSndlPassword(d.sndlPassword || "")
  }

  const handleUpdateAction = async (id: string, approved: boolean) => {
    try {
      if (approved && (!sndlEmail || !sndlPassword)) {
        toast({ title: "Missing Credentials", description: "Please fill in email and password", variant: "destructive" })
        return
      }

      // call signature: processSndlDemand(demandId, approved, adminNotes?, sndlEmail?, sndlPassword?)
      // await processSndlDemand(
      //   id,
      //   approved,
      //   adminNotes,
      //   approved ? sndlEmail : undefined,
      //   approved ? sndlPassword : undefined
      // )

      setSelectedDemand(null)
      setAdminNotes("")
      setSndlEmail("")
      setSndlPassword("")
      router.refresh()
      toast({ title: "Success", description: `Demand ${approved ? "approved" : "rejected"} successfully` })
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" })
    }
  }



  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "text-green-600"
      case "REJECTED": return "text-red-600"
      default: return "text-yellow-600"
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
      {/* Header + Filter */}
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

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request Reason</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Requested At</TableHead>
            <TableHead>Processed At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demands.map(d => (
            <TableRow key={d.id}>
              <TableCell>{d.requestReason}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                    {d.user.image && <Image src={d.user.image} alt="avatar" width={24} height={24} className="rounded-full" />}
                  <div className="flex flex-col">
                    <span>{d.user.name}</span>
                    <span className="text-sm text-gray-500">{d.user.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{new Date(d.requestedAt).toLocaleString()}</TableCell>
              <TableCell>{d.processedAt ? new Date(d.processedAt).toLocaleString() : '-'}</TableCell>
              <TableCell className={getStatusColor(d.status)}>
                <div className="flex items-center">
                  {d.status === "APPROVED" && <Check className="h-4 w-4 mr-2" />} 
                  {d.status === "REJECTED" && <X className="h-4 w-4 mr-2" />} 
                  {d.status === "PENDING" && <Clock className="h-4 w-4 mr-2" />}
                  {d.status.charAt(0) + d.status.slice(1).toLowerCase()}
                </div>
              </TableCell>
              <TableCell className="space-x-1">
                {d.status === "PENDING" && (
                  <Button variant="outline" size="sm" onClick={() => handleReview(d)}>Review</Button>
                )}
      
                {d.emailSent && (
                  <span className="text-sm text-gray-500">
                    Sent at {new Date(d.emailSentAt!).toLocaleString()}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
          {demands.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No demands found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Review Dialog */}
      {selectedDemand && (
        <Dialog open onOpenChange={() => setSelectedDemand(null)}>
          <DialogContent className="max-w-2xl space-y-4">
            <DialogHeader>
              <DialogTitle>Review SNDL Demand</DialogTitle>
            </DialogHeader>

            {/* Request Reason */}
            <div>
              <h3 className="font-medium mb-2">Request Reason</h3>
              <p>{selectedDemand.requestReason}</p>
            </div>

            {/* Admin Notes */}
            <div>
              <h3 className="font-medium mb-2">Admin Notes</h3>
              <Textarea
                placeholder="Add any notes..."
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Credentials (editable when approving) */}
            <div>
              <h3 className="font-medium mb-2">SNDL Credentials</h3>
              <Input
                placeholder="SNDL Email"
                value={sndlEmail}
                onChange={e => setSndlEmail(e.target.value)}
                className="mb-2"
              />
              <Input
                placeholder="SNDL Password"
                type="password"
                value={sndlPassword}
                onChange={e => setSndlPassword(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => handleUpdateAction(selectedDemand.id, false)}
              >
                <X className="h-4 w-4 mr-1" /> Reject
              </Button>
              <Button
                onClick={() => handleUpdateAction(selectedDemand.id, true)}
              >
                <Check className="h-4 w-4 mr-1" /> Approve
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
