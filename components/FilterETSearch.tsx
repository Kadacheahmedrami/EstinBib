"use client";
import { useState } from "react";

import SearchBar from "@/components/searchBar";
import BookFilter from "@/components/Filter";
import BookCard from '@/components/BookCard';

import {  FilterState, ParentComponentProps }from '@/types/_types';


export default function ParentComponent({ books = [] }: ParentComponentProps) { // Provide default empty array
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
            {books.map((book, index) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}