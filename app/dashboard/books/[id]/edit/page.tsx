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
import { Loader2,  Camera, Check, BookOpen, Info, Hash } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface Category {
  id: string
  name: string
}

interface BookData {
  title: string
  author: string
  isbn: string | null
  description: string
  coverImage: string
  size: number
  publishedAt: string
  language: string
  categories: { id: string }[]
}

interface EditBookPageProps {
  params: Promise<{ id: string }>
}

export default function EditBookPage({ params }: EditBookPageProps) {
  const router = useRouter()
  const [bookId, setBookId] = useState<string>('')
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<BookData>({
    title: '', author: '', isbn: '', description: '', coverImage: '', size: 0,
    publishedAt: '', language: '', categories: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
      fetch(`/api/books/${bookId}`).then(r => r.json())
    ]).then(([cats, data]) => {
      // Extract the book from the API response structure
      const book = data.book[0]
      
      setCategories(cats)
      setForm({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: book.description,
        coverImage: book.coverImage,
        size: book.size,
        publishedAt: book.publishedAt.split('T')[0],
        language: book.language,
        categories: book.categories || []
      })
    }).catch(err => {
      console.error(err)
      setError('Failed to load data')
    }).finally(() => setLoading(false))
  }, [bookId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === 'size' ? Number(value) : value }))
  }

  const handleCategory = (value: string) => {
    // 'none' means clear categories
    setForm(prev => ({ ...prev, categories: value === 'none' ? [] : [{ id: value }] }))
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
    formData.append('upload_preset', 'library_covers') // Replace with your Cloudinary upload preset

    try {
      // Upload to Cloudinary
      const response = await fetch('https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      
      // Update form with new image URL
      setForm(prev => ({ ...prev, coverImage: data.secure_url }))
      toast({
        title: "Image uploaded successfully",
        description: "Your book cover has been updated.",
        variant: "default"
      })
    } catch (err) {
      console.error('Error uploading image:', err)
      setImageError('Failed to upload image. Please try again.')
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
      const payload: Omit<BookData, 'size'> & { size: number } = { ...form, size: Number(form.size) }
      // If categories is empty, we'll exclude it from the payload
      if (form.categories.length === 0) {
        delete (payload as Partial<typeof payload>).categories
      }
      
      const res = await fetch(`/api/books/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) throw new Error('Failed to update book')
      
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading book details...</p>
      </div>
    )
  }

  // Get current category id or 'none' if there isn't one
  const currentCategoryId = form.categories.length > 0 ? form.categories[0].id : 'none'

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Book</h1>
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard/books')}
        >
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Cover Image */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-[2/3] w-full bg-muted">
                {form.coverImage ? (
                  <Image
                    src={form.coverImage}
                    alt={form.title}
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Book Details Form */}
        <div className="lg:col-span-2">
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
                      <Input id="title" name="title" placeholder="Book Title" value={form.title} onChange={handleChange} required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="author">Author</Label>
                      <Input id="author" name="author" placeholder="Author Name" value={form.author} onChange={handleChange} required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="isbn">ISBN</Label>
                      <Input id="isbn" name="isbn" placeholder="ISBN (optional)" value={form.isbn || ''} onChange={handleChange} />
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
                  </TabsContent>

                  <TabsContent value="description" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        placeholder="Book Description" 
                        value={form.description} 
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
                        value={form.coverImage} 
                        onChange={handleChange} 
                        required 
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
                          value={form.size} 
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
                          value={form.language} 
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
                        value={form.publishedAt} 
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