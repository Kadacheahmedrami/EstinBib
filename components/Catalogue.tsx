"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef, memo, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, X } from "lucide-react"
import NeonCheckbox from "@/components/checkBox/checkbox"
import RadioButton from "@/components/radioInput/radiobutton"
import BookCard from "@/components/BookCard"
import type { FilterState, Book } from "@/types/_types"
import debounce from "lodash.debounce"

interface NoResultsMessageProps {
  title: string
  subtitle?: string
}

const NoResultsMessage = ({ title, subtitle }: NoResultsMessageProps) => (
  <div className="flex flex-col justify-center items-center h-screen text-center p-4">
    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">{title}</h2>
    {subtitle && <p className="text-lg md:text-xl text-gray-500">{subtitle}</p>}
  </div>
)

const KeywordItem = memo(
  ({
    keyword,
    onClick,
    onRemove,
  }: {
    keyword: string
    onClick: () => void
    onRemove: () => void
  }) => (
    <div className="bg-[#FCF3F3] text-black shadow rounded-full px-4 py-2 text-sm cursor-pointer hover:bg-[#e0e0e0] flex items-center gap-2 transition-all duration-200 ease-in-out transform hover:scale-105">
      <span onClick={onClick}>{keyword}</span>
      <span
        className="text-red-500 hover:text-red-700 transition-colors duration-200"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
      >
        X
      </span>
    </div>
  ),
)
KeywordItem.displayName = "KeywordItem"

const FilterSection = memo(({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-gray-700 uppercase tracking-wide">{title}:</h3>
    <div className="space-y-3">{children}</div>
  </div>
))
FilterSection.displayName = "FilterSection"

const CheckboxItem = memo(
  ({
    id,
    checked,
    onChange,
    label,
  }: {
    id: string
    checked: boolean
    onChange: (checked: boolean) => void
    label: string
  }) => (
    <div className="flex items-center group cursor-pointer">
      <NeonCheckbox id={id} checked={checked} onChange={onChange} />
      <label
        htmlFor={id}
        className="ml-3 text-base text-gray-600 group-hover:text-gray-900 transition-colors cursor-pointer"
      >
        {label}
      </label>
    </div>
  ),
)
CheckboxItem.displayName = "CheckboxItem"

const RadioItem = memo(
  ({
    id,
    checked,
    onChange,
    label,
    name,
  }: {
    id: string
    checked: boolean
    onChange: () => void
    label: string
    name: string
  }) => (
    <div className="flex items-center group cursor-pointer">
      <RadioButton id={id} checked={checked} onChange={onChange} name={name} value={label} label="" />
      <label
        htmlFor={id}
        className="ml-3 text-base text-gray-600 group-hover:text-gray-900 transition-colors cursor-pointer"
      >
        {label}
      </label>
    </div>
  ),
)
RadioItem.displayName = "RadioItem"

export default function Catalogue() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isInitialMount = useRef(true)

  // Search state
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "")
  const [previousKeywords, setPreviousKeywords] = useState<string[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchBarRef = useRef<HTMLDivElement>(null)

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Filter parameters
  const [filters, setFilters] = useState<FilterState>(() => ({
    schoolYear: searchParams.get("schoolYear")?.split(",") || [],
    size: searchParams.get("size") || "",
    categories: searchParams.get("categories")?.split("+") || [],
    availability: searchParams.get("available") || "",
    documentType: searchParams.get("documentType")?.split(",") || [],
    language: searchParams.get("language")?.split(",") || [],
    periodicType: searchParams.get("periodicType")?.split(",") || [],
    q: searchParams.get("q") || "",
  }))

  // Load previous keywords
  useEffect(() => {
    const storedKeywords = localStorage.getItem("searchKeywords")
    if (storedKeywords) {
      setPreviousKeywords(JSON.parse(storedKeywords))
    }
  }, [])

  // Save previous keywords
  useEffect(() => {
    localStorage.setItem("searchKeywords", JSON.stringify(previousKeywords))
  }, [previousKeywords])

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
        const headerHeight = 140 // Height of the fixed header

        // When the original position of the search bar is at or below the header,
        // we should unstick it
        setIsSticky(searchBarTop <= headerHeight && window.scrollY > 200)
      }
    }

    // Initial check
    handleScroll()

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Create debounced search function
// Move the debounce call outside of useCallback
const debouncedSearch = useMemo(() => {
  return debounce(async (params: Record<string, string | string[]>) => {
    try {
      setIsLoading(true);
      const queryString = new URLSearchParams(
        Object.entries(params).map(([key, value]) =>
          Array.isArray(value) ? [key, value.join("+")] : [key, String(value)],
        ),
      ).toString();

      const response = await fetch(`/api/search?${queryString}`);
      if (!response.ok) throw new Error("Failed to fetch books");
      const data = await response.json();
      setBooks(data.books);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  }, 500);
}, [setIsLoading, setBooks]);

  // Update URL parameters
  const updateUrlParams = useCallback(
    (params: Record<string, string | string[]>) => {
      const newParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
          return
        } else if (Array.isArray(value)) {
          newParams.set(key, key === "categories" ? value.join("+") : value.join(","))
        } else {
          newParams.set(key, value)
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
      if (value.trim() && !previousKeywords.includes(value.trim())) {
        setPreviousKeywords((prev) => [value.trim(), ...prev].slice(0, 5))
      }
      setFilters((prev) => ({ ...prev, q: value }))
    },
    [previousKeywords],
  )

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  // Reset filters
  const handleResetFilters = useCallback(() => {
    const newFilters = {
      schoolYear: [],
      size: "",
      categories: [],
      availability: "",
      documentType: [],
      language: [],
      periodicType: [],
      q: searchInput,
    }
    setFilters(newFilters)
    updateUrlParams({ q: searchInput })
    if (isMobile) {
      setIsFilterOpen(false)
    }
  }, [searchInput, updateUrlParams, isMobile])

  // Effect to perform search when filters change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const searchParameters: Record<string, string | string[]> = {}

    if (filters.q.trim()) {
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

    if (filters.categories.length) {
      searchParameters.categories = filters.categories
    }

    if (filters.schoolYear.length) {
      searchParameters.schoolYear = filters.schoolYear
    }

    if (filters.documentType.length) {
      searchParameters.documentType = filters.documentType
    }

    if (filters.language.length) {
      searchParameters.language = filters.language
    }

    if (filters.periodicType.length) {
      searchParameters.periodicType = filters.periodicType
    }

    updateUrlParams(searchParameters)
    debouncedSearch(searchParameters)
  }, [filters, debouncedSearch, updateUrlParams])

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  // Initial load
  useEffect(() => {
    const initialParams: Record<string, string | string[]> = {}
    if (filters.q) initialParams.q = filters.q
    if (filters.size) initialParams.size = filters.size
    if (filters.availability) initialParams.available = filters.availability === "Available" ? "true" : "false"
    if (filters.categories.length) initialParams.categories = filters.categories
    if (filters.schoolYear.length) initialParams.schoolYear = filters.schoolYear
    if (filters.documentType.length) initialParams.documentType = filters.documentType
    if (filters.language.length) initialParams.language = filters.language
    if (filters.periodicType.length) initialParams.periodicType = filters.periodicType

    debouncedSearch(initialParams)
  }, [
    debouncedSearch, 
    filters.q, 
    filters.size, 
    filters.availability, 
    filters.categories, 
    filters.schoolYear, 
    filters.documentType,
    filters.language,
    filters.periodicType
  ])

  // Function to toggle search suggestions visibility
  const toggleSearchSuggestions = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  return (
    <div className="w-screen mx-auto">
      {/* Search Bar */}
      <div
        ref={searchBarRef}
        className={`w-full transition-all duration-300 ${
          isSticky ? "fixed top-[70px] left-0 z-50 py-4 " : "relative"
        }`}
        style={{
          width: "100%",
          paddingLeft: isSticky ? "20px" : "0",
          paddingRight: isSticky ? "20px" : "0",
        }}
      >
        <div className="flex w-[100%] px-4 justify-center items-start gap-4 flex-row">
          <div className="flex flex-col mx-auto w-[80%] md:max-w-[800px]">
            <div
              className={`flex shadow items-center h-[57px] w-full bg-[#F8F7F7] rounded-[22px] p-3 transition-all duration-300 ${
                isSticky ? "shadow-lg" : ""
              }`}
            >
              <input
                ref={inputRef}
                value={searchInput}
                type="text"
                placeholder="Search a name, category, or a module"
                className="flex-1 bg-transparent outline-none px-4 text-sm placeholder-gray-500"
                onClick={() => {
                  setIsFocused(true);
                  toggleSearchSuggestions();
                }}
                onFocus={() => {
                  setIsFocused(true);
                  toggleSearchSuggestions();
                }}
                onBlur={(e) => {
                  const relatedTarget = e.relatedTarget as HTMLElement | null
                  if (!relatedTarget?.closest(".search-container")) {
                    setTimeout(() => {
                      setIsFocused(false);
                      setIsVisible(false);
                    }, 200)
                  }
                }}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    debouncedSearch.cancel()
                    handleSearch(searchInput)
                  }
                }}
              />

              <div
                onClick={() => handleSearch(searchInput)}
                className="flex items-center mr-2 gap-2 text-[#9B1616] cursor-pointer"
              >
                <Search className="w-5 h-5" />
                <span className="text-[16px] hidden md:block font-medium">Search</span>
              </div>
            </div>

            {/* Keywords */}
            <div className={`h-[100px] relative ${isSticky ? "mt-2" : ""}`}>
              <div
                className={`w-full bg-white rounded-[22px] bg-opacity-40 z-50 search-container absolute top-0 left-0 transition-all duration-300 ease-in-out ${
                  isVisible && isFocused && previousKeywords.length > 0
                    ? "opacity-100 transform translate-y-0 pointer-events-auto"
                    : "opacity-0 transform -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="flex flex-wrap gap-2 p-3">
                  {previousKeywords.map((keyword, index) => (
                    <KeywordItem
                      key={index}
                      keyword={keyword}
                      onClick={() => handleSearch(keyword)}
                      onRemove={() => setPreviousKeywords((prev) => prev.filter((k) => k !== keyword))}
                    />
                  ))}
                  {previousKeywords.length >= 2 && (
                    <div
                      className="bg-[#FCF3F3] text-black shadow rounded-full px-4 py-2 text-sm cursor-pointer hover:bg-[#e0e0e0] flex items-center gap-2 transition-all duration-200 ease-in-out transform hover:scale-105"
                      onClick={() => setPreviousKeywords([])}
                    >
                      <span>Delete All</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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
      <div className = {`h-[160px] w-full ${isSticky ? "" : "hidden"}`} >
            </div>
      {/* Main Content */}
      <div className={`grid grid-cols-12 gap-5 ${isSticky ? "mt-32" : "mt-24"} md:flex-row w-full`}>
        {/* Filter Sidebar */}
        <div className="col-span-0 relative bottom-4 lg:col-span-2">
          <div
            className={`z-[20] bg-[#F8F8F8] min-w-[240px] p-6 rounded-r-[15px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
              border border-gray-100 overflow-x-auto overflow-y-auto custom-scrollbar transition-transform duration-300 ${
                isMobile
                  ? isFilterOpen
                    ? "fixed inset-y-0 left-0 z-50 transform translate-x-0"
                    : "fixed inset-y-0 left-0 z-50 transform -translate-x-full"
                  : "sticky top-[100px] max-h-[calc(100vh-8rem)]"
              }`}
          >
            {isMobile && (
              <button
                onClick={() => setIsFilterOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close filter"
              >
                <X size={24} />
              </button>
            )}

            <div className="flex items-center mb-8 pb-4 border-b border-gray-100">
              <svg className="w-6 h-6 mr-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-800">Filter by:</h2>
            </div>

            <div className="space-y-8">
              {/* Categories Section */}
              <FilterSection title="Categories">
                {["Business", "Commerce", "Science", "Technology", "Arts", "Literature"].map((category, index) => (
                  <CheckboxItem
                    key={index}
                    id={`category-${index}`}
                    checked={filters.categories.includes(category)}
                    onChange={(checked) =>
                      handleFilterChange({
                        ...filters,
                        categories: checked
                          ? [...filters.categories, category]
                          : filters.categories.filter((item) => item !== category),
                      })
                    }
                    label={category}
                  />
                ))}
              </FilterSection>

              {/* Document Type Section */}
              <FilterSection title="Document Type">
                {["Document", "Periodic", "Article"].map((type, index) => (
                  <CheckboxItem
                    key={index}
                    id={`document-type-${index}`}
                    checked={filters.documentType.includes(type)}
                    onChange={(checked) =>
                      handleFilterChange({
                        ...filters,
                        documentType: checked
                          ? [...filters.documentType, type]
                          : filters.documentType.filter((item) => item !== type),
                      })
                    }
                    label={type}
                  />
                ))}
              </FilterSection>

              {/* Language Section */}
              <FilterSection title="Language">
                {["English (en)", "Arabic (ar)", "French (fr)", "Spanish (es)", "German (de)"].map((lang, index) => (
                  <CheckboxItem
                    key={index}
                    id={`language-${index}`}
                    checked={filters.language.includes(lang)}
                    onChange={(checked) =>
                      handleFilterChange({
                        ...filters,
                        language: checked
                          ? [...filters.language, lang]
                          : filters.language.filter((item) => item !== lang),
                      })
                    }
                    label={lang}
                  />
                ))}
              </FilterSection>

              {/* Periodic Type Section */}
              <FilterSection title="Periodic Type">
                {["Magazines", "Journals", "Newspapers", "Newsletters", "Books"].map((type, index) => (
                  <CheckboxItem
                    key={index}
                    id={`periodic-type-${index}`}
                    checked={filters.periodicType.includes(type)}
                    onChange={(checked) =>
                      handleFilterChange({
                        ...filters,
                        periodicType: checked
                          ? [...filters.periodicType, type]
                          : filters.periodicType.filter((item) => item !== type),
                      })
                    }
                    label={type}
                  />
                ))}
              </FilterSection>

              {/* School Year Section */}
              <FilterSection title="School Year">
                {["1cp", "2cp", "1cs", "2cs", "3cs", "Other"].map((year, index) => (
                  <CheckboxItem
                    key={index}
                    id={`year-${index}`}
                    checked={filters.schoolYear.includes(year)}
                    onChange={(checked) =>
                      handleFilterChange({
                        ...filters,
                        schoolYear: checked
                          ? [...filters.schoolYear, year]
                          : filters.schoolYear.filter((item) => item !== year),
                      })
                    }
                    label={year}
                  />
                ))}
              </FilterSection>

              {/* Size Section */}
              <FilterSection title="Size">
                {["0 - 250 pages", "250 - 500 pages", "500 - 750 pages", "750 - 1000 pages"].map((size, index) => (
                  <RadioItem
                    key={index}
                    id={`size-${index}`}
                    checked={filters.size === size}
                    onChange={() => handleFilterChange({ ...filters, size })}
                    label={size}
                    name="size"
                  />
                ))}
              </FilterSection>

              {/* Availability Section */}
              <FilterSection title="Availability">
                {["Available", "Not Available"].map((availability, index) => (
                  <RadioItem
                    key={index}
                    id={`availability-${index}`}
                    checked={filters.availability === availability}
                    onChange={() => handleFilterChange({ ...filters, availability })}
                    label={availability}
                    name="availability"
                  />
                ))}
              </FilterSection>
            </div>

            {/* Reset Filter Button */}
            <button
              className="w-full py-3 bg-[#F1413E] text-white font-semibold rounded-lg transition-all hover:bg-[#F1412E] mt-8"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="col-span-12 lg:col-span-10">
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
            <div className="container mx-auto px-10 justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 p-4">
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
          )}
        </div>
      </div>
    </div>
  )
}