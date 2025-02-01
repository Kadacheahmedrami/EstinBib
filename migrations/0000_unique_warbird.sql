CREATE TYPE "public"."Role" AS ENUM('STUDENT', 'LIBRARIAN');--> statement-breakpoint
CREATE TABLE "account" (
	"user_id" varchar,
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
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "book_category" (
	"book_id" varchar,
	"category_id" varchar
);
--> statement-breakpoint
CREATE TABLE "book_request" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"requestedAt" timestamp DEFAULT now(),
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
	"description" text,
	"coverImage" varchar,
	"size" integer,
	"available" boolean DEFAULT true,
	"publishedAt" timestamp NOT NULL,
	"addedById" varchar,
	"addedAt" timestamp DEFAULT now(),
	"language" varchar,
	CONSTRAINT "book_isbn_unique" UNIQUE("isbn")
);
--> statement-breakpoint
CREATE TABLE "borrow" (
	"id" varchar PRIMARY KEY NOT NULL,
	"book_id" varchar,
	"user_id" varchar,
	"borrowedAt" timestamp DEFAULT now(),
	"dueDate" timestamp NOT NULL,
	"returnedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "contact" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"message" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"email" varchar NOT NULL,
	"emailVerified" timestamp,
	"image" varchar,
	"role" "Role" DEFAULT 'STUDENT' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_token" (
	"identifier" varchar NOT NULL,
	"token" varchar NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_category" ADD CONSTRAINT "book_category_book_id_book_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."book"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_category" ADD CONSTRAINT "book_category_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_request" ADD CONSTRAINT "book_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book" ADD CONSTRAINT "book_addedById_user_id_fk" FOREIGN KEY ("addedById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow" ADD CONSTRAINT "borrow_book_id_book_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."book"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow" ADD CONSTRAINT "borrow_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "book_request_user_id_idx" ON "book_request" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "requested_at_idx" ON "book_request" USING btree ("requestedAt");--> statement-breakpoint
CREATE INDEX "title_author_idx" ON "book" USING btree ("title","author");--> statement-breakpoint
CREATE INDEX "available_idx" ON "book" USING btree ("available");--> statement-breakpoint
CREATE INDEX "size_idx" ON "book" USING btree ("size");--> statement-breakpoint
CREATE INDEX "published_at_idx" ON "book" USING btree ("publishedAt");--> statement-breakpoint
CREATE INDEX "borrow_book_id_idx" ON "borrow" USING btree ("book_id");--> statement-breakpoint
CREATE INDEX "borrow_user_id_idx" ON "borrow" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "due_date_idx" ON "borrow" USING btree ("dueDate");--> statement-breakpoint
CREATE INDEX "category_name_idx" ON "category" USING btree ("name");