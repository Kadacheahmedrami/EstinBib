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

// Extended Book Types
export interface Book extends BaseBook {
  id: string; // Book ID as string (matching the format in the data)
}

export interface BorrowedBook {
  description: string;
  title: string;
  dateBorrowed: string;
  dueDate: string;
  status: string; // Could be 'borrowed', 'returned', 'overdue'
  coverImage: string;
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
  categories: string[];
  q: string;
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

export interface ActiveBorrows {
  title: string;
  borrowedAt: Date;
  dueDate: Date;
  coverImage: string;
  description: string;
}

export interface BooksHistory {
  title: string;
  borrowedAt: Date;
  dueDate: Date;
  returnedAt: Date | null;
  coverImage: string;
  description: string;
}
