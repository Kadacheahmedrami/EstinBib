import React from "react";
import Image from "next/image";
import { BorrowedBook } from "@/types/_types";
import Link from "next/link"; // Import Link for navigation
import '../hover.css';
interface BookCardProps extends BorrowedBook {
  actionType: "renew" | "viewMore";
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  dateBorrowed,
  dueDate,
  status,
  coverImage,
  actionType,
}) => {
  const isOverdue = status.toLowerCase() === "overdue";

  return (
    <div className="bg-[#F5F8F7] rounded-2xl shadow-lg p-10 w-[600px] h-[600px] mx-auto transform my-8 transition-all duration-500">
      <h2 className="text-3xl h-[50px] font-semibold text-center mb-10 sm:mb-12 text-gray-800 tracking-tight">
        “{title}”
      </h2>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12">
        {/* Book Cover Image */}
        <div className="relative w-[300px] h-[420px] overflow-hidden rounded-lg">
          <Image
            src={coverImage}
            alt={title}
            width={600} // Width of the image
            height={480} // Height of the image
            className="object-cover w-full h-full" // This ensures the image fills the div and maintains aspect ratio
          />
        </div>

        {/* Book Information */}
        <div className="flex flex-col mt-auto justify-between h-[420px] items-start pl-16 w-[300px]">
          <p className="flex flex-col items-start">
            <span className="text-[24px] font-semibold">Date Borrowed:</span>
            <span className="text-gray-600">{dateBorrowed ? dateBorrowed : "N/A"}</span>
          </p>
          <p className="flex flex-col items-start">
            <span className="text-[24px] font-semibold">Due Date:</span>
            <span className="text-gray-600">{dueDate}</span>
          </p>
          <p className="flex flex-col items-start">
            <span className="text-[24px] font-semibold">Status:</span>
            <span
              className={`font-semibold text-xl ${
                isOverdue ? "text-red-600" : "text-green-600"
              }`}
            >
              {status}
            </span>
          </p>

          {/* Action Button (Renew or View More) */}
          <div className="mt-6 w-full flex justify-end ml-auto">
            {actionType === "viewMore" ? (
              <Link
                className="menu-item menu-link"
                href={`/catalog/${id}`}
              >
                <span className="mr-2">See Book Details </span>
                <span className="font-bold">&#8594;</span> {/* Bold left arrow */}
              </Link>
            ) : (
              <button
                className="py-3 px-6 ml-auto rounded-lg border-solid w-full text-[#F1413E] hover:bg-[#F1413E] hover:text-white hover:font-bold border-[#F1413E] border-[1px] hover:scale-105 transition duration-300"
                aria-label="Renew Book"
              >
                Renew
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
