"use server";
import { db } from "@/db";
import { eq, desc, isNull, and } from "drizzle-orm";
import { users, borrows, books } from "@/db/schema";
import { getServerAuthSession } from "@/lib/auth";

export async function getUserInfo() {
  const session = await getServerAuthSession();
  if (!session || !session.user.email) {
    return null;
  }
  const [result] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
    })
    .from(users)
    .where(eq(users.email, session.user.email));

  if (!result) {
    return null;
  }
  return result;
}

export async function getActiveBorrows() {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("User not authenticated");
  }

  return await db
    .select({
      id:books.id,
      title: books.title,
      borrowedAt: borrows.borrowedAt,
      dueDate: borrows.dueDate,
      coverImage: books.coverImage,
      description: books.description,
    })
    .from(borrows)
    .innerJoin(books, eq(borrows.bookId, books.id))
    .where(and(eq(borrows.userId, session.user.id), isNull(borrows.returnedAt)))
    .orderBy(desc(borrows.borrowedAt));
}

export async function borrowsHistory() {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("User not authenticated");
  }

  return await db
    .select({
      id:books.id,
      title: books.title,
      borrowedAt: borrows.borrowedAt,
      dueDate: borrows.dueDate,
      returnedAt: borrows.returnedAt,
      coverImage: books.coverImage,
      description: books.description,
    })
    .from(borrows)
    .innerJoin(books, eq(borrows.bookId, books.id))
    .where(eq(borrows.userId, session.user.id))
    .orderBy(desc(borrows.borrowedAt));
}
