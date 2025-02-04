/* eslint-disable */

"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/searchBar";
import BookFilter from "@/components/Filter";
import BookCard from "@/components/BookCard";
import { FilterState, Book } from "@/types/_types";
import API from "@/lib/axios";

interface ParentComponentProps {
  books: Book[];
}

interface NoResultsMessageProps {
  title: string;
  subtitle?: string;
}

const NoResultsMessage = ({ title, subtitle }: NoResultsMessageProps) => (
  <div className="flex flex-col justify-center items-center h-64 text-center p-4">
    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
      {title}
    </h2>
    {subtitle && (
      <p className="text-lg md:text-xl text-gray-500">{subtitle}</p>
    )}
  </div>
);

export default function ParentComponent({ books }: ParentComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Default empty filter state
  const DEFAULT_FILTER_STATE: FilterState = {
    schoolYear: [],
    size: "",
    categories: [],
    availability: "",
    documentType: [],
    language: [],
    periodicType: [],
    q: "",
  };

  // Initialize state from URL parameters
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [filterParams, setFilterParams] = useState<FilterState>({
    schoolYear: searchParams.get("schoolYear")?.split(",") || [],
    size: searchParams.get("size") || "",
    categories: searchParams.get("categories")?.split("+") || [],
    availability: searchParams.get("available") || "",
    documentType: searchParams.get("documentType")?.split(",") || [],
    language: searchParams.get("language")?.split(",") || [],
    periodicType: searchParams.get("periodicType")?.split(",") || [],
    q: searchParams.get("q") || "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Updates the URL parameters without reloading the page.
  const updateUrlParams = (params: {
    q?: string;
    size?: string;
    available?: string;
    categories?: string[];
    schoolYear?: string[];
    documentType?: string[];
    language?: string[];
    periodicType?: string[];
  }) => {
    const newParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return;
      } else if (Array.isArray(value)) {
        // For categories use '+' separator, otherwise comma
        newParams.set(key, key === "categories" ? value.join("+") : value.join(","));
      } else {
        newParams.set(key, value);
      }
    });

    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  // Resets all filters and clears URL parameters.
  const handleResetFilters = () => {
    setSearchInput("");
    setFilterParams(DEFAULT_FILTER_STATE);
    setFilteredBooks(books);

    // Clear the URL query string.
    router.replace("", { scroll: false });
  };

  // Performs the API search (or shows the full list if no parameters exist).
  const fetchSearchResults = async () => {
    const searchParameters: Record<string, string | string[]> = {};

    if (searchInput.trim()) {
      searchParameters.q = searchInput;
    }
    if (filterParams.size) {
      // Clean up the size string.
      const cleanSize = filterParams.size
        .replace(/\s+pages/g, "")
        .replace(/\s*-\s*/g, "-")
        .replace(/\s*\+\s*/g, "-");
      searchParameters.size = cleanSize;
    }
    if (filterParams.availability) {
      searchParameters.available = filterParams.availability === "Available" ? "true" : "false";
    }
    if (filterParams.categories.length) {
      searchParameters.categories = filterParams.categories;
    }
    if (filterParams.schoolYear.length) {
      searchParameters.schoolYear = filterParams.schoolYear;
    }
    if (filterParams.documentType.length) {
      searchParameters.documentType = filterParams.documentType;
    }
    if (filterParams.language.length) {
      searchParameters.language = filterParams.language;
    }
    if (filterParams.periodicType.length) {
      searchParameters.periodicType = filterParams.periodicType;
    }

    // Update the URL with these parameters.
    updateUrlParams(searchParameters);

    // If no parameters were provided, show the original list.
    if (Object.keys(searchParameters).length === 0) {
      setFilteredBooks(books);
      return;
    }

    try {
      setIsLoading(true);
      // Build a query string ensuring arrays use the '+' separator.
      const queryString = new URLSearchParams(
        Object.entries(searchParameters).map(([key, value]) =>
          Array.isArray(value) ? [key, value.join("+")] : [key, String(value)]
        )
      ).toString();

      let response = await API.get(`/api/search?${queryString}`);
      setFilteredBooks(response.data.books);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setFilteredBooks(books);
    } finally {
      setIsLoading(false);
    }
  };

  // EFFECT: On mount, check if there is a "q" parameter.
  // Delay the reset until after the first render.
  useEffect(() => {
    setTimeout(() => {
      const initialQuery = searchParams.get("q");
      if (!initialQuery || !initialQuery.trim()) {
        handleResetFilters();
      }
    }, 0);
  }, []); // run once on mount

  // EFFECT: Whenever searchInput or filterParams change, perform a search.
  useEffect(() => {
    // Only perform a search if any parameter is set.
    if (
      searchInput.trim() ||
      Object.values(filterParams).some(val =>
        Array.isArray(val) ? val.length > 0 : val && val !== ""
      )
    ) {
      fetchSearchResults();
    }
  }, [searchInput, filterParams]);

  // Handlers for search and filter changes.
  const handleSearch = (input: string) => {
    setSearchInput(input);
  };
  const handleFilterChange = (params: FilterState) => {
    setFilterParams(params);
  };

  // Fallback if the books prop is not an array.
  if (!Array.isArray(books)) {
    console.warn("Books prop is not an array:", books);
    return (
      <NoResultsMessage
        title="No Books Available"
        subtitle="There seems to be an issue with the data. Please try again later."
      />
    );
  }

  return (
    <div className="w-screen  mx-auto">
      <div className="h-[150px] ">
        <SearchBar
          searchInput={searchInput}
          onSearch={handleSearch}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
        />
      </div>

      <div className="grid grid-cols-12 gap-5 mt-[100px] md:flex-row w-full">
        <div className="col-span-2">
          <BookFilter
            isMobileOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filterParams={filterParams}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="col-span-10  ">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-xl font-medium text-gray-600">
                Loading results...
              </p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <NoResultsMessage
              title="No Books Found"
              subtitle="No books found matching your search criteria. Please try different keywords or filters."
            />
          ) : 
          
          (
            <div className="container mx-auto px-10  justify-center">
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 p-4">
              {filteredBooks.map((book, index) => (
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
  );
}
