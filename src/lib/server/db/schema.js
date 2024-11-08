import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

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
