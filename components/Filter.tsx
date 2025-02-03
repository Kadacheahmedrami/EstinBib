"use client"
import type React from "react"
import { useState, useEffect } from "react"
import NeonCheckbox from "@/components/checkBox/checkbox"
import RadioButton from "@/components/radioInput/radiobutton"
import { X } from "lucide-react"
import { FilterState, FilterProps } from "@/types/_types"

export default function BookFilter({ isMobileOpen, onClose, filterParams, onFilterChange }: FilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    schoolYear: [],
    size: "",
    availability: "",
    documentType: [],
    language: [],
    periodicType: [],
    categories: [], // New: added categories
    q: "", // New: added search query
  })

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (filterParams) {
      setFilters(prevFilters => ({
        ...prevFilters,
        ...filterParams
      }))
    }
  }, [filterParams])

  // Helper: update filters state and immediately apply the changes.
  const updateFilters = (updater: (prev: FilterState) => FilterState) => {
    setFilters(prev => {
      const newFilters = updater(prev)
      // Immediately apply the new filters
      if (onFilterChange) {
        onFilterChange(newFilters)
      }
      // If on mobile, close the filter sidebar
      if (isMobile && onClose) {
        onClose()
      }
      return newFilters
    })
  }

  // Each handler now uses updateFilters to update the state and apply the filter

  const handleYearChange = (subject: string, checked: boolean) => {
    updateFilters(prev => ({
      ...prev,
      schoolYear: checked 
        ? [...prev.schoolYear, subject] 
        : prev.schoolYear.filter(item => item !== subject)
    }))
  }

  const handleSizeChange = (size: string) => {
    updateFilters(prev => ({ ...prev, size }))
  }

  const handleAvailabilityChange = (availability: string) => {
    updateFilters(prev => ({ ...prev, availability }))
  }

  const handleDocumentTypeChange = (type: string, checked: boolean) => {
    updateFilters(prev => ({
      ...prev,
      documentType: checked 
        ? [...prev.documentType, type] 
        : prev.documentType.filter(item => item !== type)
    }))
  }

  const handleLanguageChange = (lang: string, checked: boolean) => {
    updateFilters(prev => ({
      ...prev,
      language: checked 
        ? [...prev.language, lang] 
        : prev.language.filter(item => item !== lang)
    }))
  }

  const handlePeriodicTypeChange = (type: string, checked: boolean) => {
    updateFilters(prev => ({
      ...prev,
      periodicType: checked 
        ? [...prev.periodicType, type] 
        : prev.periodicType.filter(item => item !== type)
    }))
  }

  // New: Handle categories change
  const handleCategoriesChange = (category: string, checked: boolean) => {
    updateFilters(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category] 
        : prev.categories.filter(item => item !== category)
    }))
  }



  // The manual apply button remains as an option
  const handleApplyFilter = () => {
    console.log("Applied filters:", filters)
    if (onFilterChange) {
      onFilterChange(filters)
    }
    if (isMobile && onClose) {
      onClose()
    }
  }

  return (
    <>
      {/* Overlay for Mobile */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`w-full z-[20] sm:w-[300px] bg-[#F8F8F8] p-6 rounded-r-[15px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-y-auto custom-scrollbar transition-transform duration-300 ${
          isMobile
            ? isMobileOpen
              ? "fixed inset-y-0 left-0 z-50 transform translate-x-0"
              : "fixed inset-y-0 left-0 z-50 transform -translate-x-full"
            : "sticky top-[100px] max-h-[calc(100vh-8rem)]"
        }`}
      >
        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close filter"
          >
            <X size={24} />
          </button>
        )}

        <div className="flex items-center mb-8 pb-4 border-b border-gray-100">
          <svg
            className="w-6 h-6 mr-3 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-800">Filter by:</h2>
        </div>

        {/* Filter sections */}
        <div className="space-y-8">
          {/* New: Categories Section */}
          <FilterSection title="Categories">
            {["Business", "Commerce", "Science", "Technology", "Arts", "Literature"].map((category, index) => (
              <CheckboxItem
                key={index}
                id={`category-${index}`}
                checked={filters.categories.includes(category)}
                onChange={(checked) => handleCategoriesChange(category, checked)}
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
                onChange={(checked) => handleDocumentTypeChange(type, checked)}
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
                onChange={(checked) => handleLanguageChange(lang, checked)}
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
                onChange={(checked) => handlePeriodicTypeChange(type, checked)}
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
                onChange={(checked) => handleYearChange(year, checked)}
                label={year}
              />
            ))}
          </FilterSection>

          {/* Size Section */}
          <FilterSection title="Size">
            {["0 - 250 pages", "250 - 500 pages", "500 - 750 pages", "More than 750 pages"].map((size, index) => (
              <RadioItem
                key={index}
                id={`size-${index}`}
                checked={filters.size === size}
                onChange={() => handleSizeChange(size)}
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
                onChange={() => handleAvailabilityChange(availability)}
                label={availability}
                name="availability"
              />
            ))}
          </FilterSection>
        </div>

        {/* Apply Filter Button */}
        <button
          className="w-full py-3 bg-[#F1413E] text-white font-semibold rounded-lg transition-all hover:bg-[#F1412E] mt-8"
          onClick={handleApplyFilter}
        >
          Apply Filters
        </button>
      </div>
    </>
  )
}

// Helper components remain the same as in the previous implementation
const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-gray-700 uppercase tracking-wide">{title}:</h3>
    <div className="space-y-3">{children}</div>
  </div>
)

const CheckboxItem: React.FC<{ id: string; checked: boolean; onChange: (checked: boolean) => void; label: string }> = ({
  id,
  checked,
  onChange,
  label,
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
)

const RadioItem: React.FC<{ id: string; checked: boolean; onChange: () => void; label: string; name: string }> = ({
  id,
  checked,
  onChange,
  label,
  name,
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
)
