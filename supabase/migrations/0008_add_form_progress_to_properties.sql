ALTER TABLE "user_preferences" ALTER COLUMN "updates_saved_properties_email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_preferences" ALTER COLUMN "updates_saved_properties_push" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_preferences" ALTER COLUMN "new_properties_email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_preferences" ALTER COLUMN "new_properties_push" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_preferences" ALTER COLUMN "news_email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_preferences" ALTER COLUMN "news_push" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "factor_id" uuid;