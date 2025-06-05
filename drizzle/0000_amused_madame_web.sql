CREATE TYPE "public"."BookType" AS ENUM('BOOK', 'DOCUMENT', 'PERIODIC', 'ARTICLE');--> statement-breakpoint
CREATE TYPE "public"."complaint_status" AS ENUM('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."EducationYear" AS ENUM('1CP', '2CP', '1CS', '2CS', '3CS');--> statement-breakpoint
CREATE TYPE "public"."Role" AS ENUM('STUDENT', 'LIBRARIAN');--> statement-breakpoint
CREATE TYPE "public"."sndl_demand_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "account" (
	"userId" varchar NOT NULL,
	"type" varchar NOT NULL,
	"provider" varchar NOT NULL,
	"providerAccountId" varchar NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar,
	"scope" varchar,
	"id_token" text,
	"session_state" varchar,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "book_category" (
	"book_id" varchar NOT NULL,
	"category_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book_request" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"requestedAt" timestamp DEFAULT now() NOT NULL,
	"title" varchar NOT NULL,
	"author" varchar NOT NULL,
	"isbn" varchar,
	"releasedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "book" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"author" varchar NOT NULL,
	"isbn" varchar,
	"barcode" varchar,
	"description" text NOT NULL,
	"coverImage" varchar NOT NULL,
	"pdf_url" varchar,
	"size" integer NOT NULL,
	"available" boolean DEFAULT true NOT NULL,
	"publishedAt" timestamp NOT NULL,
	"addedAt" timestamp DEFAULT now() NOT NULL,
	"language" varchar NOT NULL,
	"type" "BookType" DEFAULT 'BOOK' NOT NULL,
	"periodical_frequency" varchar,
	"periodical_issue" varchar,
	"article_journal" varchar,
	"document_type" varchar,
	CONSTRAINT "book_isbn_unique" UNIQUE("isbn"),
	CONSTRAINT "book_barcode_unique" UNIQUE("barcode")
);
--> statement-breakpoint
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
CREATE TABLE "borrow" (
	"id" varchar PRIMARY KEY NOT NULL,
	"book_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"borrowedAt" timestamp DEFAULT now() NOT NULL,
	"dueDate" timestamp NOT NULL,
	"returnedAt" timestamp,
	"extension_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "complaint" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"status" "complaint_status" DEFAULT 'PENDING',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	"resolved_by" varchar,
	"admin_notes" text,
	"is_private" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"message" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "idea" (
	"id" varchar PRIMARY KEY NOT NULL,
	"idea" varchar(500) NOT NULL,
	"user_id" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sndl_demand" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"request_reason" text NOT NULL,
	"status" "sndl_demand_status" DEFAULT 'PENDING',
	"sndl_email" varchar,
	"sndl_password" varchar,
	"admin_notes" text,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp,
	"processed_by" varchar,
	"email_sent" boolean DEFAULT false NOT NULL,
	"email_sent_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar,
	"emailVerified" timestamp,
	"image" varchar,
	"role" "Role" DEFAULT 'STUDENT' NOT NULL,
	"nfc_card_id" varchar,
	"education_year" "EducationYear",
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_nfc_card_id_unique" UNIQUE("nfc_card_id")
);
--> statement-breakpoint
CREATE TABLE "verification_token" (
	"identifier" varchar NOT NULL,
	"token" varchar NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_category" ADD CONSTRAINT "book_category_book_id_book_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."book"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_category" ADD CONSTRAINT "book_category_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_request" ADD CONSTRAINT "book_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow_extension" ADD CONSTRAINT "borrow_extension_borrow_id_borrow_id_fk" FOREIGN KEY ("borrow_id") REFERENCES "public"."borrow"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow_extension" ADD CONSTRAINT "borrow_extension_approved_by_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow" ADD CONSTRAINT "borrow_book_id_book_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."book"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow" ADD CONSTRAINT "borrow_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaint" ADD CONSTRAINT "complaint_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaint" ADD CONSTRAINT "complaint_resolved_by_user_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idea" ADD CONSTRAINT "idea_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sndl_demand" ADD CONSTRAINT "sndl_demand_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sndl_demand" ADD CONSTRAINT "sndl_demand_processed_by_user_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "book_request_user_id_idx" ON "book_request" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "requested_at_idx" ON "book_request" USING btree ("requestedAt");--> statement-breakpoint
CREATE INDEX "title_author_idx" ON "book" USING btree ("title","author");--> statement-breakpoint
CREATE INDEX "available_idx" ON "book" USING btree ("available");--> statement-breakpoint
CREATE INDEX "size_idx" ON "book" USING btree ("size");--> statement-breakpoint
CREATE INDEX "published_at_idx" ON "book" USING btree ("publishedAt");--> statement-breakpoint
CREATE INDEX "barcode_idx" ON "book" USING btree ("barcode");--> statement-breakpoint
CREATE INDEX "type_idx" ON "book" USING btree ("type");--> statement-breakpoint
CREATE INDEX "borrow_extension_borrow_id_idx" ON "borrow_extension" USING btree ("borrow_id");--> statement-breakpoint
CREATE INDEX "borrow_extension_requested_at_idx" ON "borrow_extension" USING btree ("requested_at");--> statement-breakpoint
CREATE INDEX "borrow_book_id_idx" ON "borrow" USING btree ("book_id");--> statement-breakpoint
CREATE INDEX "borrow_user_id_idx" ON "borrow" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "due_date_idx" ON "borrow" USING btree ("dueDate");--> statement-breakpoint
CREATE INDEX "extension_count_idx" ON "borrow" USING btree ("extension_count");--> statement-breakpoint
CREATE INDEX "category_name_idx" ON "category" USING btree ("name");--> statement-breakpoint
CREATE INDEX "complaint_user_id_idx" ON "complaint" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "complaint_status_idx" ON "complaint" USING btree ("status");--> statement-breakpoint
CREATE INDEX "complaint_created_at_idx" ON "complaint" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "complaint_is_private_idx" ON "complaint" USING btree ("is_private");--> statement-breakpoint
CREATE INDEX "idea_user_id_idx" ON "idea" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sndl_demand_user_id_idx" ON "sndl_demand" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sndl_demand_status_idx" ON "sndl_demand" USING btree ("status");--> statement-breakpoint
CREATE INDEX "sndl_demand_requested_at_idx" ON "sndl_demand" USING btree ("requested_at");