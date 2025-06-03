"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, ChevronLeft, ChevronRight } from "lucide-react"
import SearchBar from "@/components/SearchBar"
import FilterSidebar from "@/components/FilterSidebAr"
import BookCard from "@/components/pages/catalogue/BookCard"
import type { FilterState, Book } from "@/types/_types"

// Extended FilterState to include pagination and sorting
interface ExtendedFilterState extends FilterState {
  type?: string[] // Maps to your API's type field
  periodicalFrequency?: string[] // Maps to your API's periodicalFrequency field
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}
import debounce from "lodash.debounce"

interface NoResultsMessageProps {
  title: string
  subtitle?: string
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface SearchResponse {
  books: Book[]
  pagination: PaginationInfo
  filters: {
    appliedFilters: Record<string, string | string[] | number | boolean>
    resultsCount: number
  }
}

const NoResultsMessage = ({ title, subtitle }: NoResultsMessageProps) => (
  <div className="flex flex-col justify-center items-center h-screen text-center p-4">
    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">{title}</h2>
    {subtitle && <p className="text-lg md:text-xl text-gray-500">{subtitle}</p>}
  </div>
)

const Pagination = ({ 
  pagination, 
  onPageChange 
}: { 
  pagination: PaginationInfo
  onPageChange: (page: number) => void 
}) => {
  const { currentPage, totalPages, totalItems, hasNextPage, hasPrevPage } = pagination

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const delta = 2 // Number of pages to show on each side of current page
    
    // Always show first page
    pages.push(1)
    
    // Add pages around current page
    const start = Math.max(2, currentPage - delta)
    const end = Math.min(totalPages - 1, currentPage + delta)
    
    // Add ellipsis if needed
    if (start > 2) {
      pages.push('...')
    }
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Add ellipsis if needed
    if (end < totalPages - 1) {
      pages.push('...')
    }
    
    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages)
    }
    
    return pages.filter((page, index, array) => 
      array.indexOf(page) === index // Remove duplicates
    )
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex flex-col items-center space-y-4 py-8">
      <div className="text-gray-600 text-sm">
        Showing {((currentPage - 1) * pagination.itemsPerPage) + 1}-{Math.min(currentPage * pagination.itemsPerPage, totalItems)} of {totalItems} results
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
              disabled={page === '...'}
              className={`px-3 py-2 text-sm font-medium rounded-lg ${
                page === currentPage
                  ? 'bg-[#F1413E] text-white'
                  : page === '...'
                  ? 'text-gray-400 cursor-default'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  )
}

export default function Catalogue() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isInitialMount = useRef(true)

  // Search state
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "")
  const [isSticky, setIsSticky] = useState(false)
  const searchBarRef = useRef<HTMLDivElement>(null)

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false
  })

  // Filter parameters - Extended to include pagination and sorting
  const [filters, setFilters] = useState<ExtendedFilterState>(() => ({
    // Existing FilterState properties
    schoolYear: searchParams.get("schoolYear")?.split(",") || [],
    size: searchParams.get("size") || "",
    categories: searchParams.get("categories")?.split("+") || [],
    availability: searchParams.get("available") || "",
    documentType: searchParams.get("documentType")?.split(",") || [], // Keep existing field
    language: searchParams.get("language")?.split(",") || [],
    periodicType: searchParams.get("periodicType")?.split(",") || [], // Keep existing field
    q: searchParams.get("q") || "",
    // New properties for API compatibility
    type: searchParams.get("type")?.split(",") || [],
    periodicalFrequency: searchParams.get("periodicalFrequency")?.split(",") || [],
    // Pagination
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "20"),
    sortBy: searchParams.get("sortBy") || "relevance",
    sortOrder: searchParams.get("sortOrder") || "desc"
  }))

  // Handle mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1044)
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle scroll for sticky search
  useEffect(() => {
    const handleScroll = () => {
      if (searchBarRef.current) {
        const searchBarTop = searchBarRef.current.getBoundingClientRect().top
        const headerHeight = 140

        setIsSticky(searchBarTop <= headerHeight && window.scrollY > 200)
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Create debounced search function
  const debouncedSearch = useMemo(() => {
    return debounce(async (params: Record<string, string | string[] | number>) => {
      try {
        setIsLoading(true);
        const queryString = new URLSearchParams(
          Object.entries(params).map(([key, value]) => {
            if (Array.isArray(value)) {
              return [key, key === "categories" ? value.join("+") : value.join(",")]
            }
            return [key, String(value)]
          })
        ).toString();

        const response = await fetch(`/api/search?${queryString}`);
        if (!response.ok) throw new Error("Failed to fetch books");
        
        const data: SearchResponse = await response.json();
        setBooks(data.books);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setBooks([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 20,
          hasNextPage: false,
          hasPrevPage: false
        });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, []);

  // Update URL parameters
  const updateUrlParams = useCallback(
    (params: Record<string, string | string[] | number>) => {
      const newParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
          return
        } else if (Array.isArray(value)) {
          newParams.set(key, key === "categories" ? value.join("+") : value.join(","))
        } else {
          newParams.set(key, String(value))
        }
      })
      router.replace(`?${newParams.toString()}`, { scroll: false })
    },
    [router],
  )

  // Handle search input changes
  const handleSearch = useCallback(
    (value: string) => {
      setSearchInput(value)
      setFilters((prev) => ({ ...prev, q: value, page: 1 })) // Reset to page 1 on new search
    },
    [],
  )

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(prev => ({ 
      ...prev, 
      ...newFilters, 
      // Map old field names to new API field names
      type: newFilters.documentType || [],
      periodicalFrequency: newFilters.periodicType || [],
      page: 1 
    }))
  }, [])

  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }))
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Handle sorting changes
  const handleSortChange = useCallback((sortBy: string, sortOrder: string) => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }))
  }, [])

  // Reset filters
  const handleResetFilters = useCallback(() => {
    const newFilters: ExtendedFilterState = {
      schoolYear: [],
      size: "",
      categories: [],
      availability: "",
      documentType: [],
      language: [],
      periodicType: [],
      q: searchInput,
      // API compatible fields
      type: [],
      periodicalFrequency: [],
      page: 1,
      limit: 20,
      sortBy: "relevance",
      sortOrder: "desc"
    }
    setFilters(newFilters)
    updateUrlParams({ q: searchInput })
    if (isMobile) {
      setIsFilterOpen(false)
    }
  }, [searchInput, updateUrlParams, isMobile])

  // Create a serialized version of filters for dependency tracking
  const filtersString = useMemo(() => {
    return JSON.stringify({
      q: filters.q,
      size: filters.size,
      availability: filters.availability,
      categories: filters.categories,
      schoolYear: filters.schoolYear,
      type: filters.type,
      documentType: filters.documentType,
      language: filters.language,
      periodicalFrequency: filters.periodicalFrequency,
      periodicType: filters.periodicType,
      page: filters.page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    })
  }, [
    filters.q,
    filters.size,
    filters.availability,
    filters.categories,
    filters.schoolYear,
    filters.type,
    filters.documentType,
    filters.language,
    filters.periodicalFrequency,
    filters.periodicType,
    filters.page,
    filters.limit,
    filters.sortBy,
    filters.sortOrder
  ])

  // Effect to perform search when filters change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const searchParameters: Record<string, string | string[] | number> = {}

    if (filters.q?.trim()) {
      searchParameters.q = filters.q
    }

    if (filters.size) {
      searchParameters.size = filters.size
        .replace(/\s+pages/g, "")
        .replace(/\s*-\s*/g, "-")
        .replace(/\s*\+\s*/g, "-")
    }

    if (filters.availability) {
      searchParameters.available = filters.availability === "Available" ? "true" : "false"
    }

    if (filters.categories?.length) {
      searchParameters.categories = filters.categories
    }

    if (filters.type?.length) {
      searchParameters.type = filters.type
    } else if (filters.documentType?.length) {
      // Fallback to documentType if type is not set
      searchParameters.type = filters.documentType
    }

    if (filters.language?.length) {
      searchParameters.language = filters.language
    }

    if (filters.periodicalFrequency?.length) {
      searchParameters.periodicalFrequency = filters.periodicalFrequency
    } else if (filters.periodicType?.length) {
      // Fallback to periodicType if periodicalFrequency is not set
      searchParameters.periodicalFrequency = filters.periodicType
    }

    // Add pagination and sorting parameters
    searchParameters.page = filters.page || 1
    searchParameters.limit = filters.limit || 20
    searchParameters.sortBy = filters.sortBy || "relevance"
    searchParameters.sortOrder = filters.sortOrder || "desc"

    updateUrlParams(searchParameters)
    debouncedSearch(searchParameters)
  }, [filtersString, debouncedSearch, updateUrlParams])

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  // Initial load
  useEffect(() => {
    const initialParams: Record<string, string | string[] | number> = {}
    if (filters.q) initialParams.q = filters.q
    if (filters.size) initialParams.size = filters.size
    if (filters.availability) initialParams.available = filters.availability === "Available" ? "true" : "false"
    if (filters.categories?.length) initialParams.categories = filters.categories
    if (filters.schoolYear?.length) initialParams.schoolYear = filters.schoolYear
    if (filters.type?.length) {
      initialParams.type = filters.type
    } else if (filters.documentType?.length) {
      initialParams.type = filters.documentType
    }
    if (filters.language?.length) initialParams.language = filters.language
    if (filters.periodicalFrequency?.length) {
      initialParams.periodicalFrequency = filters.periodicalFrequency
    } else if (filters.periodicType?.length) {
      initialParams.periodicalFrequency = filters.periodicType
    }
    
    // Add pagination and sorting
    initialParams.page = filters.page || 1
    initialParams.limit = filters.limit || 20
    initialParams.sortBy = filters.sortBy || "relevance"
    initialParams.sortOrder = filters.sortOrder || "desc"

    debouncedSearch(initialParams)
  }, [debouncedSearch, filtersString])

  return (
    <div className="w-screen mx-auto">
      {/* Search Bar */}
      <div
        ref={searchBarRef}
        className={`w-full transition-all duration-300 ${
            isSticky ? "fixed top-[70px] md:top-[100px] left-0 z-[2] py-4 " : "relative"
        }`}
        style={{
          width: "100%",
          paddingLeft: isSticky ? "20px" : "0",
          paddingRight: isSticky ? "20px" : "0",
        }}
      >
        <div className="flex w-[100%] px-4 justify-center items-start gap-4 flex-row">
          <SearchBar
            searchInput={searchInput}
            onSearchChange={setSearchInput}
            onSearch={handleSearch}
            isSticky={isSticky}
          />
          <div className="block lg:hidden">
            <button
              className={`flex border-solid bg-white border-[#F1413E] border-[2px] p-3 rounded-full mr-4 transition-all duration-300 ${
                isFilterOpen ? "bg-opacity-80" : ""
              }`}
              aria-label="Filter"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="w-7 h-7 text-[#F1413E]" />
            </button>
          </div>
        </div>
      </div>
      
      

      {/* Main Content */}
      <div className={`grid grid-cols-12 gap-5 ${isSticky ? "mt-52" : "mt-32 md:mt-36"} md:flex-row w-full`}>
        {/* Filter Sidebar */}
        <div className="col-span-0 relative bottom-4 lg:col-span-2">
          <FilterSidebar
            filters={{
              schoolYear: filters.schoolYear || [],
              size: filters.size || "",
              categories: filters.categories || [],
              availability: filters.availability || "",
              documentType: filters.documentType || [],
              language: filters.language || [],
              periodicType: filters.periodicType || [],
              q: filters.q || ""
            }}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            isFilterOpen={isFilterOpen}
            isMobile={isMobile}
            onCloseFilter={() => setIsFilterOpen(false)}
          />
        </div>

        {/* Results */}
        <div className="col-span-12 mt-8 md:mt-0 w-full lg:col-span-10">
          {/* Sort Options */}
          <div className="flex justify-between items-center mb-4 px-4">
            <div className="text-black">
              {pagination.totalItems > 0 && (
                <span>
                  {pagination.totalItems} result{pagination.totalItems !== 1 ? 's' : ''} found
                </span>
              )}
            </div>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-')
                handleSortChange(sortBy, sortOrder)
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F1413E]"
            >
              <option value="relevance-desc">Most Relevant</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="author-asc">Author (A-Z)</option>
              <option value="author-desc">Author (Z-A)</option>
              <option value="date-desc">Newest Published</option>
              <option value="date-asc">Oldest Published</option>
              <option value="added-desc">Recently Added</option>
              <option value="added-asc">Oldest Added</option>
              <option value="size-asc">Smallest Size</option>
              <option value="size-desc">Largest Size</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-xl font-medium text-gray-600">Loading results...</p>
            </div>
          ) : books.length === 0 ? (
            <NoResultsMessage
              title="No Books Found"
              subtitle="No books found matching your search criteria. Please try different keywords or filters."
            />
          ) : (
            <>
              <div className="container mx-auto px-10 justify-center">
                <div className="grid grid-cols-1 z-[0] sm:grid-cols-2 lg:grid-cols-5 gap-8 p-4">
                  {books.map((book, index) => (
                    <BookCard
                      key={book.id || index}
                      id={book.id}
                      title={book.title}
                      author={book.author}
                      description={book.description}
                      size={book.size}
                      available={book.available}
                      coverImage={book.coverImage}
                      publishedAt={book.publishedAt || new Date()}
                      addedAt={book.addedAt || null}
                      language={book.language || ""}
                      isbn={book.isbn}
                    />
                  ))}
                </div>
              </div>
              
              {/* Pagination */}
              <Pagination 
                pagination={pagination} 
                onPageChange={handlePageChange} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}