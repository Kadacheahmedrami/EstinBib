// Core Types
// File: @/types/_types.ts
export interface BaseBook {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  description: string | null;
  coverImage: string | null;
  size: number | null;
  available: boolean | null;
  publishedAt: Date;
  addedAt: Date | null;
  language: string | null;
}


export interface Book extends BaseBook {
  id: string;              // Book ID as string (matching the format in the data)
}

export interface BorrowedBook {
  id: number;
  title: string;
  description?: string; // Optional because API might not provide it
  imageUrl?: string; // Optional with default fallback
  borrowCount?: number; // Added because API returns it
}



// Component Props
export interface BookDetailsProps {
  book: Book;
}


// Add this to your _types.ts
export interface BookPreviewProps {
  title: string;
  description: string;
  imageUrl: string;
}

export interface LocationMapProps {
  latitude: number;
  longitude: number;
  locationName: string;
}

export interface FilterState {
  schoolYear: string[];
  size: string;
  availability: string;
  documentType: string[];
  language: string[];
  periodicType: string[];
}

export interface FilterProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
  filterParams: FilterState;
  onFilterChange?: (filters: FilterState) => void;
}
export interface BookFilterProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
  filterParams: FilterState;
  onFilterChange?: (filters: FilterState) => void;
}

export interface ParentComponentProps {
  books?: BaseBook[];
  loading?: boolean; // New loading parameter
}


// Form Input Props
export interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}