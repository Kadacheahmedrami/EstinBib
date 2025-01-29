"use server ";
import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

export const suggestBook = async (title: string, author: string) => {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("User not authenticated");
  }
  return await db.bookRequest.create({
    data: {
      title,
      author,
      userId: session.user.id,
    },
  });
};

export const contactUs = async (
  name: string,
  email: string,
  message: string
) => {
  return await db.contact.create({
    data: {
      name,
      email,
      message,
    },
  });
};
