"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface Category {
  id: string
  name: string
  bookCount: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/dashboard/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/dashboard/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory.trim() }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      setNewCategory("")
      await loadCategories()
      toast({
        title: "Success",
        description: "Category added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add category",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateCategory = async (id: string, name: string) => {
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/dashboard/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      setEditingCategory(null)
      await loadCategories()
      toast({
        title: "Success",
        description: "Category updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/dashboard/categories/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      await loadCategories()
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={isSubmitting}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button 
                onClick={handleAddCategory}
                disabled={isSubmitting || !newCategory.trim()}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Books Count</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.bookCount}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingCategory(category)}
                    disabled={isSubmitting}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No categories found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {editingCategory && (
        <Dialog open={true} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Category name"
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, name: e.target.value })
                }
              />
              <Button
                onClick={() =>
                  handleUpdateCategory(editingCategory.id, editingCategory.name)
                }
                disabled={isSubmitting || !editingCategory.name.trim()}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Pencil className="h-4 w-4 mr-2" />
                )}
                Update Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 