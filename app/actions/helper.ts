
import API from "@/lib/axios";
interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
    description: string;
    coverImage: string;
    size: number;
    available: boolean;
    publishedAt: string;
    addedAt: string;
    language: string;
  }
  
// Fetch random books (for the RelatedBooks carousel)
export async function getRandomBooks(): Promise<Book[]> {
    try {
      const response = await API.get("/api/books");
      const books: Book[] = Array.isArray(response.data.books)
        ? response.data.books
        : [];
      // Get 5 random items
      const randomBooks = getRandomItems(books, 8);
      return randomBooks;
    } catch (error) {
      console.error("Error fetching random books:", error);
      return [];
    }
  }
  
  // Helper function to select random items from an array.
  function getRandomItems(arr: Book[], count: number): Book[] {
    if (!Array.isArray(arr) || arr.length === 0) {
      console.warn("getRandomItems received invalid array:", arr);
      return [];
    }
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  // Optionally, if you are using static generation for dynamic routes, you can add:
  export async function generateStaticParams() {
    const books = await getBooks(); // Assumes getBooks exists
    return books.map((book) => ({ id: book.id }));
  }
  
  // Dummy getBooks function – replace with your actual implementation.
  async function getBooks(): Promise<Book[]> {
    try {
      const response = await API.get("/api/books");
      return response.data.books;
    } catch (error) {
      console.error("Error fetching books:", error);
      return [];
    }
  }
  