"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { Search, X, Clock } from "lucide-react"

interface SearchBarProps {
  searchInput: string
  onSearchChange: (value: string) => void
  onSearch: (value: string) => void
  isSticky?: boolean
}

export default function SearchBar({ searchInput, onSearchChange, onSearch, isSticky = false }: SearchBarProps) {
  const [previousKeywords, setPreviousKeywords] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Enhanced animation handling
  useEffect(() => {
    if (isSticky) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isSticky])

  const toggleSearchSuggestions = useCallback(() => {
    setIsVisible(prev => !prev)
  }, [])

  const handleSearch = useCallback(
    (value: string) => {
      onSearchChange(value)
      if (value.trim() && !previousKeywords.includes(value.trim())) {
        setPreviousKeywords((prev) => [value.trim(), ...prev].slice(0, 8))
      }
      onSearch(value)
      setIsVisible(false)
    },
    [previousKeywords, onSearchChange, onSearch],
  )

  const handleSuggestionClick = useCallback((keyword: string) => {
    handleSearch(keyword)
    inputRef.current?.blur()
  }, [handleSearch])

  const clearSearchHistory = useCallback(() => {
    setPreviousKeywords([])
    setIsVisible(false)
  }, [])

  const removeSuggestion = useCallback((keyword: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPreviousKeywords(prev => prev.filter(k => k !== keyword))
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch(searchInput)
    } else if (e.key === "Escape") {
      setIsVisible(false)
      inputRef.current?.blur()
    }
  }, [searchInput, handleSearch])

  return (
    <div className="flex flex-col mx-auto w-[80%] md:max-w-[800px] relative">
      <div
        ref={containerRef}
        className={`flex shadow overflow-hidden items-center h-[57px] w-full bg-[#F8F7F7] rounded-[22px] p-3 transition-all duration-300 ${
          isSticky ? "sticky top-4 z-50 shadow-2xl border border-gray-200 backdrop-blur-sm bg-[#F8F7F7]/95" : ""
        } ${isAnimating ? "scale-[1.02]" : ""}`}
      >
        <input
          ref={inputRef}
          value={searchInput}
          type="text"
          placeholder="Search a name, category, or a module"
          className="flex-1 bg-transparent outline-none px-4 text-sm placeholder-gray-500 transition-all duration-200"
          onClick={toggleSearchSuggestions}
          onFocus={() => {
            if (previousKeywords.length > 0) {
              setIsVisible(true)
            }
          }}
          onBlur={(e) => {
            const relatedTarget = e.relatedTarget as HTMLElement | null
            if (!relatedTarget?.closest(".search-container")) {
              setTimeout(() => {
                setIsVisible(false)
              }, 200)
            }
          }}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {searchInput && (
          <button
            onClick={() => handleSearch("")}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200 mr-2"
            type="button"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}

        <div
          onClick={() => handleSearch(searchInput)}
          className="flex items-center mr-2 gap-2 text-[#9B1616] cursor-pointer hover:text-[#7A1212] transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-[#9B1616]/10"
        >
          <Search className="w-5 h-5" />
          <span className="text-[16px] hidden md:block font-medium">Search</span>
        </div>
      </div>

      {isVisible && previousKeywords.length > 0 && (
        <div
          className={`search-container absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-40 transition-all duration-200 ${
            isSticky ? "shadow-2xl" : ""
          }`}
        >
          <div className="p-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Recent searches</span>
            </div>
            <button
              onClick={clearSearchHistory}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-200 px-2 py-1 rounded hover:bg-gray-50"
            >
              Clear all
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {previousKeywords.map((keyword, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(keyword)}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 group"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {keyword}
                  </span>
                </div>
                <button
                  onClick={(e) => removeSuggestion(keyword, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-all duration-200"
                >
                  <X className="w-3 h-3 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
