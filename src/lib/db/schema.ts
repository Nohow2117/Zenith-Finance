import { sqliteTable, text, real, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  balanceEur: real("balance_eur").default(0.0).notNull(),
  cardLastFour: text("card_last_four"),
  cardExpiry: text("card_expiry"),
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

export const loginAttempts = sqliteTable(
  "login_attempts",
  {
    id: text("id").primaryKey(),
    actorType: text("actor_type", { enum: ["user", "admin"] }).notNull(),
    username: text("username").notNull(),
    ipAddress: text("ip_address").notNull(),
    attemptCount: integer("attempt_count").default(0).notNull(),
    windowStartedAt: text("window_started_at").notNull(),
    lastAttemptAt: text("last_attempt_at").notNull(),
    lockedUntil: text("locked_until"),
    lockLevel: integer("lock_level").default(0).notNull(),
    lastLockedAt: text("last_locked_at"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    actorUsernameIpIdx: uniqueIndex("login_attempts_actor_username_ip_idx").on(
      table.actorType,
      table.username,
      table.ipAddress
    ),
  })
);
