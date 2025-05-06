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
export const educationYearEnum = pgEnum("EducationYear", ["1CP", "2CP", "1CS", "2CS", "3CS"]);

export const users = pgTable("user", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  password: varchar("password"),
  emailVerified: timestamp("emailVerified"),
  image: varchar("image"),
  role: roleEnum("role").notNull().default("STUDENT"),
  nfcCardId: varchar("nfc_card_id").unique(),
  educationYear: educationYearEnum("education_year"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const bookTypeEnum = pgEnum("BookType", ["BOOK", "DOCUMENT", "PERIODIC", "ARTICLE"]);

export const books = pgTable(
  "book",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    title: varchar("title").notNull(),
    author: varchar("author").notNull(),
    isbn: varchar("isbn").unique(),
    barcode: varchar("barcode").unique(),
    description: text("description").notNull(),
    coverImage: varchar("coverImage").notNull(),
    pdfUrl: varchar("pdf_url"),
    size: integer("size").notNull(),
    available: boolean("available").notNull().default(true),
    publishedAt: timestamp("publishedAt").notNull(),
    addedAt: timestamp("addedAt").notNull().defaultNow(),
    language: varchar("language").notNull(),
    type: bookTypeEnum("type").notNull().default("BOOK"),
    periodicalFrequency: varchar("periodical_frequency"),
    periodicalIssue: varchar("periodical_issue"),
    articleJournal: varchar("article_journal"),
    documentType: varchar("document_type"),
  },
  (table) => [
    index("title_author_idx").on(table.title, table.author),
    index("available_idx").on(table.available),
    index("size_idx").on(table.size),
    index("published_at_idx").on(table.publishedAt),
    index("barcode_idx").on(table.barcode),
    index("type_idx").on(table.type),
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
    extensionCount: integer("extension_count").notNull().default(0),
  },
  (table) => [
    index("borrow_book_id_idx").on(table.bookId),
    index("borrow_user_id_idx").on(table.userId),
    index("due_date_idx").on(table.dueDate),
    index("extension_count_idx").on(table.extensionCount),
  ]
);

export const borrowExtensions = pgTable(
  "borrow_extension",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    borrowId: varchar("borrow_id")
      .notNull()
      .references(() => borrows.id),
    previousDueDate: timestamp("previous_due_date").notNull(),
    newDueDate: timestamp("new_due_date").notNull(),
    requestedAt: timestamp("requested_at").notNull().defaultNow(),
    approvedAt: timestamp("approved_at").notNull().defaultNow(),
    approvedBy: varchar("approved_by").references(() => users.id),
    reason: text("reason"),
  },
  (table) => [
    index("borrow_extension_borrow_id_idx").on(table.borrowId),
    index("borrow_extension_requested_at_idx").on(table.requestedAt),
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

export const ideas = pgTable(
  "idea",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    idea: varchar("idea", { length: 500 })
      .notNull(),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("createdAt")
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idea_user_id_idx").on(table.userId),
  ]
);

export const sndlDemandStatusEnum = pgEnum("sndl_demand_status", ["PENDING", "APPROVED", "REJECTED"]);

export const sndlDemands = pgTable(
  "sndl_demand",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id),
    requestReason: text("request_reason").notNull(),
    status: sndlDemandStatusEnum("status").default("PENDING"),
    sndlEmail: varchar("sndl_email"),
    sndlPassword: varchar("sndl_password"),
    adminNotes: text("admin_notes"),
    requestedAt: timestamp("requested_at").notNull().defaultNow(),
    processedAt: timestamp("processed_at"),
    processedBy: varchar("processed_by").references(() => users.id),
    emailSent: boolean("email_sent").notNull().default(false),
    emailSentAt: timestamp("email_sent_at"),
  },
  (table) => [
    index("sndl_demand_user_id_idx").on(table.userId),
    index("sndl_demand_status_idx").on(table.status),
    index("sndl_demand_requested_at_idx").on(table.requestedAt),
  ]
);

export const complaintStatusEnum = pgEnum("complaint_status", ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"]);

export const complaints = pgTable(
  "complaint",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id),
    title: varchar("title", { length: 100 }).notNull(),
    description: text("description").notNull(),
    status: complaintStatusEnum("status").default("PENDING"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    resolvedAt: timestamp("resolved_at"),
    resolvedBy: varchar("resolved_by").references(() => users.id),
    adminNotes: text("admin_notes"),
    isPrivate: boolean("is_private").notNull().default(true),
  },
  (table) => [
    index("complaint_user_id_idx").on(table.userId),
    index("complaint_status_idx").on(table.status),
    index("complaint_created_at_idx").on(table.createdAt),
    index("complaint_is_private_idx").on(table.isPrivate),
  ]
);