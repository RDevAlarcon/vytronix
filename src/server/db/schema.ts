import { pgTable, text, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
}, (t) => ({
  emailUq: uniqueIndex("users_email_uq").on(t.email),
  createdIdx: index("users_created_idx").on(t.createdAt),
}));

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
}, (t) => ({
  tokenUq: uniqueIndex("prt_token_uq").on(t.tokenHash),
  userIdx: index("prt_user_idx").on(t.userId),
  expiresIdx: index("prt_expires_idx").on(t.expiresAt),
}));

export const contactRequests = pgTable("contact_requests", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  status: text("status").notNull().default("nuevo"),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
}, (t) => ({
  emailIdx: index("cr_email_idx").on(t.email),
  statusIdx: index("cr_status_idx").on(t.status),
  createdIdx: index("cr_created_idx").on(t.createdAt),
}));

export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
}, (t) => ({
  emailIdx: index("leads_email_idx").on(t.email),
  createdIdx: index("leads_created_idx").on(t.createdAt),
}));

export type ContactRequest = typeof contactRequests.$inferSelect;
