"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import Image from "next/image";
import { suggestBook } from "@/app/actions/forms";

interface BookData {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  releaseYear: string;
  coverUrl?: string;
}

interface FormErrors {
  isbn?: string;
  title?: string;
  auth?: string;
}

interface Author {
  name?: string;
}

interface BookInfo {
  title?: string;
  authors?: (Author | string)[];
  publishers?: Array<{ name: string }>;
  publisher?: string;
  publish_date?: string;
  publishedDate?: string;
  cover?: {
    medium?: string;
  };
  imageLinks?: {
    thumbnail?: string;
  };
}

export function ContactForm() {
  const [formData, setFormData] = useState<BookData>({
    isbn: "",
    title: "",
    author: "",
    publisher: "",
    releaseYear: "",
    coverUrl: undefined,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [bookFound, setBookFound] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required";
    if (!formData.title.trim()) newErrors.title = "Book title is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const searchBookByISBN = async () => {
    const cleanIsbn = formData.isbn.replace(/[-\s]/g, "").trim();
    if (!cleanIsbn) {
      setErrors(prev => ({ ...prev, isbn: "ISBN is required for lookup" }));
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    try {
      // Try OpenLibrary first
      const res = await fetch(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&format=json&jscmd=data`
      );
      const data = await res.json();
      const key = `ISBN:${cleanIsbn}`;
      let bookInfo: BookInfo = data[key];

      // If no results from OpenLibrary, try Google Books
      if (!bookInfo) {
        console.log("No results from OpenLibrary, trying Google Books...");
        const gRes = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`
        );
        const gData = await gRes.json();
        
        if (gData.items && gData.items.length > 0) {
          const volumeInfo = gData.items[0].volumeInfo;
          bookInfo = {
            title: volumeInfo.title,
            authors: volumeInfo.authors || [],
            publisher: volumeInfo.publisher,
            publishedDate: volumeInfo.publishedDate,
            imageLinks: {
              thumbnail: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:')
            }
          };
        }
      }

      if (bookInfo) {
        console.log("Book found:", bookInfo);
        let coverUrl = bookInfo.cover?.medium || bookInfo.imageLinks?.thumbnail;
        
        // Ensure the URL uses HTTPS and handle Google Books URL patterns
        if (coverUrl) {
          coverUrl = coverUrl.replace('http:', 'https:');
          // Handle special cases for Google Books URLs
          if (coverUrl.includes('&edge=curl')) {
            coverUrl = coverUrl.replace('&edge=curl', '');
          }
          if (coverUrl.includes('zoom=1')) {
            coverUrl = coverUrl.replace('zoom=1', 'zoom=0');
          }
          console.log("Cover URL:", coverUrl);
        }

        setFormData({
          isbn: cleanIsbn,
          title: bookInfo.title || "",
          author: bookInfo.authors ? 
            bookInfo.authors.map(a => 
              typeof a === 'string' ? a : a.name || ''
            ).join(", ") : "",
          publisher: bookInfo.publishers ? bookInfo.publishers[0]?.name : bookInfo.publisher || "",
          releaseYear: (bookInfo.publish_date || bookInfo.publishedDate || "").slice(0, 4),
          coverUrl: coverUrl,
        });
        setBookFound(true);
      } else {
        console.log("No book found for ISBN:", cleanIsbn);
        setSearchError("No book found. Check ISBN and try again.");
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("Failed to search. Please try later.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      await suggestBook(formData.title, formData.author);
      setIsSubmitted(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      setSubmissionError(msg);
      if (msg === "User not authenticated") {
        setErrors(prev => ({ ...prev, auth: "Please sign in to suggest a book." }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ isbn: "", title: "", author: "", publisher: "", releaseYear: "", coverUrl: undefined });
    setBookFound(false);
    setIsSubmitted(false);
    setSearchError(null);
    setSubmissionError(null);
    setErrors({});
  };

  return (
    <>
      {/* Submission Modal */}
       {/* Custom Modal */}
       {isSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white max-w-2xl rounded-[15px] mx-4 animate-fade-in">
            <Image
              className="mb-[-120px] relative bottom-[120px]"
              height={200}
              width={140}
              alt="suggestion"
              src="/svg/pretty.svg"
            />
            <div className="w-full bg-white m-auto p-6 rounded-[15px]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-6 max-w-xl">
                  <h1 className="text-[#0A2942] text-4xl font-extrabold leading-tight">
                    Your Suggestion Has Been
                    <br />
                    Sent!
                  </h1>
                  <p className="text-gray-600 text-lg sm:text-xl">
                    Our team will review your suggestion and consider adding it to our collection. A responsible team
                    member will get back to you soon. Please check your email for updates.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => (window.location.href = "/")}
                      className="px-6 md:w-1/2 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      ← Return to Home
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-6 md:w-1/2 py-3 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all duration-200"
                    >
                      Suggest Another
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-[#0A2942] text-4xl font-bold mb-4">
            Suggest{' '}
            <span className="relative inline-block">
              A Book
              <span
                className="absolute inset-x-0 bottom-0 h-3 -z-10"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', transform: 'translateY(2px)' }}
              />
            </span>
          </h1>
          <p className="text-gray-700 text-lg">
            If there is a book you d love to see on our shelves but don t see it listed, fill out this form.
          </p>
        </div>

        {errors.auth && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            <p>{errors.auth}</p>
            <a href="/login" className="text-red-500 hover:underline">Sign in</a>
          </div>
        )}
        {submissionError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {submissionError}
          </div>
        )}

        {/* ISBN Lookup */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-[#0A2942] text-xl font-semibold mb-3">Find by ISBN</h2>
          <div className="flex gap-3">
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="1101872055"
              className={`flex-1 px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-400 ${errors.isbn ? 'border-red-500' : 'border-gray-300'}`}
            />
            <button
              type="button"
              onClick={searchBookByISBN}
              disabled={isSearching}
              className={`px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition ${isSearching ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
          {searchError && <p className="mt-2 text-red-500">{searchError}</p>}
          <p className="mt-2 text-sm text-gray-500">Powered by Open Library & Google Books</p>
        </div>

        {/* Preview */}
        {bookFound && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm flex gap-4">
            {formData.coverUrl && (
              <div className="relative w-24 h-36">
                <Image
                  src={formData.coverUrl}
                  alt={formData.title}
                  fill
                  className="rounded-md object-cover"
                  sizes="96px"
                />
              </div>
            )}
            <div>
              <h3 className="text-[#0A2942] text-lg font-semibold">{formData.title}</h3>
              <p className="text-gray-700">By {formData.author || 'Unknown'}</p>
              <p className="text-gray-600">Publisher: {formData.publisher || 'N/A'}</p>
              <p className="text-gray-600">Year: {formData.releaseYear || 'N/A'}</p>
              <p className="text-gray-600">ISBN: {formData.isbn}</p>
            </div>
          </div>
        )}

        {/* Suggestion Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">ISBN <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-400 ${errors.isbn ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.isbn && <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-400 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Author(s)</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Publisher</label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Release Year</label>
            <input
              type="text"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-md transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Sending...' : bookFound ? 'Suggest This Book →' : 'Send →'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-gray-500 text-sm"><span className="text-red-500">*</span> Required fields</p>
      </div>
    </>
  );
}
