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
    <div className="bg-[#F5F8F7] w-full rounded-2xl shadow-lg p-6  max-w-[600px] min-h-[600px] mx-auto my-8 transition-all duration-500">
      {/* Book Title */}
      <h2 className=" text-lg w-full md:text-xl lg:text-3xl font-semibold text-center mb-6 sm:mb-10 text-gray-800 tracking-tight">
        “{title}”
      </h2>

      {/* Book Content Wrapper */}
      <div className="flex flex-col  sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
        {/* Book Cover Image */}
        <div className="relative w-[100%] sm:w-[350px] h-[350px] sm:h-[420px] rounded-lg overflow-hidden">
          <Image
            src={coverImage}
            alt={`Cover of ${title}`}
            width={600}
            height={480}
            className="object-cover w-full h-full"
            priority
          />
        </div>

        {/* Book Information */}
        <div className="flex flex-col justify-between sm:h-[420px] w-full sm:w-[300px]">
          <p className="flex flex-col">
            <span className="text-lg font-semibold">Date Borrowed:</span>
            <span className="text-gray-600">{dateBorrowed || "N/A"}</span>
          </p>

          <p className="flex flex-col mt-2">
            <span className="text-lg font-semibold">Due Date:</span>
            <span className="text-gray-600">{dueDate}</span>
          </p>

          <p className="flex flex-col mt-2">
            <span className="text-lg font-semibold">Status:</span>
            <span className={`font-semibold text-lg ${isOverdue ? "text-red-600" : "text-green-600"}`}>
              {status}
            </span>
          </p>

          {/* Action Button (Renew or View More) */}
          <div className="mt-6 w-full">
            {actionType === "viewMore" ? (
              <Link href={`/catalog/${id}`} className="ml-auto menu-link">
                <span>See Book Details</span> <span className="font-bold">&#8594;</span>
              </Link>
            ) : (
              <button
                className="py-3 px-6 w-full text-[#F1413E] border-[#F1413E] border-2 rounded-lg hover:bg-[#F1413E] hover:text-white hover:font-bold transition duration-300"
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
