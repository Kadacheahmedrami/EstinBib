// app/actions.ts
"use server";
import { db } from "@/db";
import { getServerAuthSession } from "@/lib/auth";
import { bookRequests, contacts, ideas ,complaints} from "@/db/schema";

type ComplaintFormData = {
  title: string;
  description: string;
  isPrivate: boolean;
};
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



export const submitComplaint = async (data: ComplaintFormData) => {
  try {
    const session = await getServerAuthSession();
    if (!session) throw new Error("User not authenticated");

    // Validate complaint data
    const { title, description, isPrivate } = data;
    
    if (!title || title.trim() === "") {
      return { success: false, error: "Title is required" };
    }
    
    if (title.length > 100) {
      return { success: false, error: "Title must be 100 characters or fewer" };
    }
    
    if (!description || description.trim() === "") {
      return { success: false, error: "Description is required" };
    }
    
    // Insert the complaint
    await db.insert(complaints).values({
      userId: session.user.id,
      title,
      description,
      isPrivate: isPrivate !== undefined ? isPrivate : true,
      status: "PENDING",
    });
    
   
    
    return { success: true };
  } catch (error) {
    console.error("Failed to submit complaint:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to submit complaint"
    };
  }
};