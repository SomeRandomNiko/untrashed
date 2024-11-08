CREATE TYPE "public"."category" AS ENUM('organic', 'paper', 'glass', 'metal', 'household', 'electronics');--> statement-breakpoint
CREATE TYPE "public"."impact" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."size" AS ENUM('small', 'medium', 'large');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trash_bins" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "trash_bins_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"point" geometry(point) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trash_spots" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "trash_spots_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"point" geometry(point) NOT NULL,
	"image" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" "category" NOT NULL,
	"impact" "impact" NOT NULL,
	"size" "size" NOT NULL,
	"score" integer NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_disposed_trash" (
	"trash_bin_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"trash_spot_id" integer NOT NULL,
	"image" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_found_trash" (
	"user_id" text NOT NULL,
	"trash_spot_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trash_spots" ADD CONSTRAINT "trash_spots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_disposed_trash" ADD CONSTRAINT "users_disposed_trash_trash_bin_id_trash_bins_id_fk" FOREIGN KEY ("trash_bin_id") REFERENCES "public"."trash_bins"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_disposed_trash" ADD CONSTRAINT "users_disposed_trash_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_disposed_trash" ADD CONSTRAINT "users_disposed_trash_trash_spot_id_trash_spots_id_fk" FOREIGN KEY ("trash_spot_id") REFERENCES "public"."trash_spots"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_found_trash" ADD CONSTRAINT "users_found_trash_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_found_trash" ADD CONSTRAINT "users_found_trash_trash_spot_id_trash_spots_id_fk" FOREIGN KEY ("trash_spot_id") REFERENCES "public"."trash_spots"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
