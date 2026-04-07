"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { addTransaction, deleteTransactions } from "@/app/_actions/data";
import type { Account, Transaction } from "@/types";

export function AdminTransactionsClient({ accounts, transactions = [] }: { accounts: Account[], transactions: Transaction[] }) {
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense" | "yield">("income");
  const [loading, setLoading] = useState(false);
  
  const [selectedTxIds, setSelectedTxIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async (idsToDelete: string[]) => {
    if (!confirm(`Are you sure you want to delete ${idsToDelete.length} transaction(s)?`)) return;
    
    setIsDeleting(true);
    const result = await deleteTransactions(idsToDelete);
    setIsDeleting(false);
    
    if (result.success) {
      showToast("Transaction(s) deleted successfully", "success");
      setSelectedTxIds(prev => prev.filter(id => !idsToDelete.includes(id)));
    } else {
      showToast(result.error || "Error deleting transactions", "error");
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedTxIds(prev => prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedTxIds.length === transactions.length) {
      setSelectedTxIds([]);
    } else {
      setSelectedTxIds(transactions.map(t => t.id));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Manage Transactions</h1>
        <p className="text-sm text-text-secondary mt-1">Add or remove transactions manually</p>
      </div>

      <GlassCard className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mb-8 border-b border-border pb-8">
          <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
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

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Existing Transactions</h2>
            {selectedTxIds.length > 0 && (
              <Button 
                variant="danger" 
                onClick={() => handleDelete(selectedTxIds)} 
                loading={isDeleting}
                className="text-red-400 border-red-500/20 hover:bg-red-500/10"
              >
                Delete Selected ({selectedTxIds.length})
              </Button>
            )}
          </div>

          {transactions.length === 0 ? (
            <p className="text-text-secondary text-sm">No transactions found.</p>
          ) : (
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-bg-secondary/50 text-text-secondary">
                  <tr>
                    <th className="p-3 w-10">
                      <input 
                        type="checkbox" 
                        checked={selectedTxIds.length === transactions.length && transactions.length > 0} 
                        onChange={toggleAll}
                        className="rounded border-border bg-bg-secondary text-accent focus:ring-accent"
                      />
                    </th>
                    <th className="p-3 font-medium">Date</th>
                    <th className="p-3 font-medium">Description</th>
                    <th className="p-3 font-medium">Amount</th>
                    <th className="p-3 font-medium">Type</th>
                    <th className="p-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/[0.02]">
                      <td className="p-3">
                        <input 
                          type="checkbox" 
                          checked={selectedTxIds.includes(tx.id)}
                          onChange={() => toggleSelection(tx.id)}
                          className="rounded border-border bg-bg-secondary text-accent focus:ring-accent"
                        />
                      </td>
                      <td className="p-3 text-text-secondary">{tx.date}</td>
                      <td className="p-3 text-text-primary">{tx.description}</td>
                      <td className="p-3 font-mono">€{tx.amountEur.toFixed(2)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium uppercase tracking-wider ${
                          tx.type === 'income' ? 'bg-green-500/10 text-green-400' :
                          tx.type === 'expense' ? 'bg-red-500/10 text-red-400' :
                          'bg-blue-500/10 text-blue-400'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => handleDelete([tx.id])}
                          disabled={isDeleting}
                          className="text-text-secondary hover:text-red-400 transition-colors text-xs uppercase font-semibold tracking-wider disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </GlassCard>
      {ToastComponent}
    </div>
  );
}
