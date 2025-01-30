"user server";
import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
export async function getUserInfo() {
  const session = await getServerAuthSession();
  if (!session || !session.user.email) {
    return null;
  }
  const result = await db.user.findUnique({
    where: { email: session.user.email },
  });
  if (!result) {
    return null;
  }
  return {
    id: result.id,
    name: result.name,
    email: result.email,
    image: result.image,
  };
}
export async function getActiveBorrows() {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("User not authenticated");
  }
  const activeBorrows = await db.borrow.findMany({
    where: {
      userId: session.user.id,
      returnedAt: null,
    },
    select: {
      id: true,
      borrowedAt: true,
      dueDate: true,
      book: {
        select: {
          title: true,
          coverImage: true,
        },
      },
    },
    orderBy: {
      borrowedAt: "desc",
    },
  });
  return activeBorrows;
}

export async function borrowsHistory() {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("User not authenticated");
  }
  const borrowsHistory = await db.borrow.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      book: {
        select: {
          title: true,
          coverImage: true,
        },
      },
      borrowedAt: true,
      dueDate: true,
      returnedAt: true,
    },
    orderBy: {
      borrowedAt: "desc",
    },
  });
  return borrowsHistory;
}
