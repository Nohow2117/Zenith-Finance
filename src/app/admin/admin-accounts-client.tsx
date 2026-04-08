"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { updateAccountBalance, updateAccountCard, updateAccountStatus } from "@/app/_actions/data";
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
  const [cardLastFour, setCardLastFour] = useState(account.cardLastFour || "");
  const [expiry, setExpiry] = useState(account.cardExpiry || "");
  const [network, setNetwork] = useState(account.cardNetwork || "Visa");
  const [isActive, setIsActive] = useState(account.isActive);
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
    const result = await updateAccountCard(account.id, cardLastFour, expiry, network);
    setCardLoading(false);
    if (result.success) onSuccess("Card updated", "success");
    else onSuccess(result.error || "Error", "error");
  };

  const handleToggleStatus = async () => {
    const newStatus = !isActive;
    setIsActive(newStatus);
    const result = await updateAccountStatus(account.id, newStatus);
    if (!result.success) {
      setIsActive(!newStatus); // revert on failure
      onSuccess(result.error || "Failed to update status", "error");
    } else {
      onSuccess(`Account ${newStatus ? 'activated' : 'deactivated'}`, "success");
    }
  };

  return (
    <GlassCard className={`p-6 space-y-5 transition-opacity duration-300 ${!isActive ? 'opacity-50 grayscale-[0.5]' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-lg">{account.name}</h3>
          <button 
            type="button" 
            onClick={handleToggleStatus}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-card transition-colors duration-200 ease-in-out ${isActive ? 'bg-accent' : 'bg-border'}`}
          >
            <span aria-hidden="true" className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-2' : '-translate-x-2'}`} />
          </button>
        </div>
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
            label="Card Last Four"
            maxLength={4}
            value={cardLastFour}
            onChange={(e) => setCardLastFour(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="1234"
          />
          <Input
            label="Expiry"
            placeholder="MM/YY"
            maxLength={5}
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
        </div>
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
        <Button size="sm" variant="secondary" onClick={handleCardUpdate} loading={cardLoading}>
          Update Card
        </Button>
      </div>
    </GlassCard>
  );
}
