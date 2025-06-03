// hooks/useFilterData.ts
import { useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
}

interface FilterDataResponse {
  success: boolean
  data: {
    categories: Category[]
    languages: string[]
    documentTypes: string[]
    bookTypes: string[]
    periodicTypes: string[]
    sizeRanges: Array<{
      label: string
      min: number
      max: number | null
    }>
    availability: string[]
  }
  error?: string
}

export const useFilterData = () => {
  const [filterData, setFilterData] = useState<FilterDataResponse['data'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFilterData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/filter-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: FilterDataResponse = await response.json()
      
      if (data.success) {
        setFilterData(data.data)
      } else {
        throw new Error(data.error || 'Failed to load filter data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching filter data')
      console.error('Error fetching filter data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFilterData()
  }, [])

  const refetch = () => {
    fetchFilterData()
  }

  return { 
    filterData, 
    loading, 
    error, 
    refetch
  }
}