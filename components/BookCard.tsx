import React from "react";
import Image from "next/image";
import {
  User,
  ListIcon as Category,
  FileText,
  Layers,
  Check,
  X,
  ArrowRight,
} from "lucide-react";

interface BookCardProps {
  title: string;
  author: string;
  category: string;
  description: string;
  pages: number;
  isAvailable: boolean;
  imageUrl: string;
}

const BookCard = ({
  title,
  author,
  category,
  description,
  pages,
  isAvailable,
  imageUrl,
}: BookCardProps) => {
  return (
    <div className="w-full z-0 bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
      <div className="flex flex-col lg:flex-row">
        {/* Left side - Book Image */}
        <div className="w-full z-0 lg:w-2/5 lg:w-1/3 relative">
          <div className="aspect-w-3 aspect-h-4 lg:aspect-none lg:h-full">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              layout="fill"
              objectFit="cover"
              className="transition-opacity duration-300 hover:opacity-90"
            />
          </div>
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            {isAvailable ? (
              <span className="text-green-500 flex items-center">
                <Check size={16} className="mr-1" /> Available
              </span>
            ) : (
              <span className="text-red-500 flex items-center">
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
              <div className="flex items-center text-gray-600">
                <Category size={18} className="mr-2" />
                <span className="font-medium text-gray-900">{category}</span>
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
              <span className="font-medium text-gray-900">{pages} Pages</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <button className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 flex items-center justify-center font-semibold">
              Reserve Now
            </button>

            <button className="w-full sm:w-auto flex items-center justify-center text-red-500 hover:text-red-600 transition-colors duration-300 font-semibold">
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
