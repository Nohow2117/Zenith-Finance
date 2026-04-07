import { getAccounts, getWithdrawals } from "@/app/_actions/data";
import { WithdrawClient } from "./withdraw-client";

export const metadata = { title: "ATM Withdrawal" };

export default async function WithdrawPage() {
  const [accounts, withdrawals] = await Promise.all([getAccounts(), getWithdrawals()]);
  const bankAccounts = accounts.filter((a) => a.cardNumber);
  return <WithdrawClient accounts={bankAccounts} withdrawals={withdrawals} />;
}
