"use client"

import { useState, useEffect, useCallback } from "react"
import { UserCog, Shield, BookOpen, AlertTriangle, Search, ChevronLeft, ChevronRight, User } from "lucide-react"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: "STUDENT" | "LIBRARIAN"
  emailVerified: string | null
  image: string | null
  createdAt: string
  borrowCount: number
  activeLoans: number
  overdueLoans: number
}

interface PaginationData {
  total: number
  page: number
  limit: number
  pages: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [role, setRole] = useState<string>("")
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  })
  const { toast } = useToast()
  const router = useRouter()

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  // Reset to first page when search or role filter changes
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [debouncedSearch, role])

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })
      
      if (debouncedSearch) {
        queryParams.append("search", debouncedSearch)
      }
      
      if (role && role !== 'ALL') {
        queryParams.append("role", role)
      }
      
      const response = await fetch(`/api/dashboard/users?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(await response.text())
      }
      
      const data = await response.json()
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, pagination.page, pagination.limit, debouncedSearch, role])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      const response = await fetch(`/api/dashboard/users`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      await loadUsers()
      setSelectedUser(null)
      toast({
        title: "Success",
        description: "User role updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user role",
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleLimitChange = (newLimit: string) => {
    setPagination(prev => ({ ...prev, limit: parseInt(newLimit), page: 1 }))
  }

  const navigateToUserProfile = (userId: string) => {
    router.push(`/dashboard/users/${userId}`)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="STUDENT">Student</SelectItem>
            <SelectItem value="LIBRARIAN">Librarian</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex h-[200px] w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "LIBRARIAN" ? "default" : "secondary"}
                    >
                      {user.role === "LIBRARIAN" ? (
                        <Shield className="h-3 w-3 mr-1" />
                      ) : (
                        <BookOpen className="h-3 w-3 mr-1" />
                      )}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.emailVerified ? "default" : "destructive"}
                    >
                      {user.emailVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        Total Borrows: {user.borrowCount}
                      </div>
                      <div className="text-sm">
                        Active Loans: {user.activeLoans}
                      </div>
                      {user.overdueLoans > 0 && (
                        <div className="text-sm text-red-600 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Overdue: {user.overdueLoans}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <UserCog className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigateToUserProfile(user.id)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Showing {users.length} of {pagination.total} users
              </span>
              <Select
                value={pagination.limit.toString()}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">per page</span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNumber;
                  
                  // Logic to show pages around current page
                  if (pagination.pages <= 5) {
                    pageNumber = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNumber = i + 1;
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNumber = pagination.pages - 4 + i;
                  } else {
                    pageNumber = pagination.page - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={pagination.page === pageNumber ? "default" : "outline"}
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                disabled={pagination.page === pagination.pages || pagination.pages === 0}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {selectedUser && (
        <Dialog open={true} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.image || undefined} />
                  <AvatarFallback>
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Joined {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) =>
                    handleUpdateRole(selectedUser.id, value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="LIBRARIAN">Librarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Activity Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold">
                      {selectedUser.borrowCount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Borrows
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold">
                      {selectedUser.activeLoans}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Active Loans
                    </div>
                  </div>
                  <div
                    className={`p-3 border rounded-lg ${
                      selectedUser.overdueLoans > 0 ? "border-red-200" : ""
                    }`}
                  >
                    <div
                      className={`text-2xl font-bold ${
                        selectedUser.overdueLoans > 0 ? "text-red-600" : ""
                      }`}
                    >
                      {selectedUser.overdueLoans}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Overdue Loans
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full mt-4"
                onClick={() => {
                  navigateToUserProfile(selectedUser.id);
                  setSelectedUser(null);
                }}
              >
                <User className="h-4 w-4 mr-2" />
                View Full Profile
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}