"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { updateAccountBalance, updateAccountCard } from "@/app/_actions/data";
import type { Account } from "@/types";

export function AdminAccountsClient({ accounts }: { accounts: Account[] }) {
  const { showToast, ToastComponent } = useToast();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Manage Accounts</h1>
        <p className="text-sm text-text-secondary mt-1">Update balances and card details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accounts.map((account, i) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <AccountEditor account={account} onSuccess={showToast} />
          </motion.div>
        ))}
      </div>
      {ToastComponent}
    </div>
  );
}

function AccountEditor({
  account,
  onSuccess,
}: {
  account: Account;
  onSuccess: (msg: string, type: "success" | "error" | "info") => void;
}) {
  const [balance, setBalance] = useState(account.balanceEur.toString());
  const [cardNumber, setCardNumber] = useState(account.cardNumber || "");
  const [expiry, setExpiry] = useState(account.cardExpiry || "");
  const [cvv, setCvv] = useState(account.cardCvv || "");
  const [network, setNetwork] = useState(account.cardNetwork || "Visa");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);

  const handleBalanceUpdate = async () => {
    setBalanceLoading(true);
    const result = await updateAccountBalance(account.id, parseFloat(balance));
    setBalanceLoading(false);
    if (result.success) onSuccess("Balance updated", "success");
    else onSuccess(result.error || "Error", "error");
  };

  const handleCardUpdate = async () => {
    setCardLoading(true);
    const result = await updateAccountCard(account.id, cardNumber, expiry, cvv, network);
    setCardLoading(false);
    if (result.success) onSuccess("Card updated", "success");
    else onSuccess(result.error || "Error", "error");
  };

  return (
    <GlassCard className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{account.name}</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">
          &euro;{account.balanceEur.toLocaleString()}
        </span>
      </div>

      {/* Balance */}
      <div className="space-y-3">
        <Input
          label="Balance (EUR)"
          type="number"
          step="0.01"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />
        <Button size="sm" onClick={handleBalanceUpdate} loading={balanceLoading}>
          Update Balance
        </Button>
      </div>

      {/* Card Details */}
      <div className="border-t border-border/30 pt-4 space-y-3">
        <p className="text-sm font-medium text-text-secondary">Card Details</p>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Card Number"
            maxLength={19}
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/[^\d ]/g, "").slice(0, 19))}
            placeholder="0000 0000 0000 0000"
          />
          <Input
            label="Expiry"
            placeholder="MM/YY"
            maxLength={5}
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Input
            label="CVV"
            maxLength={4}
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary" htmlFor={`network-${account.id}`}>
              Network
            </label>
            <select
              id={`network-${account.id}`}
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full rounded-xl bg-bg-secondary border border-border px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent/50"
            >
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
            </select>
          </div>
        </div>
        <Button size="sm" variant="secondary" onClick={handleCardUpdate} loading={cardLoading}>
          Update Card
        </Button>
      </div>
    </GlassCard>
  );
}
