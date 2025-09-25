import { pgTable, text, timestamp, index, uniqueIndex, integer, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
  landingDiscountConsumedAt: timestamp("landing_discount_consumed_at", { withTimezone: true }),
  landingDiscountPaymentId: text("landing_discount_payment_id"),
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
  message: text("message").notNull().default(""),
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

export const landingPayments = pgTable("landing_payments", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  externalReference: text("external_reference").notNull(),
  status: text("status").notNull(),
  statusDetail: text("status_detail"),
  transactionAmount: integer("transaction_amount").notNull(),
  currencyId: text("currency_id").notNull(),
  paymentMethodId: text("payment_method_id"),
  paymentTypeId: text("payment_type_id"),
  payerEmail: text("payer_email"),
  mpCreatedAt: timestamp("mp_created_at", { withTimezone: true }),
  rawPayload: jsonb("raw_payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
}, (t) => ({
  userIdx: index("landing_payments_user_idx").on(t.userId),
  referenceIdx: index("landing_payments_reference_idx").on(t.externalReference),
}));

export type ContactRequest = typeof contactRequests.$inferSelect;
