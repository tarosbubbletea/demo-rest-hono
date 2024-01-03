ALTER TABLE "users" ALTER COLUMN "usertype_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "campus" ADD CONSTRAINT "campus_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "careers" ADD CONSTRAINT "careers_name_unique" UNIQUE("name");