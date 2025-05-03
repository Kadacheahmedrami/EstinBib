'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, X, Book, AlertCircle } from 'lucide-react'
import Image from 'next/image'

interface Category {
  id: string
  name: string
}

interface BookFormData {
  title: string
  author: string
  isbn: string
  description: string
  coverImage: string
  size: string
  publishedAt: string
  language: string
  categories: string[]
  available: boolean
}

export default function AddBookPage() {
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    description: '',
    coverImage: '',
    size: '',
    publishedAt: '',
    language: '',
    categories: [],
    available: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian',
    'Chinese', 'Japanese', 'Russian', 'Arabic', 'Portuguese'
  ]

  useEffect(() => {
    setMounted(true)
    fetch('/api/dashboard/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleToggleCategory = (id: string) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter(cat => cat !== id)
        : [...prev.categories, id]
    }))
  }

  const handleAvailableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, available: e.target.checked }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'book_covers')
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload',
        { method: 'POST', body: formData }
      )
      const data = await response.json()
      if (data.secure_url) {
        setForm(prev => ({ ...prev, coverImage: data.secure_url }))
        setPreviewImage(data.secure_url)
      } else {
        throw new Error('Failed to upload image')
      }
    } catch {
      setError('Image upload failed. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setForm(prev => ({ ...prev, coverImage: '' }))
    setPreviewImage(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = {
        ...form,
        size: Number(form.size),
        available: form.available,
        categories: form.categories,
      }
      const res = await fetch('/api/dashboard/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Failed to add book')
      }
      router.push('/dashboard/books')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
  
      <div className="container mx-auto py-8 max-w-4xl">
        <Card className="border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="bg-slate-50 dark:bg-gray-800">
            <div className="flex items-center mb-2">
              <Book className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add New Book</CardTitle>
            </div>
            <CardDescription className="text-gray-700 dark:text-gray-300">
              Enter the details of the book you want to add
            </CardDescription>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-4">
              <TabsList className="grid grid-cols-2 w-full dark:bg-gray-800">
                <TabsTrigger value="basic" className="text-sm">Basic Info</TabsTrigger>
                <TabsTrigger value="details" className="text-sm">Details</TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="p-6 bg-white dark:bg-gray-800">
              <form onSubmit={handleSubmit}>

                <TabsContent value="basic" className="space-y-4 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Book Title</Label>
                      <Input
                                          className='dark:bg-gray-900'

                        id="title"
                        name="title"
                        placeholder="Enter book title"
                        value={form.title}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author">Author</Label>
                      <Input
                                          className='dark:bg-gray-900'

                        id="author"
                        name="author"
                        placeholder="Author name"
                        value={form.author}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="isbn">ISBN</Label>
                      <Input
                                          className='dark:bg-gray-900'

                        id="isbn"
                        name="isbn"
                        placeholder="ISBN (e.g., 978-3-16-148410-0)"
                        value={form.isbn}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="publishedAt">Publication Date</Label>
                      <Input
                                          className='dark:bg-gray-900'

                        id="publishedAt"
                        name="publishedAt"
                        type="date"
                        value={form.publishedAt}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Book description"
                      value={form.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(e)}
                      rows={4}
                      className="resize-none dark:bg-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex items-center gap-2 dark:bg-slate-800"
                          onClick={() => document.getElementById('coverImageInput')?.click()}
                          disabled={uploadingImage}
                        >
                          {uploadingImage ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
                              <span>Upload Image</span>
                            </>
                          )}
                        </Button>
                        <Input
                        
                          id="coverImageInput"
                          type="file"
                          accept="image/*"
                          className="hidden "
                          onChange={handleImageUpload}
                        />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Recommended size: 400 x 600px (JPG, PNG)
                        </span>
                      </div>
                      {previewImage && (
                        <div className="relative w-32 h-48 border rounded overflow-hidden">
                          <Image
                            src={previewImage}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                            width={128}
                            height={192}
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-1 right-1 p-1 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <X className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4 mt-0">
                  <div className="grid  grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 ">
                      <Label htmlFor="size">Page Count</Label>
                      <Input 
                      className='dark:bg-gray-900'
                        id="size"
                        name="size"
                        type="number"
                        placeholder="Number of pages"
                        min="1"
                        value={form.size}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2 ">
                      <Label htmlFor="language">Language</Label>
                      <Select value={form.language} onValueChange={lang => setForm(prev => ({ ...prev, language: lang }))}>
                        <SelectTrigger className='dark:bg-slate-800' id="language">
                          <SelectValue  placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent className=''>
                          {languages.map(lang => (
                            <SelectItem key={lang} value={lang.toLowerCase()}>{lang}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                    className='dark:bg-gray-900'
                      id="available"
                      name="available"
                      type="checkbox"
                      checked={form.available}
                      onChange={handleAvailableChange}
                    />
                    <Label htmlFor="available">Available for Borrow</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Categories</Label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <label key={cat.id} className="inline-flex  items-center gap-2">
                          <input
                                              className='dark:bg-gray-900'

                            type="checkbox"
                            checked={form.categories.includes(cat.id)}
                            onChange={() => handleToggleCategory(cat.id)}
                          />
                          <span className="text-gray-900 dark:text-gray-100">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {error && (
                  <Alert variant="destructive" className="mt-4 dark:bg-red-900">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-200">{error}</AlertDescription>
                  </Alert>
                )}

                <CardFooter className="flex justify-between pt-6 px-0 pb-0 bg-slate-50 dark:bg-gray-800">
                  <Button
                    type="button"
                    variant="outline"
                    className="dark:border-gray-600 dark:text-gray-200"
                    onClick={() => router.push('/dashboard/books')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={loading || uploadingImage}
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                        Adding Book...
                      </>
                    ) : (
                      <span className="text-white">Save Book</span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Tabs>
        </Card>
      </div>
 
  )
}
