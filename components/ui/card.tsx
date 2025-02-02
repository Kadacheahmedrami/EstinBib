import React from "react";
import Image from "next/image";
import { BorrowedBook } from "@/types/_types";

const BookCard: React.FC<BorrowedBook> = ({
  title,
  dateBorrowed,
  dueDate,
  status,
  coverImage,
}) => {
  const isOverdue = status.toLowerCase() === "overdue";

  return (
    <div className="bg-[#F5F8F7] rounded-2xl shadow-lg p-8 w-full max-w-xl mx-auto transform my-8 transition-all duration-500 ">
      <h2 className="text-[28px] font-semibold text-center mb-8 text-gray-800 tracking-tight">
        “{title}”
      </h2>
      <div className="flex flex-row justify-between items-center mb-8">
        <div className="relative group">
          <Image
            src={coverImage}
            alt={title}
            width={250}
            height={350}
            className="rounded-lg object-cover transform scale-110  group-hover:scale-[1.1] transition duration-300"
          />
        </div>
        <div className="flex flex-col justify-between mx-auto space-y-6">
          <div className="text-[22px] text-gray-800 space-y-4">
            <p className="flex flex-col items-start">
              <span className="font-semibold">Date Borrowed:</span>
              <span className="text-gray-600">{dateBorrowed}</span>
            </p>
            <p className="flex flex-col items-start">
              <span className="font-semibold">Due Date:</span>
              <span className="text-gray-600">{dueDate}</span>
            </p>
            <p className="flex flex-col items-start">
              <span className="font-semibold">Status:</span>
              <span
                className={`font-semibold text-xl ${
                  isOverdue ? "text-red-600" : "text-green-600"
                }`}
              >
                {status}
              </span>
            </p>
          </div>
          <button
            className="mt-4 py-3 px-6 text-white bg-red-600 rounded-lg hover:bg-red-700 hover:scale-105 transition duration-300"
            aria-label="Renew Book"
          >
            Renew
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
