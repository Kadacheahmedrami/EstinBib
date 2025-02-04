import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Layers, Check, X } from "lucide-react";
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
      <div className="relative w-full aspect-[1/1.4142] border-b rounded-t-2xl overflow-hidden">
      <Image
        src={coverImage || "/default-book.jpg"}
        alt={title || "cover"}
        layout="fill"
        // objectFit="cover"
        objectPosition="top"
        className="transition-transform duration-300 group-hover:scale-110  object-contain"
        priority
      />
        {/* Availability Badge */}
        <span className={`absolute top-4 left-4 px-3 py-1 text-sm font-semibold rounded-full ${available ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {available ? <Check size={16} className="inline-block mr-1" /> : <X size={16} className="inline-block mr-1" />}
          {available ? "Available" : "Not Available"}
        </span>
      </div>
      
      {/* Book Details */}
      <div className="p-4 flex flex-col gap-3 text-start">
        <h2 className="text-xl font-bold text-gray-900 truncate md:text-xl">{title}</h2>
        <div className="flex justify-between flex-row w-full" >
        <div className="flex items-center gap-[2px]  justify-start text-gray-600 ">
          <User size={15} className=" text-gray-700" />
          <span className="font-normal line-clamp-1  text-gray-900">{author}</span>
        </div>
        <div className="flex items-center  justify-end text-gray-600">
          <Layers size={15} className=" text-gray-700" />
          <span className="font-normal line-clamp-1 text-gray-900">{size} </span>
        </div>
        </div>
       
        <p className="text-gray-600  text-sm md:text-base line-clamp-3">{description}</p>
    
        {/* More Details Button */}
  
      </div>
    </div>
  );
};

export default BookCard;
