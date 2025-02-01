ALTER TABLE "book" DROP CONSTRAINT "book_addedById_user_id_fk";
--> statement-breakpoint
ALTER TABLE "book" DROP COLUMN "addedById";