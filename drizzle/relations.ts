import { relations } from "drizzle-orm/relations";
import { book, borrow, user, bookCategory, category, bookRequest, idea, sndlDemand, complaint, borrowExtension, account } from "./schema";

export const borrowRelations = relations(borrow, ({one, many}) => ({
	book: one(book, {
		fields: [borrow.bookId],
		references: [book.id]
	}),
	user: one(user, {
		fields: [borrow.userId],
		references: [user.id]
	}),
	borrowExtensions: many(borrowExtension),
}));

export const bookRelations = relations(book, ({many}) => ({
	borrows: many(borrow),
	bookCategories: many(bookCategory),
}));

export const userRelations = relations(user, ({many}) => ({
	borrows: many(borrow),
	bookRequests: many(bookRequest),
	ideas: many(idea),
	sndlDemands_userId: many(sndlDemand, {
		relationName: "sndlDemand_userId_user_id"
	}),
	sndlDemands_processedBy: many(sndlDemand, {
		relationName: "sndlDemand_processedBy_user_id"
	}),
	complaints_userId: many(complaint, {
		relationName: "complaint_userId_user_id"
	}),
	complaints_resolvedBy: many(complaint, {
		relationName: "complaint_resolvedBy_user_id"
	}),
	borrowExtensions: many(borrowExtension),
	accounts: many(account),
}));

export const bookCategoryRelations = relations(bookCategory, ({one}) => ({
	book: one(book, {
		fields: [bookCategory.bookId],
		references: [book.id]
	}),
	category: one(category, {
		fields: [bookCategory.categoryId],
		references: [category.id]
	}),
}));

export const categoryRelations = relations(category, ({many}) => ({
	bookCategories: many(bookCategory),
}));

export const bookRequestRelations = relations(bookRequest, ({one}) => ({
	user: one(user, {
		fields: [bookRequest.userId],
		references: [user.id]
	}),
}));

export const ideaRelations = relations(idea, ({one}) => ({
	user: one(user, {
		fields: [idea.userId],
		references: [user.id]
	}),
}));

export const sndlDemandRelations = relations(sndlDemand, ({one}) => ({
	user_userId: one(user, {
		fields: [sndlDemand.userId],
		references: [user.id],
		relationName: "sndlDemand_userId_user_id"
	}),
	user_processedBy: one(user, {
		fields: [sndlDemand.processedBy],
		references: [user.id],
		relationName: "sndlDemand_processedBy_user_id"
	}),
}));

export const complaintRelations = relations(complaint, ({one}) => ({
	user_userId: one(user, {
		fields: [complaint.userId],
		references: [user.id],
		relationName: "complaint_userId_user_id"
	}),
	user_resolvedBy: one(user, {
		fields: [complaint.resolvedBy],
		references: [user.id],
		relationName: "complaint_resolvedBy_user_id"
	}),
}));

export const borrowExtensionRelations = relations(borrowExtension, ({one}) => ({
	borrow: one(borrow, {
		fields: [borrowExtension.borrowId],
		references: [borrow.id]
	}),
	user: one(user, {
		fields: [borrowExtension.approvedBy],
		references: [user.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));