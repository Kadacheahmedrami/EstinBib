"use client"

import { useState, useEffect } from "react"
import { Trash2, MessageSquare } from "lucide-react"
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
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

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

interface Comment {
  id: string
  user: User
  content: string
  createdAt: string
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)
  const [newComment, setNewComment] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadIdeas()
  }, [])

  const loadIdeas = async () => {
    try {
      const response = await fetch("/api/dashboard/ideas")
      const data = await response.json()
      setIdeas(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load ideas",
        variant: "destructive",
      })
    }
  }

  const handleDeleteIdea = async (id: string) => {
    try {
      const response = await fetch(`/api/ideas/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        loadIdeas()
        toast({
          title: "Success",
          description: "Idea deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete idea",
        variant: "destructive",
      })
    }
  }


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ideas Box</h1>
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
      </div>

      {selectedIdea && (
        <Dialog open={true} onOpenChange={() => setSelectedIdea(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Comments</DialogTitle>
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