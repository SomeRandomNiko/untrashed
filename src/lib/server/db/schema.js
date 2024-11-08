import { boolean, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

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
});

export const trashRecord = pgTable("trash_records", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text().notNull(),
  description: text().notNull(),
  category: trashCategory().notNull(),
  impact: trashImpact().notNull(),
  size: trashSize().notNull(),
  points: integer().notNull(),
  foundBy: text()
    .notNull()
    .references(() => users.id),
  disposed: boolean()
    .notNull()
    .default(sql`false`),
  trashBin: integer().references(() => trashBin.id),
});
