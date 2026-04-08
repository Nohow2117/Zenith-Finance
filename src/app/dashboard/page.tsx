import { getAccounts, getTransactions } from "@/app/_actions/data";
import { DashboardOverview } from "./overview-client";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [allAccounts, allTransactions] = await Promise.all([getAccounts(), getTransactions()]);

  const activeAccounts = allAccounts.filter(a => a.isActive);
  const activeAccountIds = new Set(activeAccounts.map(a => a.id));
  const activeTransactions = allTransactions.filter(t => activeAccountIds.has(t.accountId));

  return <DashboardOverview accounts={activeAccounts} transactions={activeTransactions} />;
}
