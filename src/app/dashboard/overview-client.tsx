"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { PortfolioChart } from "@/components/charts/portfolio-chart";
import type { Account, Transaction } from "@/types";
import { EUR_USDT_RATE } from "@/lib/constants";

interface DashboardOverviewProps {
  accounts: Account[];
  transactions: Transaction[];
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function DashboardOverview({ accounts, transactions }: DashboardOverviewProps) {
  const totalBalance = accounts.reduce((sum, a) => sum + a.balanceEur, 0);
  const recentTx = transactions.slice(0, 5);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
      {/* Total Balance */}
      <motion.div variants={fadeUp}>
        <GlassCard glow className="p-8">
          <p className="text-sm text-text-secondary font-medium tracking-wide uppercase">Total Portfolio Value</p>
          <div className="mt-2 flex items-baseline gap-4">
            <AnimatedNumber
              value={totalBalance}
              prefix="€"
              className="text-4xl sm:text-5xl font-bold tracking-tight"
            />
            <span className="text-sm text-accent font-medium">
              ≈ <AnimatedNumber value={totalBalance * EUR_USDT_RATE} prefix="$" suffix=" USDT" className="text-accent" />
            </span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
              +4.2%
            </span>
            <span className="text-xs text-text-secondary">vs last month</span>
          </div>
        </GlassCard>
      </motion.div>

      {/* Chart */}
      <motion.div variants={fadeUp}>
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-4">Portfolio Performance</h2>
          <PortfolioChart />
        </GlassCard>
      </motion.div>

      {/* Accounts Grid */}
      <motion.div variants={fadeUp}>
        <h2 className="text-lg font-semibold mb-4">Your Accounts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account, i) => (
            <motion.div key={account.id} variants={fadeUp}>
              <GlassCard className="p-5 hover:border-accent/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-text-secondary">{account.name}</span>
                  {account.cardNetwork && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-secondary">
                      {account.cardNetwork}
                    </span>
                  )}
                </div>
                <AnimatedNumber
                  value={account.balanceEur}
                  prefix="€"
                  className="text-2xl font-bold"
                />
                <p className="text-xs text-text-secondary mt-1">
                  ≈ ${(account.balanceEur * EUR_USDT_RATE).toLocaleString("en-US", { maximumFractionDigits: 2 })} USDT
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div variants={fadeUp}>
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {recentTx.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      tx.type === "income"
                        ? "bg-income/10 text-income"
                        : tx.type === "yield"
                        ? "bg-yield/10 text-yield"
                        : "bg-expense/10 text-expense"
                    }`}
                  >
                    {tx.type === "expense" ? "↗" : "↙"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{tx.description}</p>
                    <p className="text-xs text-text-secondary">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p
                    className={`text-sm font-semibold ${
                      tx.type === "expense" ? "text-expense" : "text-income"
                    }`}
                  >
                    {tx.type === "expense" ? "-" : "+"}€{tx.amountEur.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-text-secondary">
                    ${tx.amountUsdt.toLocaleString("en-US", { minimumFractionDigits: 2 })} USDT
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
