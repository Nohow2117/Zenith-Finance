import { getAccounts, getTransactions } from "@/app/_actions/data";
import { TransactionsClient } from "./transactions-client";

export const metadata = { title: "Transactions" };

export default async function TransactionsPage() {
  const [allAccounts, allTransactions] = await Promise.all([getAccounts(), getTransactions()]);

  const activeAccounts = allAccounts.filter(a => a.isActive);
  const activeAccountIds = new Set(activeAccounts.map(a => a.id));
  const activeTransactions = allTransactions.filter(t => activeAccountIds.has(t.accountId));

  return <TransactionsClient accounts={activeAccounts} transactions={activeTransactions} />;
}
