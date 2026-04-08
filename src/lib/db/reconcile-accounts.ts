import { eq, inArray } from "drizzle-orm";
import { db } from "./index";
import { accounts, atmWithdrawals, transactions } from "./schema";

interface AccountMapping {
  canonicalName: string;
  legacyName: string;
}

interface ExistingAccount {
  id: string;
  name: string;
  isActive: boolean;
}

const LEGACY_ACCOUNT_MAPPINGS: AccountMapping[] = [
  { canonicalName: "BTC Fineco", legacyName: "Fineco" },
  { canonicalName: "Solana Findomestic", legacyName: "Findomestic" },
  { canonicalName: "Ethereum Mediolanum", legacyName: "Mediolanum" },
  { canonicalName: "USDC WeBank", legacyName: "WeBank" },
  { canonicalName: "XRP Isybank", legacyName: "Isybank" },
  { canonicalName: "AVAX Wise", legacyName: "Wise" },
  { canonicalName: "DOT N26", legacyName: "N26" },
];

function groupAccounts(existingAccounts: ExistingAccount[]): Map<string, ExistingAccount[]> {
  const grouped = new Map<string, ExistingAccount[]>();

  for (const account of existingAccounts) {
    const current = grouped.get(account.name) ?? [];
    current.push(account);
    grouped.set(account.name, current);
  }

  return grouped;
}

function selectPrimaryAccount(existingAccounts: ExistingAccount[]): ExistingAccount {
  return [...existingAccounts].sort((left, right) => Number(right.isActive) - Number(left.isActive))[0];
}

export async function reconcileLegacyAccounts(): Promise<void> {
  const accountNames = LEGACY_ACCOUNT_MAPPINGS.flatMap(({ canonicalName, legacyName }) => [
    canonicalName,
    legacyName,
  ]);

  const existingAccounts = await db
    .select({
      id: accounts.id,
      name: accounts.name,
      isActive: accounts.isActive,
    })
    .from(accounts)
    .where(inArray(accounts.name, accountNames));

  const accountsByName = groupAccounts(existingAccounts);

  for (const { canonicalName, legacyName } of LEGACY_ACCOUNT_MAPPINGS) {
    const legacyAccounts = accountsByName.get(legacyName) ?? [];
    if (legacyAccounts.length === 0) {
      continue;
    }

    const canonicalAccounts = accountsByName.get(canonicalName) ?? [];
    let targetAccount = canonicalAccounts.length > 0 ? selectPrimaryAccount(canonicalAccounts) : null;

    if (!targetAccount) {
      const [accountToRename, ...duplicateLegacyAccounts] = legacyAccounts;

      await db
        .update(accounts)
        .set({ name: canonicalName, isActive: true })
        .where(eq(accounts.id, accountToRename.id));

      targetAccount = {
        ...accountToRename,
        name: canonicalName,
        isActive: true,
      };

      accountsByName.set(canonicalName, [targetAccount]);

      for (const duplicateLegacyAccount of duplicateLegacyAccounts) {
        await db.update(transactions).set({ accountId: targetAccount.id }).where(eq(transactions.accountId, duplicateLegacyAccount.id));
        await db.update(atmWithdrawals).set({ accountId: targetAccount.id }).where(eq(atmWithdrawals.accountId, duplicateLegacyAccount.id));
        await db.delete(accounts).where(eq(accounts.id, duplicateLegacyAccount.id));
      }

      accountsByName.delete(legacyName);
      continue;
    }

    for (const legacyAccount of legacyAccounts) {
      if (legacyAccount.id === targetAccount.id) {
        continue;
      }

      await db.update(transactions).set({ accountId: targetAccount.id }).where(eq(transactions.accountId, legacyAccount.id));
      await db.update(atmWithdrawals).set({ accountId: targetAccount.id }).where(eq(atmWithdrawals.accountId, legacyAccount.id));
      await db.delete(accounts).where(eq(accounts.id, legacyAccount.id));
    }

    accountsByName.delete(legacyName);
  }
}
