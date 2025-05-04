"use client"

import { useState, useEffect, useCallback } from "react"
import { Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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

interface Idea {
  id: string
  user: User
  idea: string
  createdAt: string
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([])
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("all")
  const { toast } = useToast()
  
  const loadIdeas = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard/ideas")
      if (!response.ok) {
        throw new Error(await response.text())
      }
      
      const data = await response.json()
      setIdeas(data)
      setFilteredIdeas(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load ideas",
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
      
      const url = `/api/dashboard/ideas${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(await response.text())
      }
      
      const data = await response.json()
      setIdeas(data)
      setFilteredIdeas(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to search ideas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, searchType, toast]) // Removed filteredIdeas since it's not actually used in the function

  useEffect(() => {
    loadIdeas()
  }, [loadIdeas])

  const handleDeleteIdea = async (id: string) => {
    if (!confirm("Are you sure you want to delete this idea?")) return

    try {
      const response = await fetch(`/api/ideas/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      await loadIdeas()
      toast({
        title: "Success",
        description: "Idea deleted successfully",
      })
    } catch (error) {
      console.log(filteredIdeas)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete idea",
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
        <h1 className="text-2xl font-bold">Ideas Box</h1>
      </div>

      {/* Search functionality */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search ideas..."
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
              <SelectItem value="name">Student Name</SelectItem>
              <SelectItem value="email">Student Email</SelectItem>
              <SelectItem value="idea">Idea Content</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSearch} className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
        <Button variant="outline" onClick={loadIdeas}>
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea) => (
          <Card key={idea.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span>{idea.user.name}</span>
                  <CardDescription>{idea.user.email}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteIdea(idea.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                {new Date(idea.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{idea.idea}</p>
            </CardContent>
          </Card>
        ))}
        {ideas.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No ideas found
          </div>
        )}
      </div>

      {selectedIdea && (
        <Dialog open={true} onOpenChange={() => setSelectedIdea(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Idea Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{selectedIdea.user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedIdea.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="whitespace-pre-wrap">{selectedIdea.idea}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}