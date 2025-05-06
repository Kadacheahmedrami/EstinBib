"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Shield, BookOpen, BadgeCheck, Clock, AlertTriangle, Pencil, ChevronLeft, Book, Calendar, CreditCard, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface PageProps {
  params: Promise<{ userid: string }>
}

interface User {
  id: string
  name: string
  email: string
  role: "STUDENT" | "LIBRARIAN"
  emailVerified: string | null
  image: string | null
  nfcCardId: string | null
  educationYear: number | null
  createdAt: string
  updatedAt: string
}

// Updated BorrowHistory interface to match the API response
interface BorrowHistory {
  id: string
  bookId: string
  borrowedAt: string
  dueDate: string
  returnedAt: string | null
  extensionCount: number
  book: {
    title: string
    author: string
    coverImage: string | null
    isbn: string | null
    barcode: string | null
    type: string
  }
}

// Non-async outer component that safely uses hooks
export default function UserDetailPage({ params }: PageProps) {
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [borrowHistory, setBorrowHistory] = useState<BorrowHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editRoleOpen, setEditRoleOpen] = useState(false)
  const [newRole, setNewRole] = useState<string>("")
  const [userId, setUserId] = useState<string | null>(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [stats, setStats] = useState({
    totalBorrows: 0,
    activeLoans: 0,
    overdueLoans: 0,
    returnedOnTime: 0
  })
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Check if a borrow is overdue
  const isOverdue = (borrow: BorrowHistory) => {
    return borrow.returnedAt === null && new Date(borrow.dueDate) < new Date();
  }

  // First, resolve the userId from the Promise
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params
        setUserId(resolvedParams.userid)
      } catch (error) {
        console.error("Failed to resolve params:", error)
        toast({
          title: "Error",
          description: "Failed to load user information",
          variant: "destructive",
        })
      }
    }
    
    resolveParams()
  }, [params, toast])

  // Then use the resolved userId to fetch data
  useEffect(() => {
    if (!userId) return // Don't fetch until we have the userId

    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch user data
        const userResponse = await fetch(`/api/dashboard/users/${userId}`)
        if (!userResponse.ok) {
          if (userResponse.status === 403) {
            toast({
              title: "Access Denied",
              description: "You don't have permission to view this user's information",
              variant: "destructive",
            })
            setIsAuthorized(false)
            return
          }
          throw new Error("Failed to fetch user")
        }
        
        setIsAuthorized(true)
        const userData = await userResponse.json()
        setUser(userData)
        setNewRole(userData.role)
        
        // Fetch borrow history
        const borrowsResponse = await fetch(`/api/dashboard/users/${userId}/borrows`)
        
        if (!borrowsResponse.ok) {
          if (borrowsResponse.status !== 403) {
            throw new Error("Failed to fetch borrow history")
          }
        } else {
          const borrowsData = await borrowsResponse.json()
          setBorrowHistory(borrowsData)
          
          // Calculate stats
          const active = borrowsData.filter((b: BorrowHistory) => b.returnedAt === null).length
          const overdue = borrowsData.filter((b: BorrowHistory) => b.returnedAt === null && new Date(b.dueDate) < new Date()).length
          const returned = borrowsData.filter((b: BorrowHistory) => 
            b.returnedAt !== null && new Date(b.dueDate) >= new Date(b.returnedAt)
          ).length
          
          setStats({
            totalBorrows: borrowsData.length,
            activeLoans: active,
            overdueLoans: overdue,
            returnedOnTime: returned
          })
        }
        
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load user data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUserData()
  }, [userId, toast])

  const handleUpdateRole = async () => {
    if (!userId) return

    try {
      const response = await fetch(`/api/dashboard/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("You don't have permission to update this user's role")
        }
        throw new Error(await response.text())
      }

      // Update local state
      if (user) {
        setUser({
          ...user,
          role: newRole as "STUDENT" | "LIBRARIAN"
        })
      }
      
      setEditRoleOpen(false)
      
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

  if (isLoading || !userId) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-6">You dont have permission to view this users information.</p>
        <Button asChild>
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <Button asChild>
          <Link href="/dashboard/users">Return to Users List</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="mr-4"
            asChild
          >
            <Link href="/dashboard/users">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">User Profile</h1>
        </div>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href={`/dashboard/users/${userId}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit User
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="md:flex md:h-[600px] ">
          <div className="md:w-1/3 lg:w-1/4 bg-gray-50 dark:bg-gray-900 p-6 flex flex-col items-center justify-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-center">{user.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-2">{user.email}</p>
            <div className="flex items-center justify-center mb-4">
              <Badge
                variant={user.role === "LIBRARIAN" ? "default" : "secondary"}
                className="flex items-center gap-1"
              >
                {user.role === "LIBRARIAN" ? (
                  <Shield className="h-3 w-3" />
                ) : (
                  <BookOpen className="h-3 w-3" />
                )}
                {user.role}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 h-6 px-2"
                onClick={() => setEditRoleOpen(true)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-center space-y-2 w-full">
              <div className="text-sm flex items-center justify-center">
                <BadgeCheck className={`h-4 w-4 mr-1 ${user.emailVerified ? "text-green-500" : "text-gray-400"}`} />
                <span>{user.emailVerified ? "Email Verified" : "Email Not Verified"}</span>
              </div>
              
              {user.educationYear && (
                <div className="text-sm flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 mr-1 text-gray-400" />
                  <span>Year {user.educationYear}</span>
                </div>
              )}
              
              {user.nfcCardId && (
                <div className="text-sm flex items-center justify-center">
                  <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                  <span>NFC Card: {user.nfcCardId}</span>
                </div>
              )}
              
              <div className="text-sm flex items-center justify-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                <span>Joined {format(new Date(user.createdAt), "MMMM d, yyyy")}</span>
              </div>
              
              <div className="text-sm flex items-center justify-center text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                <span>Last updated: {format(new Date(user.updatedAt), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 md:w-2/3 lg:w-3/4 overflow-y-scroll">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="borrowHistory">Borrow History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="text-2xl font-bold">{stats.totalBorrows}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Borrows</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="text-2xl font-bold">{stats.activeLoans}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Active Loans</div>
                  </div>
                  <div className={`p-4 rounded-lg ${stats.overdueLoans > 0 ? "bg-red-50 dark:bg-red-900/20" : "bg-gray-50 dark:bg-gray-900"}`}>
                    <div className={`text-2xl font-bold ${stats.overdueLoans > 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                      {stats.overdueLoans}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Overdue Loans</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="text-2xl font-bold">{stats.returnedOnTime}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Returned On Time</div>
                  </div>
                </div>
                
                {stats.activeLoans > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Active Loans</h3>
                    <div className="space-y-3">
                      {borrowHistory
                        .filter(borrow => borrow.returnedAt === null)
                        .map(borrow => {
                          const bookIsOverdue = isOverdue(borrow);
                          return (
                            <div 
                              key={borrow.id} 
                              className={`flex items-center border p-3 rounded-lg ${bookIsOverdue ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-700"}`}
                            >
                              <div className="flex-shrink-0 mr-3">
                                {borrow.book.coverImage ? (
                                  <Image
                                    src={borrow.book.coverImage}
                                    alt={borrow.book.title}
                                    width={64}
                                    height={96}
                                    className="h-16 w-auto object-cover"
                                  />
                                ) : (
                                  <Book className="h-16 w-16 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-grow">
                                <Link 
                                  href={`/dashboard/books/${borrow.bookId}`}
                                  className="font-medium hover:underline"
                                >
                                  {borrow.book.title}
                                </Link>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{borrow.book.author}</p>
                                <div className="flex items-center text-sm mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span className={bookIsOverdue ? "text-red-600 dark:text-red-400" : ""}>
                                    Due: {format(new Date(borrow.dueDate), "MMM d, yyyy")}
                                  </span>
                                  {bookIsOverdue && (
                                    <Badge variant="destructive" className="ml-2 px-1">
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Overdue
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="flex-shrink-0 ml-4"
                              >
                                <Link href={`/dashboard/books/${borrow.bookId}`}>
                                  <Book className="h-4 w-4 mr-1" />
                                  View Book
                                </Link>
                              </Button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="borrowHistory">
                {borrowHistory.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Book</TableHead>
                        <TableHead>Borrowed Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {borrowHistory.map((borrow) => {
                        const bookIsOverdue = isOverdue(borrow);
                        return (
                          <TableRow key={borrow.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                {borrow.book.coverImage ? (
                                  <Image
                                    src={borrow.book.coverImage}
                                    alt={borrow.book.title}
                                    width={40}
                                    height={60}
                                    className="w-10 h-auto object-cover"
                                  />
                                ) : (
                                  <Book className="w-10 h-10 text-gray-400" />
                                )}
                                <div>
                                  <div className="font-medium">
                                    {borrow.book.title}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {borrow.book.author}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(new Date(borrow.borrowedAt), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              {format(new Date(borrow.dueDate), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              {borrow.returnedAt ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Returned on {format(new Date(borrow.returnedAt), "MMM d, yyyy")}
                                </Badge>
                              ) : bookIsOverdue ? (
                                <Badge variant="destructive">Overdue</Badge>
                              ) : (
                                <Badge>Active</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <Link href={`/dashboard/books/${borrow.bookId}`}>
                                  View Book
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No borrow history found.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Dialog open={editRoleOpen} onOpenChange={setEditRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="LIBRARIAN">Librarian</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRoleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}