import { getAccounts, getTransactions } from "@/app/_actions/data";
import { DashboardOverview } from "./overview-client";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [accounts, transactions] = await Promise.all([getAccounts(), getTransactions()]);

  return <DashboardOverview accounts={accounts} transactions={transactions} />;
}
