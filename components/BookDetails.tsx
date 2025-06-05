import Image from "next/image";
import Link from "next/link";

import {
  Book as BookIcon,
  User,
  Layers,
  Clock,
  Globe,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

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
  categories: Category[];
  pdfUrl?: string;
}

interface BookDetailsProps {
  book: Book;
}

export default function BookDetails({ book }: BookDetailsProps) {
  const primaryCategory =
    book.categories && book.categories.length > 0
      ? book.categories[0].name
      : "General";

  // Check if PDF is available
  const isPdfAvailable = book.pdfUrl && book.pdfUrl !== "none";

  return (
    <main className="bg-[#F7F6F6] py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <article className="rounded-2xl overflow-hidden flex flex-col md:flex-row">
          {/* Book Image Section */}
          <section className="relative md:w-1/3 my-auto h-[45vh]">
            <Image
              src={book.coverImage || "/default-book.jpg"}
              alt={`Cover of the book "${book.title}"`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </section>

          {/* Book Details Section */}
          <section className="md:w-2/3   p-6 md:p-8 flex flex-col justify-between">
            <header>
              {/* Category Tag */}
              <div className="flex items-center gap-2 text-red-600 mb-3">
                <BookIcon className="h-6 w-6" />
                <span className="text-sm md:text-lg font-semibold uppercase tracking-wide">
                  {primaryCategory}
                </span>
              </div>

              {/* Book Title */}
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                {book.title}
              </h1>

              {/* Book Metadata */}
              <ul className="space-y-3 md:space-y-4 text-base md:text-xl text-gray-700">
                <li className="flex items-center">
                  <User className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                  <span>
                    <strong>Author:</strong> {book.author}
                  </span>
                </li>
                <li className="flex items-center">
                  <Layers className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                  <span>
                    <strong>Pages:</strong> {book.size}
                  </span>
                </li>
                <li className="flex items-center">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                  <time dateTime={book.publishedAt?.toISOString() || ""}>
                    <strong>Published on:</strong>{" "}
                    {book.publishedAt
                      ? book.publishedAt.toDateString()
                      : "Unknown"}
                  </time>
                </li>
                <li className="flex items-center">
                  <Globe className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                  <span>
                    <strong>Language:</strong> {book.language}
                  </span>
                </li>
                <li className="flex items-center">
                  <LinkIcon className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                  <span>
                    <strong>ISBN:</strong> {book.isbn || "N/A"}
                  </span>
                </li>
                <li className="flex items-center">
                  {book.available ? (
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 mr-2  " />
                  ) : (
                    <XCircle className="h-5 w-5 md:h-6 md:w-6 mr-2  " />
                  )}
                  <span>
                    <strong>Availability:</strong>{" "}
                    <span
                      className={`ml-2 p-1 rounded-xl px-4 font-bold text-white ${
                        book.available ? "bg-green-400" : "bg-red-400"
                      }`}
                    >
                      {book.available ? "Available" : "Not Available"}
                    </span>
                  </span>
                </li>
              </ul>
            </header>

            {/* Action Button */}
            <div className="mt-6">
              {isPdfAvailable ? (
                <Link href={`/catalog/${book.id}/pdf`} passHref>
                  <div
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-6 py-3 border border-red-500 text-red-500 font-bold rounded-xl transition-colors hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    Check PDF
                  </div>
                </Link>
              ) : (
                <div className="flex items-center justify-center w-full px-6 py-3 border border-gray-400 text-gray-500 font-bold rounded-xl bg-gray-100 cursor-not-allowed">
                  PDF will be available soon
                </div>
              )}
            </div>
          </section>
        </article>

        {/* Book Description Section */}
        <section className="mt-6 w-[90%] mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
            Description
          </h2>
          <p className="text-gray-600 line-clamp-3 leading-relaxed">
            {book.description} {book.description} {book.description}{" "}
            {book.description} {book.description} {book.description}{" "}
            {book.description} {book.description}
          </p>
        </section>
      </div>
    </main>
  );
}