"use client";
import { useState } from "react";
import SearchBar from "@/components/searchBar";
import BookFilter from "@/components/Filter";
import BookCard from '@/components/BookCard';

export default function ParentComponent() {
  const [searchInput, setSearchInput] = useState("");

  interface FilterState {
    schoolYear: string[];
    size: string;
    availability: string;
    documentType: string[];
    language: string[];
    periodicType: string[];
  }

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
    // You can also trigger a search API call here if needed
  };

  const handleFilterChange = (params: FilterState) => {
    setFilterParams(params);
    // You can also trigger a filter API call here if needed
  };

  // Example book data (expanded)
  const books = [
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      category: "Classic",
      description: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
      pages: 180,
      isAvailable: true,
      imageUrl: "/jpg/book.png"
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      category: "Fiction",
      description: "The story of racial injustice and the loss of innocence in a small Southern town.",
      pages: 281,
      isAvailable: false,
      imageUrl: "/jpg/book.png"
    },
    {
      title: "1984",
      author: "George Orwell",
      category: "Dystopian",
      description: "A dystopian novel set in a totalitarian regime, focusing on themes of surveillance and individuality.",
      pages: 328,
      isAvailable: true,
      imageUrl: "/jpg/book.png"
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      category: "Romance",
      description: "A romantic novel of manners that critiques the British landed gentry at the turn of the 19th century.",
      pages: 432,
      isAvailable: true,
      imageUrl: "/jpg/book.png"
    },
    {
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      category: "Fiction",
      description: "A story about the protagonist's disillusionment with the adult world.",
      pages: 277,
      isAvailable: false,
      imageUrl: "/jpg/book.png"
    },
    {
      title: "Moby Dick",
      author: "Herman Melville",
      category: "Adventure",
      description: "The voyage of the whaling ship Pequod, led by Captain Ahab in pursuit of the white whale, Moby Dick.",
      pages: 635,
      isAvailable: true,
      imageUrl: "/jpg/book.png"
    },
    {
      title: "War and Peace",
      author: "Leo Tolstoy",
      category: "Historical Fiction",
      description: "A novel that intertwines the lives of individuals with the historical events of the Napoleonic era.",
      pages: 1225,
      isAvailable: true,
      imageUrl: "/jpg/book.png"
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      category: "Fantasy",
      description: "A fantasy novel about the adventures of Bilbo Baggins in his quest to win a share of the treasure guarded by Smaug the dragon.",
      pages: 310,
      isAvailable: true,
      imageUrl: "/jpg/book.png"
    },
    {
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      category: "Fantasy",
      description: "An epic high-fantasy novel that follows the quest to destroy the One Ring.",
      pages: 1178,
      isAvailable: true,
      imageUrl: "/jpg/book.png"
    },
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      category: "Philosophical Fiction",
      description: "A novel about a young Andalusian shepherd named Santiago who dreams of finding a worldly treasure.",
      pages: 208,
      isAvailable: true,
      imageUrl: "/jpg/book.png"
    },
  ];

  return (
    <div>
      <SearchBar 
        searchInput={searchInput}
        onSearch={handleSearch}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />
      <div className="flex flex-col md:flex-row w-full">
        <div className={`${isFilterOpen ? "block" : "hidden"} z-60 md:block md:w-1/4`}>
          <BookFilter 
            isMobileOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filterParams={filterParams}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="w-full md:w-3/4">
          <div className="m-8  flex flex-col z-0 gap-[80px]">
            {books.map((book, index) => (
              <BookCard
                key={index}
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