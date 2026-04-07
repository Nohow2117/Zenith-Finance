"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import type { Account, Transaction } from "@/types";

interface TransactionsClientProps {
  accounts: Account[];
  transactions: Transaction[];
}

export function TransactionsClient({ accounts, transactions }: TransactionsClientProps) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);

  const accountMap = new Map(accounts.map((a) => [a.id, a.name]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <p className="text-sm text-text-secondary mt-1">All movements across your accounts</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { key: "all", label: "All" },
          { key: "income", label: "Income" },
          { key: "expense", label: "Expenses" },
          { key: "yield", label: "Yield" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${filter === f.key ? "bg-accent/10 text-accent border border-accent/30" : "bg-bg-card text-text-secondary border border-border hover:border-accent/20"}
            `}
            aria-label={`Filter by ${f.label}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Transaction history">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs font-medium text-text-secondary px-6 py-4 uppercase tracking-wider">Date</th>
                <th className="text-left text-xs font-medium text-text-secondary px-6 py-4 uppercase tracking-wider">Description</th>
                <th className="text-left text-xs font-medium text-text-secondary px-6 py-4 uppercase tracking-wider">Type</th>
                <th className="text-right text-xs font-medium text-text-secondary px-6 py-4 uppercase tracking-wider">EUR</th>
                <th className="text-right text-xs font-medium text-text-secondary px-6 py-4 uppercase tracking-wider">USDT</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx, i) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/20 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 text-sm">{tx.date}</td>
                  <td className="px-6 py-4 text-sm font-medium">{tx.description}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        tx.type === "income"
                          ? "bg-income/10 text-income"
                          : tx.type === "yield"
                          ? "bg-yield/10 text-yield"
                          : "bg-expense/10 text-expense"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm text-right font-semibold ${tx.type === "expense" ? "text-expense" : "text-income"}`}>
                    {tx.type === "expense" ? "-" : "+"}€{tx.amountEur.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-text-secondary">
                    ${tx.amountUsdt.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-secondary">No transactions found</div>
        )}
      </GlassCard>
    </div>
  );
}
