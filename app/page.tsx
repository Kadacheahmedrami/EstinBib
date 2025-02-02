/* eslint-disable @typescript-eslint/no-explicit-any */
import HeroLanding from "@/components/HeroLanding";
import RelatedBooks from "@/components/RelatedBooks";
import { getMostBorrowedBooks, getRecentBooks } from "@/app/actions/books";
// Map BorrowedBook to BookPreviewProps
const mapBooksToPreviewProps = (books: any[]) => {
  return books.map((book) => ({
    title: book.title,
    description: book.description,
    imageUrl: book.coverImage,
  }));
};

export default async function Home() {
  const newBooks = await getRecentBooks();
  const mostBorrowedBooks = await getMostBorrowedBooks();

  return (
    <main>
      <HeroLanding />
      <h2 className="ml-[4%] my-4 text-[50px] font-bold text-[#F1413E]">
        What s New?
      </h2>
      <RelatedBooks
        containerId="book-container-1"
        books={mapBooksToPreviewProps(newBooks)}
      />

      <h2 className="ml-[4%] my-4 text-[50px] font-bold text-[#F1413E]">
        Most Borrowed
      </h2>
      <RelatedBooks
        containerId="book-container-2"
        books={mapBooksToPreviewProps(mostBorrowedBooks)}
      />
    </main>
  );
}
