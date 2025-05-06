"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Save, User, Mail, Trash2, AlertTriangle, CreditCard, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PageProps {
  params: Promise<{ userid: string }>
}

interface User {
  id: string
  name: string
  email: string
  role: "STUDENT" | "LIBRARIAN"
  emailVerified: Date | null
  image: string | null
  nfcCardId: string | null
  educationYear: "1CP" | "2CP" | "1CS" | "2CS" | "3CS" | null
  createdAt: Date
  updatedAt: Date
}

export default function UserEditPage({ params }: PageProps) {
  const { toast } = useToast()
  const [userId, setUserId] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isCurrentUser, setIsCurrentUser] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "STUDENT" as "STUDENT" | "LIBRARIAN",
    nfcCardId: null as string | null,
    educationYear: null as "1CP" | "2CP" | "1CS" | "2CS" | "3CS" | null
  })
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
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
        
        // Check current user (to detect if editing self)
        const sessionResponse = await fetch('/api/auth/session')
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json()
          if (sessionData?.user?.id === userId) {
            setIsCurrentUser(true)
          }
        }
        
        // Fetch user data using the proper API endpoint
        const userResponse = await fetch(`/api/dashboard/users/${userId}`)
        if (!userResponse.ok) {
          if (userResponse.status === 403) {
            toast({
              title: "Access Denied",
              description: "You don't have permission to edit this user",
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
        
        // Set form data
        setFormData({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          nfcCardId: userData.nfcCardId,
          educationYear: userData.educationYear
        })
        
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value as "STUDENT" | "LIBRARIAN" }))
  }

  const handleNfcCardIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData(prev => ({ ...prev, nfcCardId: value === "" ? null : value }))
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    try {
      setIsSaving(true)
      
      // Updated to use the API route provided
      const response = await fetch(`/api/dashboard/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("You don't have permission to update this user")
        }
        throw new Error(await response.text())
      }

      toast({
        title: "Success",
        description: "User information updated successfully",
      })
      
      
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user information",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!userId) return

    try {
      // Use the DELETE method from the API route provided
      const response = await fetch(`/api/dashboard/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        if (response.status === 400 && await response.text() === "Cannot delete your own account") {
          throw new Error("You cannot delete your own account. Please contact an administrator.")
        }
        if (response.status === 403) {
          throw new Error("You don't have permission to delete this user")
        }
        throw new Error(await response.text())
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      })
      
      // Redirect to users list
      window.location.href = "/dashboard/users"
      
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      })
      setIsDeleteDialogOpen(false)
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
        <p className="mb-6">You dont have permission to edit this user.</p>
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
            <Link href={`/dashboard/users/${userId}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit User</h1>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Update user details and permissions
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-500 dark:text-gray-400">Profile Image</span>
                {/* Note: Image upload functionality would require additional components */}
              </div>
              
                <div className="w-full space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-9"
                    placeholder="Full Name"
                    />
                  </div>
                  </div>
                  
                  <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-9"
                    placeholder="Email Address"
                    />
                  </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <Select
                  value={formData.role}
                  onValueChange={handleRoleChange}
                  >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="LIBRARIAN">Librarian</SelectItem>
                  </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.role === "LIBRARIAN" 
                    ? "Librarians have full access to manage books, loans, and users." 
                    : "Students can browse books and manage their loans."
                  }
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                  <Label htmlFor="nfcCardId">NFC Card ID</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                    id="nfcCardId"
                    name="nfcCardId"
                    value={formData.nfcCardId || ""}
                    onChange={handleNfcCardIdChange}
                    className="pl-9"
                    placeholder="NFC Card ID (optional)"
                    />
                  </div>
                  </div>
                  
                  {formData.role === "STUDENT" && (
                  <div className="space-y-2">
                    <Label htmlFor="educationYear">Education Year</Label>
                    <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                    <Select
                      value={formData.educationYear || ""}
                      onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      educationYear: value as "1CP" | "2CP" | "1CS" | "2CS" | "3CS" | null
                      }))}
                    >
                      <SelectTrigger id="educationYear" className="pl-9">
                      <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="1CP">1CP</SelectItem>
                      <SelectItem value="2CP">2CP</SelectItem>
                      <SelectItem value="1CS">1CS</SelectItem>
                      <SelectItem value="2CS">2CS</SelectItem>
                      <SelectItem value="3CS">3CS</SelectItem>
                      </SelectContent>
                    </Select>
                    </div>
                  </div>
                  )}
                </div>
                </div>
            </div>

            {isCurrentUser && (
              <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Warning
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <p>
                        You are editing your own account. Some changes may affect your access privileges.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  type="button"
                  disabled={isCurrentUser}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the user
                    account and remove all associated data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteUser}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}