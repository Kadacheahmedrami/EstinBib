'use client'

import { useState, useEffect, FormEvent, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Camera, Check, BookOpen, Info, Hash, Trash2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

interface Category {
  id: string
  name: string
}

interface BookCategory {
  id: string
  name: string
}

interface BookData {
  id: string
  title: string
  author: string
  isbn: string | null
  barcode: string | null
  description: string
  coverImage: string
  pdfUrl: string | null
  size: number
  available: boolean
  publishedAt: string
  language: string
  type: 'BOOK' | 'DOCUMENT' | 'PERIODIC' | 'ARTICLE'
  periodicalFrequency: string | null
  periodicalIssue: string | null
  articleJournal: string | null
  documentType: string | null
  categories: BookCategory[]
}

interface EditBookPageProps {
  params: Promise<{ id: string }>
}

export default function EditBookPage({ params }: EditBookPageProps) {
  const router = useRouter()
  const [bookId, setBookId] = useState<string>('')
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<Partial<BookData>>({
    title: '', author: '', isbn: '', barcode: '', description: '', coverImage: '', 
    pdfUrl: '', size: 0, available: true, publishedAt: '', language: '', 
    type: 'BOOK', periodicalFrequency: '', periodicalIssue: '', articleJournal: '', 
    documentType: '', categories: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('details')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Resolve the Promise params to get the ID
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params
        setBookId(resolvedParams.id)
      } catch (err) {
        console.error("Error resolving params:", err)
        setError("Could not load book ID")
        setLoading(false)
      }
    }
    
    resolveParams()
  }, [params])

  // Load data once we have the book ID
  useEffect(() => {
    if (!bookId) return

    Promise.all([
      fetch('/api/dashboard/categories').then(r => r.json()),
      fetch(`/api/dashboard/books/${bookId}`).then(r => r.json())
    ]).then(([cats, data]) => {
      setCategories(cats)
      
      const book = data.book
      setForm({
        ...book,
        publishedAt: book.publishedAt.split('T')[0],
        categories: book.categories || []
      })
    }).catch(err => {
      console.error(err)
      setError('Failed to load data')
    }).finally(() => setLoading(false))
  }, [bookId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? Number(value) : value 
    }))
  }

  const handleSwitchChange = (name: string, value: boolean) => {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCategory = (value: string) => {
    if (value === 'none') {
      setForm(prev => ({ ...prev, categories: [] }))
    } else {
      const selectedCategory = categories.find(cat => cat.id === value)
      if (selectedCategory) {
        setForm(prev => ({ 
          ...prev, 
          categories: [{ id: selectedCategory.id, name: selectedCategory.name }] 
        }))
      }
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
  
    // Reset errors
    setImageError(null)
    setUploadingImage(true)
  
    // Prepare form data for upload
    const formData = new FormData()
    formData.append('file', file)
  
    try {
      // Upload to your custom API route
      const response = await fetch(`/api/dashboard/books/${bookId}/upload`, {
        method: 'POST',
        body: formData
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }
  
      const data = await response.json()
      
      // Update form with new image URL from your API response
      setForm(prev => ({ ...prev, coverImage: data.coverImage }))
      toast({
        title: "Image uploaded successfully",
        description: "Your book cover has been updated.",
        variant: "default"
      })
    } catch (err) {
      console.error('Error uploading image:', err)
      setImageError(err instanceof Error ? err.message : 'Failed to upload image. Please try again.')
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your image.",
        variant: "destructive"
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    
    try {
      const payload = {
        ...form,
        size: Number(form.size),
        categories: form.categories?.length ? form.categories : []
      }
      
      const res = await fetch(`/api/dashboard/books/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update book')
      }
      
      toast({
        title: "Book updated",
        description: "Your book has been updated successfully.",
        variant: "default"
      })
      
      router.push('/dashboard/books')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      toast({
        title: "Update failed",
        description: "There was a problem updating the book.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      const res = await fetch(`/api/dashboard/books/${bookId}`, {
        method: 'DELETE'
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to delete book')
      }
      
      toast({
        title: "Book deleted",
        description: "The book has been deleted successfully.",
        variant: "default"
      })
      
      router.push('/dashboard/books')
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "There was a problem deleting the book.",
        variant: "destructive"
      })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading book details...</p>
      </div>
    )
  }

  // Get current category id or 'none' if there isn't one
  const currentCategoryId = form.categories?.length ? form.categories[0].id : 'none'

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Book</h1>
        <div className="flex gap-2">
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/books')}
          >
            Cancel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* Left column - Cover Image */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-[2/3] w-full bg-muted">
                {form.coverImage ? (
                  <Image
                    src={form.coverImage}
                    alt={form.title || 'Book cover'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <BookOpen className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
                
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handleImageClick}
                >
                  {uploadingImage ? (
                    <Loader2 className="h-10 w-10 animate-spin text-white" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Camera className="h-10 w-10 text-white" />
                      <span className="mt-2 text-white font-medium">Change Cover</span>
                    </div>
                  )}
                </div>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
              
              {imageError && (
                <p className="text-sm text-red-500 p-4">{imageError}</p>
              )}
              
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{form.title || 'Book Title'}</h3>
                <p className="text-muted-foreground">{form.author || 'Author'}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <span className="text-sm font-medium">Available</span>
                  <Switch
                    checked={form.available}
                    onCheckedChange={(checked) => handleSwitchChange('available', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Book Details Form */}
        <div className="md:col-span-3 lg:col-span-4">
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="details">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>Details</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="description">
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      <span>Description</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="metadata">
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 mr-2" />
                      <span>Metadata</span>
                    </div>
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit}>
                  <TabsContent value="details" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title" 
                        name="title" 
                        placeholder="Book Title" 
                        value={form.title || ''} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="author">Author</Label>
                      <Input 
                        id="author" 
                        name="author" 
                        placeholder="Author Name" 
                        value={form.author || ''} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="isbn">ISBN</Label>
                        <Input 
                          id="isbn" 
                          name="isbn" 
                          placeholder="ISBN (optional)" 
                          value={form.isbn || ''} 
                          onChange={handleChange} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="barcode">Barcode</Label>
                        <Input 
                          id="barcode" 
                          name="barcode" 
                          placeholder="Barcode (optional)" 
                          value={form.barcode || ''} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select 
                          value={form.type} 
                          onValueChange={(value) => handleSelectChange('type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BOOK">Book</SelectItem>
                            <SelectItem value="DOCUMENT">Document</SelectItem>
                            <SelectItem value="PERIODIC">Periodic</SelectItem>
                            <SelectItem value="ARTICLE">Article</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={currentCategoryId} onValueChange={handleCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {categories.map(cat => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Conditional fields based on type */}
                    {form.type === 'PERIODIC' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="periodicalFrequency">Frequency</Label>
                          <Input 
                            id="periodicalFrequency" 
                            name="periodicalFrequency" 
                            placeholder="e.g., Monthly, Weekly" 
                            value={form.periodicalFrequency || ''} 
                            onChange={handleChange} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="periodicalIssue">Issue</Label>
                          <Input 
                            id="periodicalIssue" 
                            name="periodicalIssue" 
                            placeholder="Issue number/name" 
                            value={form.periodicalIssue || ''} 
                            onChange={handleChange} 
                          />
                        </div>
                      </div>
                    )}

                    {form.type === 'ARTICLE' && (
                      <div className="space-y-2">
                        <Label htmlFor="articleJournal">Journal</Label>
                        <Input 
                          id="articleJournal" 
                          name="articleJournal" 
                          placeholder="Journal name" 
                          value={form.articleJournal || ''} 
                          onChange={handleChange} 
                        />
                      </div>
                    )}

                    {form.type === 'DOCUMENT' && (
                      <div className="space-y-2">
                        <Label htmlFor="documentType">Document Type</Label>
                        <Input 
                          id="documentType" 
                          name="documentType" 
                          placeholder="e.g., Report, Thesis, Manual" 
                          value={form.documentType || ''} 
                          onChange={handleChange} 
                        />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="description" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        placeholder="Book Description" 
                        value={form.description || ''} 
                        onChange={handleChange} 
                        required 
                        className="min-h-[200px]" 
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="metadata" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="coverImage">Cover Image URL</Label>
                      <Input 
                        id="coverImage" 
                        name="coverImage" 
                        placeholder="Cover Image URL" 
                        value={form.coverImage || ''} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pdfUrl">PDF URL</Label>
                      <Input 
                        id="pdfUrl" 
                        name="pdfUrl" 
                        placeholder="PDF URL (optional)" 
                        value={form.pdfUrl || ''} 
                        onChange={handleChange} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="size">Page Count</Label>
                        <Input 
                          id="size" 
                          name="size" 
                          type="number" 
                          placeholder="Number of Pages" 
                          value={form.size || ''} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Input 
                          id="language" 
                          name="language" 
                          placeholder="Language" 
                          value={form.language || ''} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="publishedAt">Published Date</Label>
                      <Input 
                        id="publishedAt" 
                        name="publishedAt" 
                        type="date" 
                        placeholder="Published Date" 
                        value={form.publishedAt || ''} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </TabsContent>

                  <Separator className="my-6" />

                  <div className="flex justify-between items-center pt-4">
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="flex space-x-2 ml-auto">
                      <Button 
                        type="submit" 
                        disabled={saving || uploadingImage}
                        className="min-w-[120px]"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}