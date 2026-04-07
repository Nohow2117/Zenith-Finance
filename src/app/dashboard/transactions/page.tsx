import { getAccounts, getTransactions } from "@/app/_actions/data";
import { TransactionsClient } from "./transactions-client";

export const metadata = { title: "Transactions" };

export default async function TransactionsPage() {
  const [accounts, transactions] = await Promise.all([getAccounts(), getTransactions()]);
  return <TransactionsClient accounts={accounts} transactions={transactions} />;
}
