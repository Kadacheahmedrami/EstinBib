CREATE TYPE "public"."complaint_status" AS ENUM('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');--> statement-breakpoint
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
ALTER TABLE "complaint" ADD CONSTRAINT "complaint_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaint" ADD CONSTRAINT "complaint_resolved_by_user_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "complaint_user_id_idx" ON "complaint" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "complaint_status_idx" ON "complaint" USING btree ("status");--> statement-breakpoint
CREATE INDEX "complaint_created_at_idx" ON "complaint" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "complaint_is_private_idx" ON "complaint" USING btree ("is_private");