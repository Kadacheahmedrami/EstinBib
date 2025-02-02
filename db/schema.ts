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

export const roleEnum = pgEnum("Role", ["STUDENT", "LIBRARIAN"]);

export const users = pgTable("user", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  emailVerified: timestamp("emailVerified"),
  image: varchar("image"),
  role: roleEnum("role").notNull().default("STUDENT"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const books = pgTable(
  "book",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    title: varchar("title").notNull(),
    author: varchar("author").notNull(),
    isbn: varchar("isbn").unique(),
    description: text("description").notNull(),
    coverImage: varchar("coverImage").notNull(),
    size: integer("size").notNull(),
    available: boolean("available").notNull().default(true),
    publishedAt: timestamp("publishedAt").notNull(),
    addedAt: timestamp("addedAt").notNull().defaultNow(),
    language: varchar("language").notNull(),
  },
  (table) => [
    index("title_author_idx").on(table.title, table.author),
    index("available_idx").on(table.available),
    index("size_idx").on(table.size),
    index("published_at_idx").on(table.publishedAt),
  ]
);

export const bookCategories = pgTable("book_category", {
  bookId: varchar("book_id")
    .notNull()
    .references(() => books.id),
  categoryId: varchar("category_id")
    .notNull()
    .references(() => categories.id),
});

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

export const borrows = pgTable(
  "borrow",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    bookId: varchar("book_id")
      .notNull()
      .references(() => books.id),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id),
    borrowedAt: timestamp("borrowedAt").notNull().defaultNow(),
    dueDate: timestamp("dueDate").notNull(),
    returnedAt: timestamp("returnedAt"),
  },
  (table) => [
    index("borrow_book_id_idx").on(table.bookId),
    index("borrow_user_id_idx").on(table.userId),
    index("due_date_idx").on(table.dueDate),
  ]
);

export const bookRequests = pgTable(
  "book_request",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id),
    requestedAt: timestamp("requestedAt").notNull().defaultNow(),
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

export const contacts = pgTable("contact", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: varchar("userId")
      .notNull()
      .references(() => users.id),
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
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
  ]
);

export const verificationTokens = pgTable(
  "verification_token",
  {
    identifier: varchar("identifier").notNull(),
    token: varchar("token").notNull(),
    expires: timestamp("expires").notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })]
);
