ALTER TABLE "customers" ADD COLUMN "interest_city" varchar(100);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "interest_state" varchar(50);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "interest_zip_code" varchar(10);--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "marketing_opt_in";--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "notifications_enabled";