// hooks/useCategories.ts
import { useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
}

interface CategoriesResponse {
  success: boolean
  data: Category[]
  count: number
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: CategoriesResponse = await response.json()
      
      if (data.success) {
        setCategories(data.data)
      } else {
        throw new Error(data.error || 'Failed to load categories')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching categories')
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const refetch = () => {
    fetchCategories()
  }

  const addCategory = async (name: string): Promise<{ success: boolean; error?: string; data?: Category }> => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Refresh categories list
        await fetchCategories()
        return { success: true, data: result.data }
      } else {
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add category'
      return { success: false, error: errorMessage }
    }
  }

  return { 
    categories, 
    loading, 
    error, 
    refetch,
    addCategory
  }
}