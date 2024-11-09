CREATE INDEX IF NOT EXISTS "sessions_user_id_index" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trash_bins_point_index" ON "trash_bins" USING gist ("point");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trash_spots_user_id_index" ON "trash_spots" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trash_spots_point_index" ON "trash_spots" USING gist ("point");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_disposed_trash_trash_bin_id_index" ON "users_disposed_trash" USING btree ("trash_bin_id");