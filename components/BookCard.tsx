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
  coverImage,
}: BaseBook) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    redirect(`/catalog/${id}`);
  };

  return (
    <div
      className="md:ml-auto md:mr-[5%] border  md:w-[70%] sm:w-full z-0 bg-white rounded-3xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex flex-col h-full md:flex-row">
        {/* Left side - Book Image */}
        <div className="w-full md:w-2/5 relative">
          <div className="aspect-w-3 aspect-h-4 md:aspect-none md:h-full">
            <Image
              src={coverImage ? coverImage : "/default-book.jpg"}
              alt={title || "cover"}
              height={200}
              width={280}
              className="m-auto transition-opacity my-2 duration-300 hover:opacity-90"
              priority
            />
          </div>

          {/* Availability Badge */}
          <div className="absolute top-3 left-4 md:left-8 md:top-6 shadow border rounded-full bg-white text-sm font-semibold">
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
        <div className="flex-1 px-6 md:px-8  flex flex-col justify-between py-4">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 line-clamp-2">
              {title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
              <div className="flex items-center text-gray-600">
                <User size={18} className="mr-2" />
                <span className="font-medium text-gray-900">{author}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-md font-semibold text-gray-800 flex items-center">
                <FileText size={20} className="mr-2" /> Description
              </h3>
              <p className="text-gray-600 text-sm md:text-base line-clamp-3">
                {description}
              </p>
            </div>

            <div className="flex items-center text-gray-600">
              <Layers size={18} className="mr-2" />
              <span className="font-medium text-gray-900">{size} Pages</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end justify-between mt-6 gap-4">
            {/* Reserve Button */}
            {/* Add Reserve Button here if needed */}

            {/* More Details Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                redirect(`/catalog/${id}`);
              }}
              className="w-full ml-auto sm:w-auto text-[24px] border-solid border-[#F1413E] border-[2px] rounded-[10px] my-4 py-1 px-8 flex items-center justify-center text-red-500 hover:text-red-600 transition-colors duration-300 font-semibold"
            >
              More Details
              <ArrowRight size={30} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
