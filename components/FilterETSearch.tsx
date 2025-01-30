import { useState, useEffect } from "react";

import SearchBar from "@/components/searchBar";
import BookFilter from "@/components/Filter";
import BookCard from '@/components/BookCard';

import { FilterState, ParentComponentProps } from '@/types/_types';

export default function ParentComponent({ books = [], loading = false }: ParentComponentProps) {
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
    console.log("Search Input changed:", searchInput);
  }, [searchInput]); // This effect runs every time searchInput changes

  useEffect(() => {
    console.log("Filter Params changed:", filterParams);
  }, [filterParams]); // This effect runs every time filterParams changes

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
            {loading ? (
              <div className="text-center h-screen">Loading...</div> // Show loading text or spinner
            ) : (
              books.map((book, index) => (
                <BookCard
                  key={book.bookid || index} // Prefer bookid over index for key
                  bookid={book.bookid} 
                  title={book.title}
                  author={book.author}
                  category={book.category}
                  description={book.description}
                  pages={book.pages}
                  isAvailable={book.isAvailable}
                  imageUrl={book.imageUrl}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
