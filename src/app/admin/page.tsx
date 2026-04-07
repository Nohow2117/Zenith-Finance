import { getAccounts } from "@/app/_actions/data";
import { AdminAccountsClient } from "./admin-accounts-client";

export const metadata = { title: "Admin — Accounts" };

export default async function AdminPage() {
  const accounts = await getAccounts();
  return <AdminAccountsClient accounts={accounts} />;
}
