"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef, memo } from "react"
import { Search } from "lucide-react"

interface SearchBarProps {
  searchInput: string
  onSearchChange: (value: string) => void
  onSearch: (value: string) => void
  isSticky?: boolean
}

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

export default function SearchBar({ searchInput, onSearchChange, onSearch, isSticky = false }: SearchBarProps) {
  const [previousKeywords, setPreviousKeywords] = useState<string[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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

  // Function to toggle search suggestions visibility
  const toggleSearchSuggestions = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      onSearchChange(value)
      if (value.trim() && !previousKeywords.includes(value.trim())) {
        setPreviousKeywords((prev) => [value.trim(), ...prev].slice(0, 5))
      }
      onSearch(value)
    },
    [previousKeywords, onSearchChange, onSearch],
  )

  return (
    <div className="flex flex-col mx-auto w-[80%] md:max-w-[800px]">
      <div
        className={`flex shadow overflow-hidden items-center h-[57px] w-full bg-[#F8F7F7] rounded-[22px] p-3 transition-all duration-300 ${
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
  )
}