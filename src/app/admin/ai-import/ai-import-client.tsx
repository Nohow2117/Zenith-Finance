"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { bulkAddTransactions } from "@/app/_actions/data";
import type { Account, ParsedTransaction } from "@/types";

export function AiImportClient({ accounts }: { accounts: Account[] }) {
  const [text, setText] = useState("");
  const [accountId, setAccountId] = useState("");
  const [parsed, setParsed] = useState<ParsedTransaction[]>([]);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const handleParse = async () => {
    if (!text.trim()) {
      showToast("Paste statement text first", "error");
      return;
    }
    setParsing(true);
    try {
      const res = await fetch("/api/ai/parse-statement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "AI parsing failed", "error");
        return;
      }
      setParsed(data.transactions || []);
      if ((data.transactions || []).length === 0) {
        showToast("No transactions found in text", "info");
      }
    } catch {
      showToast("Failed to connect to AI service", "error");
    } finally {
      setParsing(false);
    }
  };

  const handleSave = async () => {
    if (!accountId) {
      showToast("Select an account", "error");
      return;
    }
    setSaving(true);
    const result = await bulkAddTransactions(accountId, parsed);
    setSaving(false);
    if (result.success) {
      showToast("Transactions imported successfully", "success");
      setParsed([]);
      setText("");
    } else {
      showToast(result.error || "Error saving", "error");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">AI Transaction Importer</h1>
        <p className="text-sm text-text-secondary mt-1">
          Paste a bank statement text and let AI extract the transactions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input */}
        <GlassCard className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Statement Text</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
            className="w-full rounded-xl bg-bg-secondary border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent/50 resize-none transition-all"
            placeholder="Paste bank statement text here..."
            aria-label="Bank statement text"
          />
          <Button onClick={handleParse} loading={parsing} disabled={!text.trim()}>
            Process with AI
          </Button>
        </GlassCard>

        {/* Results */}
        <GlassCard className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Extracted Transactions</h2>

          <AnimatePresence mode="wait">
            {parsed.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="max-h-[400px] overflow-y-auto space-y-2">
                  {parsed.map((tx, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary border border-border/30"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{tx.description}</p>
                        <p className="text-xs text-text-secondary">{tx.date}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className={`text-sm font-semibold ${tx.type === "expense" ? "text-expense" : "text-income"}`}>
                          €{tx.amountEur.toLocaleString()}
                        </p>
                        <span className="text-xs text-text-secondary">{tx.type}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t border-border/30 pt-4 space-y-3">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-text-secondary" htmlFor="import-account">
                      Save to Account
                    </label>
                    <select
                      id="import-account"
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
                  <Button onClick={handleSave} loading={saving} disabled={!accountId}>
                    Save to Database
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-text-secondary text-sm"
              >
                <p>No transactions parsed yet.</p>
                <p className="mt-1">Paste a text and click &quot;Process with AI&quot;</p>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>

      {ToastComponent}
    </div>
  );
}
