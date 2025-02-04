import Image from "next/image";

import {
  Book as BookIcon,
  User,
  Layers,
  Clock,
  Globe,
  Link as LinkIcon,
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
}

export default function BookDetails({ book }: { book: Book }) {
  return (
    <main className="bg-[#F7F6F6] py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <article className=" rounded-2xl  overflow-hidden flex flex-col md:flex-row">
          {/* Book Image Section */}
          <section className="md:w-1/3 relative h-64 md:h-auto">
            <Image
              src={book.coverImage || "/default-book.jpg"}
              alt={`Cover of the book ${book.title}`}
               layout="fill"
              className="object-contain w-full h-full"
            />
          </section>

          {/* Book Details Section */}
          <section className="md:w-2/3 p-6 md:p-8 flex flex-col justify-between">
            <header>
              {/* Category Tag */}
              <div className="flex items-center gap-2 text-red-600 mb-3">
                <BookIcon className="h-6 w-6" />
                <span className="text-sm md:text-lg font-semibold uppercase tracking-wide">
                  {book.categories?.length > 0 ? book.categories[0].name : "General"}
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
                  <span>
                    <strong>Published on:</strong>{" "}
                    {book.publishedAt ? book.publishedAt.toDateString() : "Unknown"}
                  </span>
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
                  <LinkIcon className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                  <span>
                    <strong>Category :</strong>    {book.categories?.length > 0 ? book.categories[0].name : "Unknown"}
                  </span>
                </li>
                <li className="flex items-center">
                  <LinkIcon className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                  <span>
                    <strong>ISBN:</strong>     <span className={` text-white p-1 ml-2 font-bold rounded-xl px-4 ${book.available ? "bg-green-400" : "bg-red-400"}`}>
                      {book.available ? "Available" : "Not Available"}
                    </span>
                  </span>
                </li>
              </ul>
            </header>

            {/* Description Section */}
            <section className="mt-6">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">{book.description}</p>
            </section>

            {/* Additional Info & Action */}
        
                <button >
                  <a
                   href="/pdf" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center  m-4 w-full justify-center px-6 py-3 border border-red-500 text-red-500 font-bold rounded-xl transition-colors hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    Check PDF
                  </a>
                </button>
           
          </section>
        </article>
      </div>
    </main>
  );
}
