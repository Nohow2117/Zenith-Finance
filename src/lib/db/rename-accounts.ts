import { db } from "./index";
import { accounts } from "./schema";
import { eq } from "drizzle-orm";

async function rename() {
  console.log("Renaming accounts...");
  await db.update(accounts).set({ name: "BTC Fineco" }).where(eq(accounts.name, "Fineco"));
  await db.update(accounts).set({ name: "Solana Findomestic" }).where(eq(accounts.name, "Findomestic"));
  await db.update(accounts).set({ name: "Ethereum Mediolanum" }).where(eq(accounts.name, "Mediolanum"));
  await db.update(accounts).set({ name: "USDC WeBank" }).where(eq(accounts.name, "WeBank"));
  await db.update(accounts).set({ name: "XRP Isybank" }).where(eq(accounts.name, "Isybank"));
  await db.update(accounts).set({ name: "AVAX Wise" }).where(eq(accounts.name, "Wise"));
  await db.update(accounts).set({ name: "DOT N26" }).where(eq(accounts.name, "N26"));
  console.log("Done.");
}

rename().catch(console.error);
