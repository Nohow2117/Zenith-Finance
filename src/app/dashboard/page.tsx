import { getAccounts, getVisibleTransactions } from "@/app/_actions/data";
import { MAX_VISIBLE_TRANSACTIONS } from "@/lib/constants";
import { DashboardOverview } from "./overview-client";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [allAccounts, visibleTransactions] = await Promise.all([
    getAccounts(),
    getVisibleTransactions(MAX_VISIBLE_TRANSACTIONS),
  ]);

  const activeAccounts = allAccounts.filter(a => a.isActive);

  return <DashboardOverview accounts={activeAccounts} transactions={visibleTransactions} />;
}
