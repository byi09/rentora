CREATE TABLE "user_preferences" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"updates_saved_properties_email" boolean DEFAULT true,
	"updates_saved_properties_push" boolean DEFAULT true,
	"new_properties_email" boolean DEFAULT true,
	"new_properties_push" boolean DEFAULT true,
	"news_email" boolean DEFAULT true,
	"news_push" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "conversation_participants" ADD COLUMN "unread_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "conversation_participants" ADD COLUMN "last_read_at" timestamp;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;