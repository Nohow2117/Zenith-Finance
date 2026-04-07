import { getAccounts, getTransactions } from "@/app/_actions/data";
import { AdminTransactionsClient } from "./admin-transactions-client";

export const metadata = { title: "Admin — Transactions" };

export default async function AdminTransactionsPage() {
  const accounts = await getAccounts();
  const transactions = await getTransactions();
  return <AdminTransactionsClient accounts={accounts} transactions={transactions} />;
}
