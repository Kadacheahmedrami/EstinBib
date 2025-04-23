import Link from "next/link";
import HeroLanding from "@/components/pages/home/HeroLanding";
import RelatedBooks from "@/components/RelatedBooks";
import { getMostBorrowedBooks, getRecentBooks } from "@/app/actions/books";
import Footer from '@/components/Footer';

export default async function Home() {
  const newBooks = await getRecentBooks();
  const mostBorrowedBooks = await getMostBorrowedBooks();

  return (
    <>
      <main>
        <HeroLanding />

        {/* "What's New?" Section */}
        <div className="flex justify-between items-center ml-[4%] mt-20">
          <h2 className="text-[50px] font-bold text-[#F1413E]">
            What&apos;s New?
          </h2>
          <Link
            href="/catalog"
            className="flex items-center font-bold text-3xl text-[#F1413E] m-8 transition-transform hover:scale-105"
          >
            See All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-2 h-12 w-12 text-[#F1413E]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {/* Circle */}
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              {/* Right Arrow */}
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 8l4 4-4 4"
              />
            </svg>
          </Link>
        </div>
        <div className="bg-[#EAF2EF] py-8 mb-20">
          <RelatedBooks
            containerId="book-container-1"
            books={newBooks}
            scrollButtonType={2}
          />
        </div>

        {/* "Most Borrowed" Section */}
        <div className="flex justify-between items-center ml-[4%] my-4">
          <h2 className="text-[50px] font-bold text-[#F1413E]">
            Most Borrowed
          </h2>
          <Link
            href="/catalog"
            className="flex items-center font-bold text-3xl text-[#F1413E] m-8 transition-transform hover:scale-105"
          >
            See All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-2 h-12 w-12 text-[#F1413E]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {/* Circle */}
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              {/* Right Arrow */}
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 8l4 4-4 4"
              />
            </svg>
          </Link>
        </div>
        <div className="bg-[#EAF2EF] py-8">
          <RelatedBooks
            containerId="book-container-2"
            books={mostBorrowedBooks}
            scrollButtonType={2}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
