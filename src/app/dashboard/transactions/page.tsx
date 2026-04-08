import { getAccounts, getVisibleTransactions } from "@/app/_actions/data";
import { MAX_VISIBLE_TRANSACTIONS } from "@/lib/constants";
import { TransactionsClient } from "./transactions-client";

export const metadata = { title: "Transactions" };

export default async function TransactionsPage() {
  const [allAccounts, visibleTransactions] = await Promise.all([
    getAccounts(),
    getVisibleTransactions(MAX_VISIBLE_TRANSACTIONS),
  ]);

  const activeAccounts = allAccounts.filter(a => a.isActive);

  return <TransactionsClient accounts={activeAccounts} transactions={visibleTransactions} />;
}
