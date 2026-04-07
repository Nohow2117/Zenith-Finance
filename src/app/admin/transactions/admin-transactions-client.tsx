"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { addTransaction } from "@/app/_actions/data";
import type { Account } from "@/types";

export function AdminTransactionsClient({ accounts }: { accounts: Account[] }) {
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense" | "yield">("income");
  const [loading, setLoading] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId || !description || !amount) {
      showToast("Fill all fields", "error");
      return;
    }
    setLoading(true);
    const result = await addTransaction(accountId, date, description, parseFloat(amount), type);
    setLoading(false);
    if (result.success) {
      showToast("Transaction added", "success");
      setDescription("");
      setAmount("");
    } else {
      showToast(result.error || "Error", "error");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Add Transaction</h1>
        <p className="text-sm text-text-secondary mt-1">Manually create a new transaction</p>
      </div>

      <GlassCard className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary" htmlFor="tx-account">Account</label>
            <select
              id="tx-account"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full rounded-xl bg-bg-secondary border border-border px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent/50"
            >
              <option value="">Select account...</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Transaction description" />
          <Input label="Amount (EUR)" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary">Type</label>
            <div className="flex gap-2">
              {(["income", "expense", "yield"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    type === t ? "bg-accent/10 text-accent border border-accent/30" : "bg-bg-secondary border border-border text-text-secondary"
                  }`}
                  aria-pressed={type === t}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" loading={loading}>Add Transaction</Button>
        </form>
      </GlassCard>
      {ToastComponent}
    </div>
  );
}
