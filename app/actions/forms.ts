"use server ";
import { db } from "@/db";
import { getServerAuthSession } from "@/lib/auth";
import { bookRequests, contacts } from "@/db/schema";
export const suggestBook = async (title: string, author: string) => {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("User not authenticated");
  }
  return await db.insert(bookRequests).values({
    title,
    author,
    userId: session.user.id,
  });
};

export const contactUs = async (
  name: string,
  email: string,
  message: string
) => {
  return await db.insert(contacts).values({
    name,
    email,
    message,
  });
};
