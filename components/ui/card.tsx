"use client";

import React from "react";
import Image from "next/image";

import {BookProps1} from '@/types/_types'

const BookCard: React.FC<BookProps1> = ({
  title,
  dateBorrowed,
  dueDate,
  status,
  imageUrl,
}) => {
  const isOverdue = status.toLowerCase() === "overdue";

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm mx-auto">
      <h2 className="text-xl font-semibold text-center mb-4">“{title}”</h2>
      <div className="flex justify-center mb-4">
        <Image
          src={imageUrl}
          alt={title}
          width={120}
          height={160}
          className="rounded-lg"
        />
      </div>
      <div className="text-sm text-gray-700 space-y-2">
        <p className="flex justify-between">
          <span className="font-semibold">Date Borrowed:</span>
          <span>{dateBorrowed}</span>
        </p>
        <p className="flex justify-between">
          <span className="font-semibold">Due Date:</span>
          <span>{dueDate}</span>
        </p>
        <p className="flex justify-between items-center">
          <span className="font-semibold">Status:</span>
          <span
            className={
              isOverdue ? "text-red-600 font-bold" : "text-green-600 font-bold"
            }
          >
            {status}
          </span>
        </p>
      </div>
      <button
        className="mt-6 w-full py-2 px-4 text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition duration-300"
        aria-label="Renew Book"
      >
        Renew
      </button>
    </div>
  );
};

export default BookCard;
