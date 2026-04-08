import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  balanceEur: real("balance_eur").default(0.0).notNull(),
  cardNumber: text("card_number"),
  cardExpiry: text("card_expiry"),
  cardCvv: text("card_cvv"),
  cardNetwork: text("card_network"),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  date: text("date").notNull(),
  description: text("description").notNull(),
  amountEur: real("amount_eur").notNull(),
  amountUsdt: real("amount_usdt").notNull(),
  type: text("type", { enum: ["income", "expense", "yield"] }).notNull(),
});

export const atmWithdrawals = sqliteTable("atm_withdrawals", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  amount: real("amount").notNull(),
  pickupDate: text("pickup_date").notNull(),
  status: text("status").default("Pending Approval").notNull(),
});
