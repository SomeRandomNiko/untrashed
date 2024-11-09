ALTER TABLE "trash_bins" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "trash_spots" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users_disposed_trash" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;