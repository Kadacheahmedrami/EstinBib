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
      {/* Submission Modal - Enhanced Mobile */}
      {isSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg sm:max-w-2xl rounded-2xl sm:rounded-[15px] overflow-hidden animate-fade-in">
            {/* SVG Image - Hidden on mobile for better space usage */}
            <div className="hidden sm:block">
              <Image
                className="mb-[-120px] relative bottom-[120px]"
                height={200}
                width={140}
                alt="suggestion"
                src="/svg/pretty.svg"
                priority
              />
            </div>
            
            <div className="w-full bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[15px]">
              <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
                {/* Mobile-friendly heading */}
                <h1 className="text-[#0A2942] text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                  Your Suggestion Has Been Sent!
                </h1>
                
                <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-md sm:max-w-xl">
                  Our team will review your suggestion and consider adding it to our collection. A responsible team
                  member will get back to you soon. Please check your email for updates.
                </p>
                
                {/* Mobile-optimized buttons */}
                <div className="flex flex-col w-full space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center">
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                  >
                    ← Return to Home
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 font-medium"
                  >
                    Suggest Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-2xl mx-auto shadow-sm">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-[#0A2942] text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
            Suggest{' '}
            <span className="relative inline-block">
              A Book
              <span
                className="absolute inset-x-0 bottom-0 h-2 sm:h-3 -z-10"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', transform: 'translateY(2px)' }}
              />
            </span>
          </h1>
          <p className="text-gray-700 text-sm sm:text-base lg:text-lg px-2 sm:px-0">
            If there is a book you'd love to see on our shelves but don't see it listed, fill out this form.
          </p>
        </div>

        {/* Error Messages */}
        {errors.auth && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm sm:text-base">
            <p>{errors.auth}</p>
            <a href="/login" className="text-red-500 hover:underline font-medium">Sign in</a>
          </div>
        )}
        {submissionError && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm sm:text-base">
            {submissionError}
          </div>
        )}

        {/* ISBN Lookup Section */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg">
          <h2 className="text-[#0A2942] text-lg sm:text-xl font-semibold mb-3">Find by ISBN</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="Enter ISBN (e.g., 1101872055)"
              className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg border text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${errors.isbn ? 'border-red-500' : 'border-gray-300'}`}
            />
            <button
              type="button"
              onClick={searchBookByISBN}
              disabled={isSearching}
              className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium text-sm sm:text-base ${isSearching ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
          {searchError && <p className="mt-2 text-red-500 text-sm">{searchError}</p>}
          <p className="mt-2 text-xs sm:text-sm text-gray-500">Powered by Open Library & Google Books</p>
        </div>

        {/* Book Preview - Enhanced Mobile Layout */}
        {bookFound && (
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Book Cover */}
              {formData.coverUrl && (
                <div className="flex justify-center sm:justify-start">
                  <div className="relative w-20 h-28 sm:w-24 sm:h-36 flex-shrink-0">
                    <Image
                      src={formData.coverUrl}
                      alt={formData.title}
                      fill
                      className="rounded-md object-cover shadow-sm"
                      sizes="(max-width: 640px) 80px, 96px"
                    />
                  </div>
                </div>
              )}
              
              {/* Book Details */}
              <div className="flex-1 text-center sm:text-left space-y-1">
                <h3 className="text-[#0A2942] text-base sm:text-lg font-semibold leading-tight">{formData.title}</h3>
                <p className="text-gray-700 text-sm sm:text-base">By {formData.author || 'Unknown'}</p>
                <div className="text-gray-600 text-xs sm:text-sm space-y-0.5">
                  <p>Publisher: {formData.publisher || 'N/A'}</p>
                  <p>Year: {formData.releaseYear || 'N/A'}</p>
                  <p className="font-mono">ISBN: {formData.isbn}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* ISBN Field */}
          <div>
            <label className="block text-gray-700 mb-2 text-sm sm:text-base font-medium">
              ISBN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg border text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${errors.isbn ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter ISBN"
            />
            {errors.isbn && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.isbn}</p>}
          </div>

          {/* Title Field */}
          <div>
            <label className="block text-gray-700 mb-2 text-sm sm:text-base font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg border text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter book title"
            />
            {errors.title && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Author Field */}
          <div>
            <label className="block text-gray-700 mb-2 text-sm sm:text-base font-medium">Author(s)</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg border border-gray-300 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              placeholder="Enter author name(s)"
            />
          </div>

          {/* Publisher Field */}
          <div>
            <label className="block text-gray-700 mb-2 text-sm sm:text-base font-medium">Publisher</label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg border border-gray-300 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              placeholder="Enter publisher name"
            />
          </div>

          {/* Release Year Field */}
          <div>
            <label className="block text-gray-700 mb-2 text-sm sm:text-base font-medium">Release Year</label>
            <input
              type="text"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg border border-gray-300 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              placeholder="Enter publication year"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 sm:pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto sm:ml-auto block px-6 sm:px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium text-sm sm:text-base ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Sending...' : bookFound ? 'Suggest This Book →' : 'Send →'}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <p className="mt-6 sm:mt-8 text-gray-500 text-xs sm:text-sm">
          <span className="text-red-500">*</span> Required fields
        </p>
      </div>
    </>
  );
}