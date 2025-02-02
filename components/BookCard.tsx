import React from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  User,
  FileText,
  Layers,
  Check,
  X,
  ArrowRight,
} from "lucide-react";
import { BaseBook } from "@/types/_types";

const BookCard = ({
  id,
  title,
  author,
  description,
  size,
  available,
 
}: BaseBook) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Navigate to the book details page
    redirect(`/pages/catalog/${id}`);
  };

  return (
    <div
      className="lg:ml-auto lg:mr-[5%] border lg:w-[75%] lg:h-[480px] z-0 bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex flex-col h-full lg:flex-row">
        {/* Left side - Book Image */}
        <div className="w-full lg:w-2/5 relative">
          <div className="aspect-w-3 aspect-h-4 lg:aspect-none lg:h-full">
            <Image
              src={ "/default-book.jpg"} // {coverImage}
              alt={title || "cover"}
              height={200}
              width={280}
              className="m-auto transition-opacity my-2 duration-300 hover:opacity-90"
              priority
            />
          </div>

          {/* Availability Badge */}
          <div className="absolute top-10 left-20 shadow border rounded-full bg-white text-sm font-semibold">
            {available ? (
              <span className="text-white rounded-full px-3 py-1 bg-green-500 flex items-center">
                <Check size={16} className="mr-1" /> Available
              </span>
            ) : (
              <span className="text-white bg-red-500 rounded-full px-3 py-1 flex items-center">
                <X size={16} className="mr-1" /> Not Available
              </span>
            )}
          </div>
        </div>

        {/* Right side - Book Information */}
        <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 line-clamp-2">
              {title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-sm lg:text-base">
              <div className="flex items-center text-gray-600">
                <User size={18} className="mr-2" />
                <span className="font-medium text-gray-900">{author}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FileText size={20} className="mr-2" /> Description
              </h3>
              <p className="text-gray-600 text-sm lg:text-base line-clamp-3">
                {description}
              </p>
            </div>

            <div className="flex items-center text-gray-600">
              <Layers size={18} className="mr-2" />
              <span className="font-medium text-gray-900">{size} Pages</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            {/* Reserve Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Add your reserve logic here
              }}
              className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 flex items-center justify-center font-semibold"
            >
              Reserve Now
            </button>

            {/* More Details Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                redirect(`/pages/catalog/${id}`);
              }}
              className="w-full sm:w-auto flex items-center justify-center text-red-500 hover:text-red-600 transition-colors duration-300 font-semibold"
            >
              More Details
              <ArrowRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
