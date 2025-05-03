// app/catalog/[id]/pdf/page.tsx
import React from "react";
import Link from "next/link";
import { bookDetails } from "@/app/actions/books";
import { Book } from "@/types/_types";
interface PageProps {
    params: Promise<{ id: string }>;
  }

export default async function PdfPage({ params }: PageProps) {
    const { id } = await params;

  // Fetch the book data (assumes bookDetails returns an object with an optional `pdfUrl` field)
  console.log(id)
  const book = await bookDetails(id);
    
  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center bg-white p-8 rounded-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Not Found</h1>
          <p className="text-gray-600 mb-6">The requested book could not be found.</p>
          <Link
            href="/catalog"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Use the book.pdfUrl if provided, otherwise fall back to a dummy PDF for demo
  const pdfUrl =
    (book as unknown as Book).pdfUrl ||
    "https://www.orimi.com/pdf-test.pdf";

  return (
    <div className=" bg-gray-50">
      <div className="mx-auto max-w-7xl p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {book.title} (PDF View)
        </h1>

        {/* Embed PDF in an iframe */}
        <div className="border rounded-lg overflow-hidden">
          <iframe
            src={pdfUrl}
            className="w-full h-[80vh]"
            title={`${book.title} PDF`}
          />
        </div>


      </div>
    </div>
  );
}
