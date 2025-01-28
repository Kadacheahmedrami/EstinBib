"use client";
import React, { useState, useEffect } from 'react';
import NeonCheckbox from '@/components/checkBox/checkbox';
import RadioButton from '@/components/radioInput/radiobutton';

interface FilterState {
  schoolYear: string[];
  size: string;
  availability: string;
  documentType: string[];
  language: string[];
  periodicType: string[];
}

interface BookFilterProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
  filterParams: FilterState;
  onFilterChange?: (filters: FilterState) => void;
}

export default function BookFilter({ isMobileOpen, onClose, filterParams, onFilterChange }: BookFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    schoolYear: [],
    size: '',
    availability: '',
    documentType: [],
    language: [],
    periodicType: [],
  });


  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (filterParams) {
      setFilters(filterParams);
    }
  }, [filterParams]);

  const handleYearChange = (subject: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      schoolYear: checked
        ? [...prev.schoolYear, subject]
        : prev.schoolYear.filter((item) => item !== subject),
    }));
  };

  const handleSizeChange = (size: string) => {
    setFilters((prev) => ({ ...prev, size }));
  };

  const handleAvailabilityChange = (availability: string) => {
    setFilters((prev) => ({ ...prev, availability }));
  };

  const handleDocumentTypeChange = (type: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      documentType: checked
        ? [...prev.documentType, type]
        : prev.documentType.filter((item) => item !== type),
    }));
  };

  const handleLanguageChange = (lang: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      language: checked
        ? [...prev.language, lang]
        : prev.language.filter((item) => item !== lang),
    }));
  };

  const handlePeriodicTypeChange = (type: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      periodicType: checked
        ? [...prev.periodicType, type]
        : prev.periodicType.filter((item) => item !== type),
    }));
  };

  const handleApplyFilter = () => {
    console.log('Applied filters:', filters);
    if (onFilterChange) {
      onFilterChange(filters); // Pass the updated filters back to the parent component
    }
    if (isMobile && onClose) {
      onClose();
    }
  };

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
        className={`sticky top-[100px] w-[300px] bg-[#F8F8F8] p-6 rounded-r-[15px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-y-auto custom-scrollbar max-h-[calc(100vh-8rem)] transition-transform duration-300 ${
          isMobile ? (isMobileOpen ? 'translate-x-0' : '-translate-x-full') : ''
        }`}
        style={{ zIndex: isMobile ? 40 : 'auto' }}
      >
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

        {/* Document Type Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 uppercase tracking-wide">Document Type:</h3>
          <div className="space-y-3">
            {['Document', 'Periodic', 'Article'].map((type, index) => (
              <div key={index} className="flex items-center group cursor-pointer">
                <NeonCheckbox
                  id={`document-type-${index}`}
                  checked={filters.documentType.includes(type)}
                  onChange={(checked: boolean) => handleDocumentTypeChange(type, checked)}
                />
                <span className="ml-3 text-base text-gray-600 group-hover:text-gray-900 transition-colors">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 mb-8"></div>

        {/* Language Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 uppercase tracking-wide">Language:</h3>
          <div className="space-y-3">
            {['English (en)', 'Arabic (ar)', 'French (fr)', 'Spanish (es)', 'German (de)'].map((lang, index) => (
              <div key={index} className="flex items-center group cursor-pointer">
                <NeonCheckbox
                  id={`language-${index}`}
                  checked={filters.language.includes(lang)}
                  onChange={(checked: boolean) => handleLanguageChange(lang, checked)}
                />
                <span className="ml-3 text-base text-gray-600 group-hover:text-gray-900 transition-colors">{lang}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 mb-8"></div>

        {/* Periodic Type Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 uppercase tracking-wide">Periodic Type:</h3>
          <div className="space-y-3">
            {['Magazines', 'Journals', 'Newspapers', 'Newsletters', 'Books'].map((type, index) => (
              <div key={index} className="flex items-center group cursor-pointer">
                <NeonCheckbox
                  id={`periodic-type-${index}`}
                  checked={filters.periodicType.includes(type)}
                  onChange={(checked: boolean) => handlePeriodicTypeChange(type, checked)}
                />
                <span className="ml-3 text-base text-gray-600 group-hover:text-gray-900 transition-colors">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 mb-8"></div>

        {/* School Year Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 uppercase tracking-wide">School year:</h3>
          <div className="space-y-3">
            {['1cp', '2cp', '1cs', '2cs', '3cs', 'Other'].map((year, index) => (
              <div key={index} className="flex items-center group cursor-pointer">
                <NeonCheckbox
                  id={`year-${index}`}
                  checked={filters.schoolYear.includes(year)}
                  onChange={(checked: boolean) => handleYearChange(year, checked)}
                />
                <span className="ml-3 text-base text-gray-600 group-hover:text-gray-900 transition-colors">{year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 mb-8"></div>

        {/* Size Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 uppercase tracking-wide">Size:</h3>
          <div className="space-y-3">
            {[
              '0 - 250 pages',
              '250 - 500 pages',
              '500 - 750 pages',
              'More than 750 pages'
            ].map((size, index) => (
              <RadioButton
                key={index}
                id={`size-${index}`}
                name="size"
                value={size}
                label={size}
                checked={filters.size === size}
                onChange={() => handleSizeChange(size)}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 mb-8"></div>

        {/* Availability Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 uppercase tracking-wide">Availability:</h3>
          <div className="space-y-3">
            {['Available only', 'All Books'].map((option, index) => (
              <RadioButton
                key={index}
                id={`availability-${index}`}
                name="availability"
                value={option}
                label={option}
                checked={filters.availability === option}
                onChange={() => handleAvailabilityChange(option)}
              />
            ))}
          </div>
        </div>

        {/* Apply Filter Button */}
        <button
          onClick={handleApplyFilter}
          className="w-full bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 active:bg-red-700 transition-all duration-150 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Apply Filter
        </button>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
        `}</style>
      </div>
    </>
  );
}