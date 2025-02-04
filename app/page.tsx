import HeroLanding from "@/components/HeroLanding";
import RelatedBooks from "@/components/RelatedBooks";
import { getMostBorrowedBooks, getRecentBooks } from "@/app/actions/books";
// Map BorrowedBook to BookPreviewProps
import Footer from '@/components/Foter'
export default async function Home() {
  const newBooks = await getRecentBooks();
  const mostBorrowedBooks = await getMostBorrowedBooks();

  return (
    <>
    <main className="">
      <HeroLanding />

      <h2 className="ml-[4%]  my-4  mt-20 text-[50px] font-bold text-[#F1413E]">
        What&apos;s New?
      </h2>
      <div className="bg-[#EAF2EF] py-8 mb-20">
      <RelatedBooks containerId="book-container-1" books={newBooks} scrollButtonType={2} />
      </div>




      <h2 className="ml-[4%] my-4 text-[50px] font-bold text-[#F1413E]">
        Most Borrowed
      </h2>
      <div className="bg-[#EAF2EF] py-8 ">
      <RelatedBooks containerId="book-container-2" books={mostBorrowedBooks} scrollButtonType={2} />
</div>
  

   
     
    </main>
    <Footer />
    </>
);
}
