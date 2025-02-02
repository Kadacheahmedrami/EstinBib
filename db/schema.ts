import {
  pgTable,
  varchar,
  timestamp,
  text,
  boolean,
  integer,
  index,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// ===========================
// Enums
// ===========================

export const roleEnum = pgEnum("Role", ["STUDENT", "LIBRARIAN"]);

// ===========================
// Tables
// ===========================

/**
 * User table
 *
 * Maps to the Prisma model:
 *   model User { id, name, email, emailVerified, image, role, createdAt, updatedAt, ... }
 */
export const users = pgTable("user", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name"),
  email: varchar("email").notNull().unique(),
  emailVerified: timestamp("emailVerified"),
  image: varchar("image"),
  role: roleEnum("role").notNull().default("STUDENT"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

/**
 * Book table
 *
 * Maps to the Prisma model:
 *   model Book { id, title, author, isbn, description, coverImage, size, available, publishedAt,
 *                search_vector (unsupported), addedAt, language, categories, borrows }
 *
 * Note: The unsupported search_vector field is omitted.
 */
export const books = pgTable(
  "book",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    title: varchar("title").notNull(),
    author: varchar("author").notNull(),
    isbn: varchar("isbn").unique(),
    description: text("description"),
    coverImage: varchar("coverImage"),
    size: integer("size"),
    available: boolean("available").default(true),
    publishedAt: timestamp("publishedAt").notNull(),
    // Note: Prisma's unsupported search_vector field is not included here.
    addedAt: timestamp("addedAt").defaultNow(),
    language: varchar("language"),
  },
  (table) => [
    index("title_author_idx").on(table.title, table.author),
    index("available_idx").on(table.available),
    index("size_idx").on(table.size),
    index("published_at_idx").on(table.publishedAt),
  ]
);

/**
 * Book-Category join table
 *
 * Implements the many-to-many relation between Book and Category.
 */
export const bookCategories = pgTable("book_category", {
  bookId: varchar("book_id").references(() => books.id),
  categoryId: varchar("category_id").references(() => categories.id),
});

/**
 * Category table
 *
 * Maps to the Prisma model:
 *   model Category { id, name, books }
 */
export const categories = pgTable(
  "category",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: varchar("name").notNull().unique(),
  },
  (table) => [index("category_name_idx").on(table.name)]
);

/**
 * Borrow table
 *
 * Maps to the Prisma model:
 *   model Borrow { id, bookId, userId, borrowedAt, dueDate, returnedAt, ... }
 */
export const borrows = pgTable(
  "borrow",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    bookId: varchar("book_id").references(() => books.id),
    userId: varchar("user_id").references(() => users.id),
    borrowedAt: timestamp("borrowedAt").defaultNow(),
    dueDate: timestamp("dueDate").notNull(),
    returnedAt: timestamp("returnedAt"),
  },
  (table) => [
    index("borrow_book_id_idx").on(table.bookId),
    index("borrow_user_id_idx").on(table.userId),
    index("due_date_idx").on(table.dueDate),
  ]
);

/**
 * Book Request table
 *
 * Maps to the Prisma model:
 *   model BookRequest { id, userId, requestedAt, title, author, isbn, releasedAt }
 */
export const bookRequests = pgTable(
  "book_request",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: varchar("user_id").references(() => users.id),
    requestedAt: timestamp("requestedAt").defaultNow(),
    title: varchar("title").notNull(),
    author: varchar("author").notNull(),
    isbn: varchar("isbn"),
    releasedAt: timestamp("releasedAt"),
  },
  (table) => [
    index("book_request_user_id_idx").on(table.userId),
    index("requested_at_idx").on(table.requestedAt),
  ]
);

/**
 * Contact table
 *
 * Maps to the Prisma model:
 *   model contact { id, name, email, message, createdAt }
 *
 * Note: The table is named "contact" (singular) to match the Prisma model.
 */
export const contacts = pgTable("contact", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

/**
 * Account table
 *
 * Maps to the Prisma model:
 *   model Account { userId, type, provider, providerAccountId, refresh_token, access_token,
 *                   expires_at, token_type, scope, id_token, session_state, createdAt, updatedAt }
 */
export const accounts = pgTable(
  "account",
  {
    userId: varchar("userId").references(() => users.id),
    type: varchar("type").notNull(),
    provider: varchar("provider").notNull(),
    providerAccountId: varchar("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type"),
    scope: varchar("scope"),
    id_token: text("id_token"),
    session_state: varchar("session_state"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
  ]
);

/**
 * Verification Token table
 *
 * Maps to the Prisma model:
 *   model VerificationToken { identifier, token, expires }
 */
export const verificationTokens = pgTable(
  "verification_token",
  {
    identifier: varchar("identifier").notNull(),
    token: varchar("token").notNull(),
    expires: timestamp("expires").notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })]
);
