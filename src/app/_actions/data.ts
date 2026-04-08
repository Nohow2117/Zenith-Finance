"use server";

import { db } from "@/lib/db";
import { initializeDatabase } from "@/lib/db/init";
import { accounts, transactions, atmWithdrawals } from "@/lib/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { EUR_USDT_RATE } from "@/lib/constants";
import type { ActionResult, Account, Transaction, AtmWithdrawal } from "@/types";
import { revalidatePath } from "next/cache";
import { requireAdminSession, requireAppSession, requireUserSession } from "@/lib/auth/guards";

export async function getAccounts(): Promise<Account[]> {
  await initializeDatabase();
  await requireAppSession();
  const rows = await db.select().from(accounts);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    balanceEur: r.balanceEur,
    cardNumber: r.cardNumber,
    cardExpiry: r.cardExpiry,
    cardCvv: r.cardCvv,
    cardNetwork: r.cardNetwork,
    isActive: r.isActive,
    createdAt: r.createdAt,
  }));
}

export async function getTransactions(): Promise<Transaction[]> {
  await initializeDatabase();
  await requireAppSession();
  const rows = await db.select().from(transactions).orderBy(desc(transactions.date));
  return rows.map((r) => ({
    id: r.id,
    accountId: r.accountId,
    date: r.date,
    description: r.description,
    amountEur: r.amountEur,
    amountUsdt: r.amountUsdt,
    type: r.type,
  }));
}

export async function getWithdrawals(): Promise<(AtmWithdrawal & { accountName: string })[]> {
  await initializeDatabase();
  await requireAppSession();
  const rows = await db
    .select({
      id: atmWithdrawals.id,
      accountId: atmWithdrawals.accountId,
      amount: atmWithdrawals.amount,
      pickupDate: atmWithdrawals.pickupDate,
      status: atmWithdrawals.status,
      accountName: accounts.name,
    })
    .from(atmWithdrawals)
    .innerJoin(accounts, eq(atmWithdrawals.accountId, accounts.id))
    .orderBy(desc(atmWithdrawals.pickupDate));
  return rows;
}

const withdrawalSchema = z.object({
  accountId: z.string().uuid(),
  amount: z.number().refine((v) => [2000, 2500, 3000].includes(v)),
  pickupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function createWithdrawal(
  accountId: string,
  amount: number,
  pickupDate: string
): Promise<ActionResult> {
  const parsed = withdrawalSchema.safeParse({ accountId, amount, pickupDate });
  if (!parsed.success) {
    return { success: false, error: "Invalid withdrawal data" };
  }
  try {
    await initializeDatabase();
    await requireUserSession();
    await db.insert(atmWithdrawals).values({
      id: uuid(),
      accountId: parsed.data.accountId,
      amount: parsed.data.amount,
      pickupDate: parsed.data.pickupDate,
      status: "Pending Approval",
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to create withdrawal" };
  }
}

const updateBalanceSchema = z.object({
  accountId: z.string().uuid(),
  balanceEur: z.number().min(0),
});

export async function updateAccountBalance(
  accountId: string,
  balanceEur: number
): Promise<ActionResult> {
  const parsed = updateBalanceSchema.safeParse({ accountId, balanceEur });
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }
  try {
    await initializeDatabase();
    await requireAdminSession();
    await db
      .update(accounts)
      .set({ balanceEur: parsed.data.balanceEur })
      .where(eq(accounts.id, parsed.data.accountId));
    revalidatePath("/dashboard");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to update balance" };
  }
}

const updateStatusSchema = z.object({
  accountId: z.string().uuid(),
  isActive: z.boolean(),
});

export async function updateAccountStatus(
  accountId: string,
  isActive: boolean
): Promise<ActionResult> {
  const parsed = updateStatusSchema.safeParse({ accountId, isActive });
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }
  try {
    await initializeDatabase();
    await requireAdminSession();
    await db
      .update(accounts)
      .set({ isActive: parsed.data.isActive })
      .where(eq(accounts.id, parsed.data.accountId));
    revalidatePath("/dashboard");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to update status" };
  }
}

const updateCardSchema = z.object({
  accountId: z.string().uuid(),
  cardNumber: z.string().min(13).max(19),
  cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/),
  cardCvv: z.string().min(3).max(4),
  cardNetwork: z.enum(["Visa", "Mastercard"]),
});

export async function updateAccountCard(
  accountId: string,
  cardNumber: string,
  cardExpiry: string,
  cardCvv: string,
  cardNetwork: string
): Promise<ActionResult> {
  const parsed = updateCardSchema.safeParse({ accountId, cardNumber, cardExpiry, cardCvv, cardNetwork });
  if (!parsed.success) {
    return { success: false, error: "Invalid card data" };
  }
  try {
    await initializeDatabase();
    await requireAdminSession();
    await db
      .update(accounts)
      .set({
        cardNumber: parsed.data.cardNumber,
        cardExpiry: parsed.data.cardExpiry,
        cardCvv: parsed.data.cardCvv,
        cardNetwork: parsed.data.cardNetwork,
      })
      .where(eq(accounts.id, parsed.data.accountId));
    revalidatePath("/dashboard");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to update card" };
  }
}

const addTransactionSchema = z.object({
  accountId: z.string().uuid(),
  date: z.string(),
  description: z.string().min(1),
  amountEur: z.number(),
  type: z.enum(["income", "expense", "yield"]),
});

export async function addTransaction(
  accountId: string,
  date: string,
  description: string,
  amountEur: number,
  type: "income" | "expense" | "yield"
): Promise<ActionResult> {
  const parsed = addTransactionSchema.safeParse({ accountId, date, description, amountEur, type });
  if (!parsed.success) {
    return { success: false, error: "Invalid transaction data" };
  }
  try {
    await initializeDatabase();
    await requireAdminSession();
    await db.insert(transactions).values({
      id: uuid(),
      accountId: parsed.data.accountId,
      date: parsed.data.date,
      description: parsed.data.description,
      amountEur: Math.abs(parsed.data.amountEur),
      amountUsdt: Math.abs(parsed.data.amountEur) * EUR_USDT_RATE,
      type: parsed.data.type,
    });
    revalidatePath("/dashboard");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to add transaction" };
  }
}

export async function bulkAddTransactions(
  accountId: string,
  txs: { date: string; description: string; amountEur: number; type: "income" | "expense" | "yield" }[]
): Promise<ActionResult> {
  try {
    await initializeDatabase();
    await requireAdminSession();
    for (const tx of txs) {
      await db.insert(transactions).values({
        id: uuid(),
        accountId,
        date: tx.date,
        description: tx.description,
        amountEur: Math.abs(tx.amountEur),
        amountUsdt: Math.abs(tx.amountEur) * EUR_USDT_RATE,
        type: tx.type,
      });
    }
    revalidatePath("/dashboard");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to import transactions" };
  }
}

export async function deleteTransactions(txIds: string[]): Promise<ActionResult> {
  if (!Array.isArray(txIds) || txIds.length === 0) {
    return { success: false, error: "No transactions provided" };
  }
  try {
    await initializeDatabase();
    await requireAdminSession();
    await db.delete(transactions).where(inArray(transactions.id, txIds));
    revalidatePath("/dashboard");
    revalidatePath("/admin/transactions");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to delete transactions" };
  }
}
