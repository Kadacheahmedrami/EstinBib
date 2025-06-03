"use client"

import type React from "react"
import { memo } from "react"
import { X, Loader2 } from "lucide-react"
import NeonCheckbox from "@/components/pages/checkBox/checkbox"
import RadioButton from "@/components/pages/radioInput/radiobutton"
import { useCategories } from "@/hooks/useCategories"
import type { FilterState } from "@/types/_types"

interface FilterSidebarProps {
  filters: FilterState
  onFilterChange: (newFilters: FilterState) => void
  onResetFilters: () => void
  isFilterOpen: boolean
  isMobile: boolean
  onCloseFilter: () => void
}

const FilterSection = memo(({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-gray-700 uppercase tracking-wide">{title}:</h3>
    <div className="space-y-3">{children}</div>
  </div>
))
FilterSection.displayName = "FilterSection"

const CheckboxItem = memo(
  ({
    id,
    checked,
    onChange,
    label,
  }: {
    id: string
    checked: boolean
    onChange: (checked: boolean) => void
    label: string
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
  ),
)
CheckboxItem.displayName = "CheckboxItem"

const RadioItem = memo(
  ({
    id,
    checked,
    onChange,
    label,
    name,
  }: {
    id: string
    checked: boolean
    onChange: () => void
    label: string
    name: string
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
  ),
)
RadioItem.displayName = "RadioItem"

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-4">
    <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
    <span className="ml-2 text-sm text-gray-500">Loading...</span>
  </div>
)

const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="text-center py-4">
    <p className="text-sm text-red-500 mb-2">{message}</p>
    <button
      onClick={onRetry}
      className="text-xs text-blue-500 hover:text-blue-700 underline"
    >
      Try again
    </button>
  </div>
)

export default function FilterSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  isFilterOpen,
  isMobile,
  onCloseFilter,
}: FilterSidebarProps) {
  const { categories, loading: categoriesLoading, error: categoriesError, refetch } = useCategories()

  return (
    <div
      className={`z-[3] bg-[#F8F8F8] min-w-[240px] p-6 rounded-r-[15px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
        border border-gray-100 overflow-x-auto overflow-y-auto custom-scrollbar transition-transform duration-300 ${
          isMobile
            ? isFilterOpen
              ? "fixed inset-y-0 left-0 z-[3] transform translate-x-0"
              : "fixed inset-y-0 left-0 z-[3] transform -translate-x-full"
            : "sticky top-[100px] max-h-[calc(100vh-8rem)]"
        }`}
    >
      {isMobile && (
        <button
          onClick={onCloseFilter}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close filter"
        >
          <X size={24} />
        </button>
      )}

      <div className="flex items-center mb-8 pb-4 border-b border-gray-100">
        <svg className="w-6 h-6 mr-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
        <h2 className="text-2xl font-semibold text-gray-800">Filter by:</h2>
      </div>

      <div className="space-y-8">
        {/* Categories Section - Now Dynamic */}
        <FilterSection title="Categories">
          {categoriesLoading ? (
            <LoadingSpinner />
          ) : categoriesError ? (
            <ErrorMessage message={categoriesError} onRetry={refetch} />
          ) : (
            categories.map((category) => (
              <CheckboxItem
                key={category.id}
                id={`category-${category.id}`}
                checked={filters.categories.includes(category.name)}
                onChange={(checked) =>
                  onFilterChange({
                    ...filters,
                    categories: checked
                      ? [...filters.categories, category.name]
                      : filters.categories.filter((item) => item !== category.name),
                  })
                }
                label={category.name}
              />
            ))
          )}
        </FilterSection>

        {/* Document Type Section */}
        <FilterSection title="Document Type">
          {["Document", "Periodic", "Article"].map((type, index) => (
            <CheckboxItem
              key={index}
              id={`document-type-${index}`}
              checked={filters.documentType.includes(type)}
              onChange={(checked) =>
                onFilterChange({
                  ...filters,
                  documentType: checked
                    ? [...filters.documentType, type]
                    : filters.documentType.filter((item) => item !== type),
                })
              }
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
              onChange={(checked) =>
                onFilterChange({
                  ...filters,
                  language: checked
                    ? [...filters.language, lang]
                    : filters.language.filter((item) => item !== lang),
                })
              }
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
              onChange={(checked) =>
                onFilterChange({
                  ...filters,
                  periodicType: checked
                    ? [...filters.periodicType, type]
                    : filters.periodicType.filter((item) => item !== type),
                })
              }
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
              onChange={(checked) =>
                onFilterChange({
                  ...filters,
                  schoolYear: checked
                    ? [...filters.schoolYear, year]
                    : filters.schoolYear.filter((item) => item !== year),
                })
              }
              label={year}
            />
          ))}
        </FilterSection>

        {/* Size Section */}
        <FilterSection title="Size">
          {["0 - 250 pages", "250 - 500 pages", "500 - 750 pages", "750 - 1000 pages"].map((size, index) => (
            <RadioItem
              key={index}
              id={`size-${index}`}
              checked={filters.size === size}
              onChange={() => onFilterChange({ ...filters, size })}
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
              onChange={() => onFilterChange({ ...filters, availability })}
              label={availability}
              name="availability"
            />
          ))}
        </FilterSection>
      </div>

      {/* Reset Filter Button */}
      <button
        className="w-full py-3 bg-[#F1413E] text-white font-semibold rounded-lg transition-all hover:bg-[#F1412E] mt-8"
        onClick={onResetFilters}
      >
        Reset Filters
      </button>
    </div>
  )
}