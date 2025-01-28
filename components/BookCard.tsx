import React from 'react';
import Image from "next/image";

interface BookCardProps {
  title: string;
  author: string;
  category: string;
  description: string;
  pages: number;
  isAvailable: boolean;
  imageUrl: string; // This will now be the path relative to the `public` folder
}

const BookCard = ({
  title,
  author,
  category,
  description,
  pages,
  isAvailable,
  imageUrl
}: BookCardProps) => {
  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg p-6 flex gap-8">
      {/* Left side - Book Image */}
      <div className="w-72 h-96 flex-shrink-0">
        <Image
          height={300}
          width={300}
          src={imageUrl as string} // Path relative to the `public` folder
          alt={title}
          className="w-full h-full object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Right side - Book Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">By:</span>
              <span className="text-gray-900">{author}</span>
              <span className="text-gray-600 ml-4">In:</span>
              <span className="text-gray-900">{category}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-600">Description:</h3>
            <p className="text-gray-800">{description}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Size:</span>
              <span className="text-gray-900">{pages} Pages</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Availability:</span>
              <span className={`${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                {isAvailable ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
            Reserve
          </button>
          
          <button className="flex items-center text-red-500 hover:text-red-600 transition-colors">
            See More Info
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;