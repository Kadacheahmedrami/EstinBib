import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Layers, Check, X, ArrowRight } from "lucide-react";
import { BaseBook } from "@/types/_types";

const BookCard = ({ id, title, author, description, size, available, coverImage }: BaseBook) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/catalog/${id}`);
  };

  return (
    <div
      className="bg-white rounded-2xl  shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex flex-col"
      onClick={handleClick}
    >
      {/* Book Cover */}
      <div className="relative w-full h-[300px] md:h-[350px] border-b rounded-t-2xl overflow-hidden">
      <Image
        src={coverImage || "/default-book.jpg"}
        alt={title || "cover"}
        layout="fill"
        objectFit="cover"
        objectPosition="top"
        className="transition-transform duration-300 group-hover:scale-110 group-hover:object-top"
        priority
      />
        {/* Availability Badge */}
        <span className={`absolute top-4 left-4 px-3 py-1 text-sm font-semibold rounded-full ${available ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {available ? <Check size={16} className="inline-block mr-1" /> : <X size={16} className="inline-block mr-1" />}
          {available ? "Available" : "Not Available"}
        </span>
      </div>
      
      {/* Book Details */}
      <div className="p-6 flex flex-col gap-3 text-center">
        <h2 className="text-xl font-bold text-gray-900 truncate md:text-2xl">{title}</h2>
        <div className="flex items-center justify-center text-gray-600 text-sm md:text-base">
          <User size={20} className="mr-2 text-gray-700" />
          <span className="font-medium text-gray-900">{author}</span>
        </div>
        <p className="text-gray-600 text-sm md:text-base line-clamp-3">{description}</p>
        <div className="flex items-center justify-center text-gray-600">
          <Layers size={20} className="mr-2 text-gray-700" />
          <span className="font-medium text-gray-900">{size} Pages</span>
        </div>
        {/* More Details Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/catalog/${id}`);
          }}
          className="mt-4 w-full text-lg border border-red-500 rounded-xl py-3 px-6 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 font-semibold"
        >
          More Details <ArrowRight size={22} className="inline-block ml-2" />
        </button>
      </div>
    </div>
  );
};

export default BookCard;
