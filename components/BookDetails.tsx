import Image from "next/image";
import {
  Book as BookIcon,
  User,
  Layers,
  Clock,
  Globe,
  Link as LinkIcon,
} from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  description: string;
  coverImage: string;
  size: number;
  available: boolean;
  publishedAt: Date | null;
  addedAt: Date;
  language: string;
}

export default function BookDetails({ book }: { book: Book }) {
  // Format the publication date

  // console.log("book details =========",book)

  return (
    <div className="bg-white rounded-2xl mx-auto overflow-hidden flex justify-center my-6 md:mx-8 md:my-10">
      <div className="flex flex-col md:flex-row h-full">
        {/* Book Image Section */}
        <div className="md:w-1/3 relative h-64 md:h-auto">
          <Image
            src={"/default-book.jpg"} // Use coverImage from the data  book.coverImage
            alt={"cover"}
            height={400}
            width={480}
            className="m-auto"
          />
        </div>

        {/* Book Details Section */}
        <div className="md:w-2/3 p-6 md:p-8 overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <BookIcon className="h-5 w-5 md:h-6 md:w-6" />
              <span className="text-sm md:text-lg font-semibold uppercase tracking-wide">
                {/* book.category is not available in the Book type */}
                {/* {book.category || 'General'} */}
                General
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              {book.title}
            </h1>

            {/* Book Details in Column Layout */}
            <div className="space-y-3 md:space-y-4 text-base md:text-xl text-gray-700">
              <div className="flex items-center">
                <User className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3" />
                <span>Author: {book.author}</span>
              </div>
              <div className="flex items-center">
                <Layers className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3" />
                <span>Pages: {book.size}</span> {/* Use size for pages */}
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3" />
                <span>
                  Published on: {book.publishedAt?.toDateString()}
                </span>{" "}
                {/* Use formatted publication date */}
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3" />
                <span>Language: {book.language}</span>
              </div>

              {/* The following line is commented because `book.publisher` does not exist in the Book type */}
              {/* <div className="flex items-center">
                <Calendar className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3" />
                <span>Publisher: {book.publisher}</span>
              </div> */}

              <div className="flex items-center">
                <LinkIcon className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3" />
                <span>ISBN: {book.isbn}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="prose prose-base md:prose-lg max-w-none mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed">{book.description}</p>
          </div>

          {/* Custom PDF Button */}
          {/* The pdfUrl field does not exist in the Book type, so we don't include it */}
          {/* {book.pdfUrl && (
            <button className="relative h-12 w-[55%] font-bold text-[24px] overflow-hidden border border-[#F1413E] text-white hover:text-[#F1413E] rounded-[10px] shadow-2xl transition-all duration-200 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-sm bg-[#F1413E] before:bg-white before:duration-300 before:ease-out hover:shadow-[0_4px_20px_#F1413E] hover:before:h-40 hover:before:w-[100%] hover:before:opacity-100">
              <Link href={book.pdfUrl} passHref>
                <a target="_blank" rel="noopener noreferrer" className="relative z-1">
                  Check Pdf
                </a>
              </Link>
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
}
