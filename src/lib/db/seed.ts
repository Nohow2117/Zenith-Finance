import { db } from "./index";
import { accounts, transactions } from "./schema";
import { v4 as uuid } from "uuid";
import { EUR_USDT_RATE } from "../constants";
import { eq, inArray } from "drizzle-orm";

const SEED_ACCOUNTS = [
  { name: "Fineco", balanceEur: 42350.0, cardNumber: "4539 1234 5678 4821", cardExpiry: "09/27", cardCvv: "847", cardNetwork: "Visa" },
  { name: "Isybank", balanceEur: 0, cardNumber: null, cardExpiry: null, cardCvv: null, cardNetwork: null },
  { name: "WeBank", balanceEur: 18720.5, cardNumber: "5412 7534 9012 7392", cardExpiry: "03/28", cardCvv: "312", cardNetwork: "Mastercard" },
  { name: "Findomestic", balanceEur: 8450.0, cardNumber: "4716 8290 3456 1156", cardExpiry: "11/26", cardCvv: "605", cardNetwork: "Visa" },
  { name: "Mediolanum", balanceEur: 14200.0, cardNumber: "4214 7483 9123 4812", cardExpiry: "12/26", cardCvv: "142", cardNetwork: "Visa" },
  { name: "Wise", balanceEur: 3100.5, cardNumber: "5312 8593 1032 5921", cardExpiry: "06/27", cardCvv: "941", cardNetwork: "Mastercard" },
  { name: "N26", balanceEur: 1250.0, cardNumber: "5123 9482 1234 9482", cardExpiry: "01/29", cardCvv: "253", cardNetwork: "Mastercard" },
  { name: "Crypto Staking", balanceEur: 125800.0, cardNumber: null, cardExpiry: null, cardCvv: null, cardNetwork: null },
  { name: "Liquidity Pool", balanceEur: 67200.0, cardNumber: null, cardExpiry: null, cardCvv: null, cardNetwork: null },
  { name: "DeFi Vault", balanceEur: 31500.0, cardNumber: null, cardExpiry: null, cardCvv: null, cardNetwork: null },
];

const SEED_TRANSACTIONS = [
  { description: "Monthly Salary", amountEur: 4500, type: "income" as const, daysAgo: 2 },
  { description: "Staking Rewards - ETH", amountEur: 320.5, type: "yield" as const, daysAgo: 3 },
  { description: "Amazon Purchase", amountEur: -89.99, type: "expense" as const, daysAgo: 4 },
  { description: "LP Yield - USDC/ETH", amountEur: 185.0, type: "yield" as const, daysAgo: 5 },
  { description: "Restaurant Payment", amountEur: -65.0, type: "expense" as const, daysAgo: 6 },
  { description: "Freelance Income", amountEur: 2200.0, type: "income" as const, daysAgo: 7 },
  { description: "Vault Interest", amountEur: 412.3, type: "yield" as const, daysAgo: 8 },
  { description: "Grocery Store", amountEur: -142.5, type: "expense" as const, daysAgo: 10 },
  { description: "DeFi Harvest", amountEur: 890.0, type: "yield" as const, daysAgo: 12 },
  { description: "Utility Bill", amountEur: -210.0, type: "expense" as const, daysAgo: 14 },
  { description: "Staking Rewards - SOL", amountEur: 156.8, type: "yield" as const, daysAgo: 15 },
  { description: "Subscription Renewal", amountEur: -14.99, type: "expense" as const, daysAgo: 18 },
];

export async function seedDatabase(): Promise<void> {
  const existingAccounts = await db
    .select({ id: accounts.id, name: accounts.name })
    .from(accounts)
    .where(inArray(accounts.name, SEED_ACCOUNTS.map((account) => account.name)));

  const existingNames = new Set(existingAccounts.map((account) => account.name));
  const accountIds = existingAccounts.map((account) => account.id);

  for (const acc of SEED_ACCOUNTS) {
    if (existingNames.has(acc.name)) {
      continue;
    }

    const id = uuid();
    accountIds.push(id);
    await db.insert(accounts).values({ id, ...acc });
  }

  const hasTransactions = await db.select({ id: transactions.id }).from(transactions).limit(1);
  if (hasTransactions.length > 0 || accountIds.length === 0) return;

  for (const tx of SEED_TRANSACTIONS) {
    const accountId = accountIds[Math.floor(Math.random() * accountIds.length)];
    const date = new Date();
    date.setDate(date.getDate() - tx.daysAgo);
    await db.insert(transactions).values({
      id: uuid(),
      accountId,
      date: date.toISOString().split("T")[0],
      description: tx.description,
      amountEur: Math.abs(tx.amountEur),
      amountUsdt: Math.abs(tx.amountEur) * EUR_USDT_RATE,
      type: tx.type,
    });
  }
}
