"use client";
import { Search, Filter } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function SearchBar({ searchInput, onSearch, isFilterOpen, setIsFilterOpen }: {
  searchInput: string;
  onSearch: (input: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [input, setInput] = useState(searchInput);
  const [previousKeywords, setPreviousKeywords] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedKeywords = localStorage.getItem("searchKeywords");
    if (storedKeywords) {
      setPreviousKeywords(JSON.parse(storedKeywords));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("searchKeywords", JSON.stringify(previousKeywords));
  }, [previousKeywords]);

  useEffect(() => {
    if (isFocused && previousKeywords.length > 0) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isFocused, previousKeywords.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (searchBarRef.current) {
        const offset = searchBarRef.current.offsetTop;
        setIsSticky(window.scrollY > offset);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = () => {
    if (input.trim() && !previousKeywords.includes(input.trim())) {
      setPreviousKeywords((prev) => [input.trim(), ...prev].slice(0, 5));
    }
    onSearch(input);
    setInput("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeywordClick = (keyword: string) => {
    setInput(keyword);
    onSearch(keyword);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setPreviousKeywords((prev) => prev.filter((k) => k !== keyword));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleRemoveAllKeywords = () => {
    setPreviousKeywords([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <>
      <div 
        ref={searchBarRef}
        className={`w-full transition-all ${
          isSticky 
            ? 'fixed top-[88px] left-0  z-0 py-4' 
            : 'relative'
        }`}
      >
        <div className="flex w-[100%] px-4 justify-center items-start gap-4 flex-row">
          <div className="flex flex-col mx-auto w-full md:max-w-[600px]">
            {/* Search Bar */}
            <div className={`flex items-center h-[57px] w-full bg-[#F8F7F7] rounded-[22px] shadow p-3 transition-all duration-300 ${
              isSticky ? 'shadow-lg' : ''
            }`}>
              <input
                ref={inputRef}
                value={input}
                type="text"
                placeholder="Search a name, category, or a module"
                className="flex-1 bg-transparent outline-none px-4 text-sm placeholder-gray-500"
                onClick={() => setIsFocused(true)}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                  const relatedTarget = e.relatedTarget as HTMLElement | null;
                  if (!relatedTarget?.closest('.search-container')) {
                    setTimeout(() => setIsFocused(false), 200);
                  }
                }}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />

              <div
                onClick={handleSearch}
                className="flex items-center mr-2 gap-2 text-[#9B1616] cursor-pointer"
              >
                <Search className="w-5 h-5" />
                <span className="text-[16px] hidden md:block font-medium">Search</span>
              </div>
            </div>

            {/* Fixed height container for keywords */}
            <div className="h-[100px] relative">
              <div 
                className={`w-full bg-white rounded-[22px] my-4 z-50 search-container absolute top-0 left-0 transition-all duration-300 ease-in-out ${
                  isVisible && isFocused && previousKeywords.length > 0
                    ? 'opacity-100 transform translate-y-0 pointer-events-auto' 
                    : 'opacity-0 transform -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="flex flex-wrap gap-2 p-3">
                  {previousKeywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="bg-[#FCF3F3] text-black shadow rounded-full px-4 py-2 text-sm cursor-pointer hover:bg-[#e0e0e0] flex items-center gap-2 transition-all duration-200 ease-in-out transform hover:scale-105"
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <span onClick={() => handleKeywordClick(keyword)}>
                        {keyword}
                      </span>
                      <span
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveKeyword(keyword);
                        }}
                      >
                        X
                      </span>
                    </div>
                  ))}
                  {previousKeywords.length >= 2 && (
                    <div
                      className="bg-[#FCF3F3] text-black shadow rounded-full px-4 py-2 text-sm cursor-pointer hover:bg-[#e0e0e0] flex items-center gap-2 transition-all duration-200 ease-in-out transform hover:scale-105"
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      onClick={() => handleRemoveAllKeywords()}
                    >
                      <span>Delete All</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="block md:hidden">
            <button
              className={`flex bg-[#F1413E] p-4 rounded-full transition-all duration-300 ${
                isFilterOpen ? 'bg-opacity-80' : ''
              }`}
              aria-label="Filter"
              onClick={toggleFilter}
            >
              <Filter className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}