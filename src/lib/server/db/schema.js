import { geometry, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

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

export const locations = pgTable("locations", ({ integer, geometry }) => ({
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  point: geometry({ type: "point", mode: "tuple", srid: 4326 }).notNull(),
}));

export const trashBins = pgTable("trash_bins", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  point: geometry({ type: "point", mode: "tuple", srid: 4326 }).notNull(),
});

export const trashSpots = pgTable("trash_spots", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  point: geometry({ type: "point", mode: "tuple", srid: 4326 }).notNull(),
  image: text().notNull(),
  name: text().notNull(),
  description: text().notNull(),
  category: trashCategory().notNull(),
  impact: trashImpact().notNull(),
  size: trashSize().notNull(),
  score: integer().notNull(),
  userId: text()
    .notNull()
    .references(() => users.id),
});

export const usersFoundTrash = pgTable("users_found_trash", {
  userId: text()
    .references(() => users.id)
    .notNull(),
  trashSpotId: integer()
    .references(() => trashSpots.id)
    .notNull(),
});

export const usersDisposedTrash = pgTable("users_disposed_trash", {
  trashBinId: integer()
    .references(() => trashBins.id)
    .notNull(),
  userId: text()
    .references(() => users.id)
    .notNull(),
  trashSpotId: integer()
    .references(() => trashSpots.id)
    .notNull(),
  image: text().notNull(),
});
