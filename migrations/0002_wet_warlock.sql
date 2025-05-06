CREATE TYPE "public"."BookType" AS ENUM('BOOK', 'DOCUMENT', 'PERIODIC', 'ARTICLE');--> statement-breakpoint
CREATE TYPE "public"."EducationYear" AS ENUM('1CP', '2CP', '1CS', '2CS', '3CS');--> statement-breakpoint
CREATE TABLE "borrow_extension" (
	"id" varchar PRIMARY KEY NOT NULL,
	"borrow_id" varchar NOT NULL,
	"previous_due_date" timestamp NOT NULL,
	"new_due_date" timestamp NOT NULL,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"approved_at" timestamp DEFAULT now() NOT NULL,
	"approved_by" varchar,
	"reason" text
);
--> statement-breakpoint
ALTER TABLE "book" ADD COLUMN "barcode" varchar;--> statement-breakpoint
ALTER TABLE "book" ADD COLUMN "pdf_url" varchar;--> statement-breakpoint
ALTER TABLE "book" ADD COLUMN "type" "BookType" DEFAULT 'BOOK' NOT NULL;--> statement-breakpoint
ALTER TABLE "book" ADD COLUMN "periodical_frequency" varchar;--> statement-breakpoint
ALTER TABLE "book" ADD COLUMN "periodical_issue" varchar;--> statement-breakpoint
ALTER TABLE "book" ADD COLUMN "article_journal" varchar;--> statement-breakpoint
ALTER TABLE "book" ADD COLUMN "document_type" varchar;--> statement-breakpoint
ALTER TABLE "borrow" ADD COLUMN "extension_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "nfc_card_id" varchar;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "education_year" "EducationYear";--> statement-breakpoint
ALTER TABLE "borrow_extension" ADD CONSTRAINT "borrow_extension_borrow_id_borrow_id_fk" FOREIGN KEY ("borrow_id") REFERENCES "public"."borrow"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow_extension" ADD CONSTRAINT "borrow_extension_approved_by_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "borrow_extension_borrow_id_idx" ON "borrow_extension" USING btree ("borrow_id");--> statement-breakpoint
CREATE INDEX "borrow_extension_requested_at_idx" ON "borrow_extension" USING btree ("requested_at");--> statement-breakpoint
CREATE INDEX "barcode_idx" ON "book" USING btree ("barcode");--> statement-breakpoint
CREATE INDEX "type_idx" ON "book" USING btree ("type");--> statement-breakpoint
CREATE INDEX "extension_count_idx" ON "borrow" USING btree ("extension_count");--> statement-breakpoint
ALTER TABLE "book" ADD CONSTRAINT "book_barcode_unique" UNIQUE("barcode");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_nfc_card_id_unique" UNIQUE("nfc_card_id");