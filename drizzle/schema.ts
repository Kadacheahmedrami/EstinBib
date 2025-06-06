import { pgTable, varchar, text, timestamp, index, foreignKey, integer, unique, boolean, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const bookType = pgEnum("BookType", ['BOOK', 'DOCUMENT', 'PERIODIC', 'ARTICLE'])
export const educationYear = pgEnum("EducationYear", ['1CP', '2CP', '1CS', '2CS', '3CS'])
export const role = pgEnum("Role", ['STUDENT', 'LIBRARIAN'])
export const complaintStatus = pgEnum("complaint_status", ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'])
export const sndlDemandStatus = pgEnum("sndl_demand_status", ['PENDING', 'APPROVED', 'REJECTED'])


export const contact = pgTable("contact", {
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	email: varchar().notNull(),
	message: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
});

export const borrow = pgTable("borrow", {
	id: varchar().primaryKey().notNull(),
	bookId: varchar("book_id").notNull(),
	userId: varchar("user_id").notNull(),
	borrowedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	dueDate: timestamp({ mode: 'string' }).notNull(),
	returnedAt: timestamp({ mode: 'string' }),
	extensionCount: integer("extension_count").default(0).notNull(),
}, (table) => [
	index("borrow_book_id_idx").using("btree", table.bookId.asc().nullsLast().op("text_ops")),
	index("borrow_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	index("due_date_idx").using("btree", table.dueDate.asc().nullsLast().op("timestamp_ops")),
	index("extension_count_idx").using("btree", table.extensionCount.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.bookId],
			foreignColumns: [book.id],
			name: "borrow_book_id_book_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "borrow_user_id_user_id_fk"
		}),
]);

export const bookCategory = pgTable("book_category", {
	bookId: varchar("book_id").notNull(),
	categoryId: varchar("category_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.bookId],
			foreignColumns: [book.id],
			name: "book_category_book_id_book_id_fk"
		}),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [category.id],
			name: "book_category_category_id_category_id_fk"
		}),
]);

export const category = pgTable("category", {
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
}, (table) => [
	index("category_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	unique("category_name_unique").on(table.name),
]);

export const bookRequest = pgTable("book_request", {
	id: varchar().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	requestedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	title: varchar().notNull(),
	author: varchar().notNull(),
	isbn: varchar(),
	releasedAt: timestamp({ mode: 'string' }),
}, (table) => [
	index("book_request_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	index("requested_at_idx").using("btree", table.requestedAt.asc().nullsLast().op("timestamp_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "book_request_user_id_user_id_fk"
		}),
]);

export const user = pgTable("user", {
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	email: varchar().notNull(),
	emailVerified: timestamp({ mode: 'string' }),
	image: varchar(),
	role: role().default('STUDENT').notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	password: varchar(),
	nfcCardId: varchar("nfc_card_id"),
	educationYear: educationYear("education_year"),
}, (table) => [
	unique("user_email_unique").on(table.email),
	unique("user_nfc_card_id_unique").on(table.nfcCardId),
]);

export const idea = pgTable("idea", {
	id: varchar().primaryKey().notNull(),
	idea: varchar({ length: 500 }).notNull(),
	userId: varchar("user_id").notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idea_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "idea_user_id_user_id_fk"
		}),
]);

export const sndlDemand = pgTable("sndl_demand", {
	id: varchar().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	requestReason: text("request_reason").notNull(),
	status: sndlDemandStatus().default('PENDING'),
	sndlEmail: varchar("sndl_email"),
	sndlPassword: varchar("sndl_password"),
	adminNotes: text("admin_notes"),
	requestedAt: timestamp("requested_at", { mode: 'string' }).defaultNow().notNull(),
	processedAt: timestamp("processed_at", { mode: 'string' }),
	processedBy: varchar("processed_by"),
	emailSent: boolean("email_sent").default(false).notNull(),
	emailSentAt: timestamp("email_sent_at", { mode: 'string' }),
}, (table) => [
	index("sndl_demand_requested_at_idx").using("btree", table.requestedAt.asc().nullsLast().op("timestamp_ops")),
	index("sndl_demand_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("sndl_demand_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "sndl_demand_user_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.processedBy],
			foreignColumns: [user.id],
			name: "sndl_demand_processed_by_user_id_fk"
		}),
]);

export const complaint = pgTable("complaint", {
	id: varchar().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	title: varchar({ length: 100 }).notNull(),
	description: text().notNull(),
	status: complaintStatus().default('PENDING'),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	resolvedAt: timestamp("resolved_at", { mode: 'string' }),
	resolvedBy: varchar("resolved_by"),
	adminNotes: text("admin_notes"),
	isPrivate: boolean("is_private").default(true).notNull(),
}, (table) => [
	index("complaint_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("complaint_is_private_idx").using("btree", table.isPrivate.asc().nullsLast().op("bool_ops")),
	index("complaint_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("complaint_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "complaint_user_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.resolvedBy],
			foreignColumns: [user.id],
			name: "complaint_resolved_by_user_id_fk"
		}),
]);

export const book = pgTable("book", {
	id: varchar().primaryKey().notNull(),
	title: varchar().notNull(),
	author: varchar().notNull(),
	isbn: varchar(),
	description: text().notNull(),
	coverImage: varchar().notNull(),
	size: integer().notNull(),
	available: boolean().default(true).notNull(),
	publishedAt: timestamp({ mode: 'string' }).notNull(),
	addedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	language: varchar().notNull(),
	barcode: varchar(),
	pdfUrl: varchar("pdf_url"),
	type: bookType().default('BOOK').notNull(),
	periodicalFrequency: varchar("periodical_frequency"),
	periodicalIssue: varchar("periodical_issue"),
	articleJournal: varchar("article_journal"),
	documentType: varchar("document_type"),
}, (table) => [
	index("available_idx").using("btree", table.available.asc().nullsLast().op("bool_ops")),
	index("barcode_idx").using("btree", table.barcode.asc().nullsLast().op("text_ops")),
	index("published_at_idx").using("btree", table.publishedAt.asc().nullsLast().op("timestamp_ops")),
	index("size_idx").using("btree", table.size.asc().nullsLast().op("int4_ops")),
	index("title_author_idx").using("btree", table.title.asc().nullsLast().op("text_ops"), table.author.asc().nullsLast().op("text_ops")),
	index("type_idx").using("btree", table.type.asc().nullsLast().op("enum_ops")),
	unique("book_isbn_unique").on(table.isbn),
	unique("book_barcode_unique").on(table.barcode),
]);

export const borrowExtension = pgTable("borrow_extension", {
	id: varchar().primaryKey().notNull(),
	borrowId: varchar("borrow_id").notNull(),
	previousDueDate: timestamp("previous_due_date", { mode: 'string' }).notNull(),
	newDueDate: timestamp("new_due_date", { mode: 'string' }).notNull(),
	requestedAt: timestamp("requested_at", { mode: 'string' }).defaultNow().notNull(),
	approvedAt: timestamp("approved_at", { mode: 'string' }).defaultNow().notNull(),
	approvedBy: varchar("approved_by"),
	reason: text(),
}, (table) => [
	index("borrow_extension_borrow_id_idx").using("btree", table.borrowId.asc().nullsLast().op("text_ops")),
	index("borrow_extension_requested_at_idx").using("btree", table.requestedAt.asc().nullsLast().op("timestamp_ops")),
	foreignKey({
			columns: [table.borrowId],
			foreignColumns: [borrow.id],
			name: "borrow_extension_borrow_id_borrow_id_fk"
		}),
	foreignKey({
			columns: [table.approvedBy],
			foreignColumns: [user.id],
			name: "borrow_extension_approved_by_user_id_fk"
		}),
]);

export const verificationToken = pgTable("verification_token", {
	identifier: varchar().notNull(),
	token: varchar().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.identifier, table.token], name: "verification_token_identifier_token_pk"}),
]);

export const account = pgTable("account", {
	userId: varchar().notNull(),
	type: varchar().notNull(),
	provider: varchar().notNull(),
	providerAccountId: varchar().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: varchar("token_type"),
	scope: varchar(),
	idToken: text("id_token"),
	sessionState: varchar("session_state"),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}),
	primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"}),
]);
