// BookProps used in @/components/RelatedBooks.tsx
export interface BookProps {
  title: string;
  description: string;
  imageUrl: string;
}

// LocationMapProps used in @/components/LocationMapClient
export interface LocationMapProps {
  latitude: number;
  longitude: number;
  locationName: string;
}

// BookCardProps used in @/components/FilterETSearch
export interface BookCardProps {
  bookid: string;
  title: string;
  author: string;
  category: string;
  description: string;
  pages: number;
  isAvailable: boolean;
  imageUrl: string;
}

// ParentComponentProps used in @/components/FilterETSearch
export interface ParentComponentProps {
  books?: BookCardProps[]; // Make books optional
}

// FilterState used in @/components/Filter
export interface FilterState {
  schoolYear: string[];
  size: string;
  availability: string;
  documentType: string[];
  language: string[];
  periodicType: string[];
}

// BookFilterProps used in @/components/Filter
export interface BookFilterProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
  filterParams: FilterState;
  onFilterChange?: (filters: FilterState) => void;
}

// BookProps1 used in @/components/borrow-history
export interface BookProps1 {
  title: string;
  dateBorrowed: string;
  dueDate: string;
  status: string;
  imageUrl: string;
}

// Book used in @/components/BookDetails
export interface Book {
  bookid: string;
  title: string;
  author: string;
  category: string;
  description: string;
  pages: number;
  isAvailable: boolean;
  imageUrl: string;
  publicationDate: string;
  language: string;
  publisher: string;
  isbn: string;
  pdfUrl: string;
}

// BookDetailsProps used in @/components/BookDetails
export interface BookDetailsProps {
  book: Book;
}

// BookCardProps1 used in @/components/BookDetails
export interface BookCardProps1 {
  bookid: string;
  title: string;
  author: string;
  category: string;
  description: string;
  pages: number;
  isAvailable: boolean;
  imageUrl: string;
}

// BookProps1 used in @/components/ui/card
export interface BookProps1 {
  title: string;
  dateBorrowed: string;
  dueDate: string;
  status: string;
  imageUrl: string;
}

// RadioButtonProps used in @/components/radioInput/radiobutton
export interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// NeonCheckboxProps used in @/comp
