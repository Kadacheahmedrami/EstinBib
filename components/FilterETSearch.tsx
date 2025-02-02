"use client"
import { useState, useEffect } from "react";
import SearchBar from "@/components/searchBar";
import BookFilter from "@/components/Filter";
import BookCard from '@/components/BookCard';
import { FilterState, Book } from '@/types/_types';

interface ParentComponentProps {
  books: Book[]; // Ensure that books is an array of Book objects
}

export default function ParentComponent({ books }: ParentComponentProps) {
  const [searchInput, setSearchInput] = useState("");
  const [filterParams, setFilterParams] = useState<FilterState>({
    schoolYear: [],
    size: '',
    availability: '',
    documentType: [],
    language: [],
    periodicType: [],
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Log state values whenever searchInput or filterParams change
  useEffect(() => {
    // console.log("Search Input changed:", searchInput);
  }, [searchInput]); 

  useEffect(() => {
    // console.log("Filter Params changed:", filterParams);
  }, [filterParams]); 

  const handleSearch = (input: string) => {
    setSearchInput(input);
  };

  const handleFilterChange = (params: FilterState) => {
    setFilterParams(params);
  };

  // Add safety check for books
  if (!Array.isArray(books)) {
    console.warn('Books prop is not an array:', books);
    return <div>No books available</div>;
  }

  return (
    <div>
      <div className="h-[150px]">
        <SearchBar 
          searchInput={searchInput}
          onSearch={handleSearch}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
        />
      </div>
   
      <div className="flex flex-col mt-[100px] md:flex-row w-full">
        <div className={`lg:w-1/4`}>
          <BookFilter 
            isMobileOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filterParams={filterParams}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="w-full lg:w-3/4">
          <div className="m-8 relative flex flex-col gap-[80px]">
            {
              books.map((book, index) => (
                <BookCard
                  key={book.id || index}
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  description={book.description}
                  size={book.size}
                  available={book.available}
                  coverImage={book.coverImage}
                  publishedAt={book.publishedAt || new Date()} // Use a valid date or a fallback date
                  addedAt={book.addedAt || null} // Use null or a valid date
                  language={book.language || ""} // Use a valid string or fallback to empty string
                  isbn={book.isbn}              />
              
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
