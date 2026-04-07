"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { createWithdrawal } from "@/app/_actions/data";
import { ATM_AMOUNTS } from "@/lib/constants";
import type { Account, AtmWithdrawal } from "@/types";

interface WithdrawClientProps {
  accounts: Account[];
  withdrawals: (AtmWithdrawal & { accountName: string })[];
}

export function WithdrawClient({ accounts, withdrawals }: WithdrawClientProps) {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [pickupDate, setPickupDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const handleSubmit = async () => {
    if (!selectedAccount || !selectedAmount || !pickupDate) {
      showToast("Please fill all fields", "error");
      return;
    }
    setLoading(true);
    const result = await createWithdrawal(selectedAccount, selectedAmount, pickupDate);
    setLoading(false);
    if (result.success) {
      showToast("Withdrawal request submitted", "success");
      setSelectedAccount("");
      setSelectedAmount(null);
      setPickupDate("");
    } else {
      showToast(result.error || "Error", "error");
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">ATM Withdrawal</h1>
        <p className="text-sm text-text-secondary mt-1">Schedule a cash pickup at your nearest ATM</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <GlassCard className="p-6 space-y-6">
          <h2 className="text-lg font-semibold">New Request</h2>

          {/* Account Select */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary" htmlFor="account-select">
              Select Account
            </label>
            <select
              id="account-select"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full rounded-xl bg-bg-secondary border border-border px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-all"
              aria-label="Select account for withdrawal"
            >
              <option value="">Choose account...</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} — €{a.balanceEur.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Amount</label>
            <div className="grid grid-cols-3 gap-3">
              {ATM_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`
                    py-4 rounded-xl text-lg font-bold transition-all
                    ${selectedAmount === amount
                      ? "bg-accent text-bg-primary scale-105 shadow-lg shadow-accent/20"
                      : "bg-bg-secondary border border-border hover:border-accent/30 text-text-primary"}
                  `}
                  aria-label={`Select €${amount} withdrawal`}
                  aria-pressed={selectedAmount === amount}
                >
                  €{amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary" htmlFor="pickup-date">
              Pickup Date
            </label>
            <input
              id="pickup-date"
              type="date"
              min={minDate}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full rounded-xl bg-bg-secondary border border-border px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-all"
            />
          </div>

          <Button className="w-full" onClick={handleSubmit} loading={loading}>
            Confirm Request
          </Button>
        </GlassCard>

        {/* History */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-4">Withdrawal History</h2>
          <div className="space-y-3">
            {withdrawals.length === 0 && (
              <p className="text-sm text-text-secondary text-center py-8">No withdrawals yet</p>
            )}
            {withdrawals.map((w, i) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{w.accountName}</p>
                  <p className="text-xs text-text-secondary">{w.pickupDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">€{w.amount.toLocaleString()}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning font-medium">
                    {w.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {ToastComponent}
    </div>
  );
}
