// Core Types
export interface BaseBook {
  bookid: string;
  title: string;
  author: string;
  category: string;
  description: string;
  pages: number;
  isAvailable: boolean;
  imageUrl: string;
}



// Extended Book Types
export interface Book extends BaseBook {
  publicationDate: string;
  language: string;
  publisher: string;
  isbn: string;
  pdfUrl: string;
}

export interface BorrowedBook {
  title: string;
  dateBorrowed: string;
  dueDate: string;
  status: string;
  imageUrl: string;
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