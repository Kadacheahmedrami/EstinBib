CREATE TABLE "idea" (
	"id" varchar PRIMARY KEY NOT NULL,
	"idea" varchar(500) NOT NULL,
	"user_id" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "idea" ADD CONSTRAINT "idea_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idea_user_id_idx" ON "idea" USING btree ("user_id");