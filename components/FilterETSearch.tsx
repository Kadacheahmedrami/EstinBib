"use client";
import { useState, useEffect } from "react";
import SearchBar from "@/components/searchBar";
import BookFilter from "@/components/Filter";
import BookCard from "@/components/BookCard";
import { FilterState, Book } from "@/types/_types";
import API from "@/lib/axios";

interface ParentComponentProps {
  books: Book[];
}

export default function ParentComponent({ books }: ParentComponentProps) {
  const [searchInput, setSearchInput] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [filterParams, setFilterParams] = useState<FilterState>({
    schoolYear: [],
    size: "",
    availability: "",
    documentType: [],
    language: [],
    periodicType: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredBooks(books);
      return;
    }
    
    const fetchSearchResults = async () => {
      try {
        const response = await API.get(`/api/search?q=${encodeURIComponent(searchInput)}`);
        setFilteredBooks(response.data.books);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [searchInput, books]);

  const handleSearch = (input: string) => setSearchInput(input);
  const handleFilterChange = (params: FilterState) => setFilterParams(params);

  if (!Array.isArray(books)) {
    console.warn("Books prop is not an array:", books);
    return <div>No books available</div>;
  }

  return (
    <div className="w-screen mx-auto ">
      <div className="h-[150px]">
        <SearchBar 
          searchInput={searchInput}
          onSearch={handleSearch}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
        />
      </div>
      
      <div className="flex flex-col md:flex-row w-full mt-10">
        <div className="lg:w-1/4">
          <BookFilter 
            isMobileOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filterParams={filterParams}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
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
      </div>
    </div>
  );
}
