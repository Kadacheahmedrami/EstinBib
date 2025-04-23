// app/actions.ts
"use server";
import { db } from "@/db";
import { getServerAuthSession } from "@/lib/auth";
import { bookRequests, contacts, ideas } from "@/db/schema";

export const suggestBook = async (title: string, author: string) => {
  const session = await getServerAuthSession();
  if (!session) throw new Error("User not authenticated");

  await db.insert(bookRequests).values({
    title,
    author,
    userId: session.user.id,
  });
  return { success: true };
};

export const contactUs = async (
  name: string,
  email: string,
  message: string
) => {
  await db.insert(contacts).values({
    name,
    email,
    message,
  });
  return { success: true };
};

export const suggestIdea = async (idea: string) => {
  const session = await getServerAuthSession();
  if (!session) throw new Error("User not authenticated");

  // enforce 500-character limit
  if (idea.length > 500) {
    throw new Error("Idea must be 500 characters or fewer");
  }

  await db.insert(ideas).values({
    idea,
    userId: session.user.id,
  });
  return { success: true };
};
