import { getAccounts } from "@/app/_actions/data";
import { AdminTransactionsClient } from "./admin-transactions-client";

export const metadata = { title: "Admin — Transactions" };

export default async function AdminTransactionsPage() {
  const accounts = await getAccounts();
  return <AdminTransactionsClient accounts={accounts} />;
}
