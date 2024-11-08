import { sql } from "drizzle-orm";
import { boolean, geometry, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const trashCategory = pgEnum("category", [
  "organic",
  "paper",
  "glass",
  "metal",
  "household",
  "electronics",
]);

export const trashImpact = pgEnum("impact", ["low", "medium", "high"]);

export const trashSize = pgEnum("size", ["small", "medium", "large"]);

export const users = pgTable("users", {
  id: text().primaryKey(),
  age: integer(),
  username: text().notNull().unique(),
  passwordHash: text().notNull(),
});

export const sessions = pgTable("sessions", {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp({ withTimezone: true, mode: "date" }).notNull(),
});

export const trashBin = pgTable("trash_bins", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  point: geometry({ type: "point", mode: "tuple", srid: 4326 }).notNull(),
});

export const trash = pgTable("trash_records", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  point: geometry({ type: "point", mode: "tuple", srid: 4326 }).notNull(),
  image: text().notNull(),
  name: text().notNull(),
  description: text().notNull(),
  category: trashCategory().notNull(),
  impact: trashImpact().notNull(),
  size: trashSize().notNull(),
  score: integer().notNull(),
  foundBy: text()
    .notNull()
    .references(() => users.id),
  disposed: boolean()
    .default(sql`false`)
    .notNull(),
  trashBin: integer().references(() => trashBin.id),
});

export const usersFoundTrash = pgTable("users_found_trash", {
  userId: text()
    .references(() => users.id)
    .notNull(),
  trashId: integer()
    .references(() => trash.id)
    .notNull(),
});

export const usersDisposedTrash = pgTable("users_disposed_trash", {
  binId: integer()
    .references(() => trashBin.id)
    .notNull(),
  userId: text()
    .references(() => users.id)
    .notNull(),
  trashId: integer()
    .references(() => trash.id)
    .notNull(),
  image: text().notNull(),
});
