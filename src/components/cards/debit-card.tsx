"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Account } from "@/types";
import { PIN_LENGTH } from "@/lib/constants";

interface DebitCardProps {
  account: Account;
}

export function DebitCard({ account }: DebitCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleShowData = () => {
    if (!account.cardLastFour) return;
    setShowPinModal(true);
    setPin("");
    setError("");
  };

  const handlePinSubmit = async () => {
    if (pin.length !== PIN_LENGTH) {
      setError("PIN must be 4 digits");
      return;
    }
    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsVerifying(false);
    setShowPinModal(false);
    setIsRevealed(true);
  };

  const gradients: Record<string, string> = {
    Visa: "from-[#1A1F71] via-[#2D338A] to-[#1A1F71]",
    Mastercard: "from-[#EB001B] via-[#F79E1B] to-[#EB001B]",
  };

  const gradient = account.cardNetwork ? gradients[account.cardNetwork] ?? "from-bg-card to-bg-secondary" : "from-accent/20 via-bg-card to-accent/10";

  const revealedNumber = account.cardLastFour
    ? `•••• •••• •••• ${account.cardLastFour}`
    : "•••• •••• •••• ••••";

  const maskedNumber = account.cardLastFour
    ? `•••• •••• •••• ${account.cardLastFour}`
    : "•••• •••• •••• ••••";

  return (
    <>
      <motion.div
        className={`
          relative w-full max-w-sm aspect-[1.586/1] rounded-2xl overflow-hidden
          bg-gradient-to-br ${gradient}
          shadow-xl shadow-black/20
          border border-white/10
          cursor-default select-none
        `}
        whileHover={{ scale: 1.02, rotateY: 2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative h-full flex flex-col justify-between p-6">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-white/60 tracking-wider uppercase">
              {account.name}
            </span>
            {account.cardNetwork && (
              <span className="text-sm font-bold text-white/80">{account.cardNetwork}</span>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-lg font-mono tracking-[0.2em] text-white/90">
              {isRevealed ? revealedNumber : maskedNumber}
            </p>
          </div>

          <div className="flex justify-between items-end">
            <div className="flex gap-6">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Expires</p>
                <p className="text-sm font-mono text-white/80">
                  {isRevealed ? account.cardExpiry : "••/••"}
                </p>
              </div>
            </div>
            {account.cardLastFour && !isRevealed && (
              <Button
                size="sm"
                variant="ghost"
                className="text-white/70 hover:text-white border border-white/20 hover:border-white/40"
                onClick={handleShowData}
                aria-label="Show card data"
              >
                Show Data
              </Button>
            )}
            {isRevealed && (
              <Button
                size="sm"
                variant="ghost"
                className="text-white/70 hover:text-white border border-white/20"
                onClick={() => setIsRevealed(false)}
                aria-label="Hide card data"
              >
                Hide
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* PIN Modal */}
      <AnimatePresence>
        {showPinModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[400]"
              onClick={() => setShowPinModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 flex items-center justify-center z-[500] p-4"
            >
              <div className="bg-bg-card border border-border rounded-2xl p-8 w-full max-w-sm space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Enter PIN</h3>
                  <p className="text-sm text-text-secondary mt-1">Enter your 4-digit PIN to reveal protected card details</p>
                </div>
                <div className="flex justify-center gap-3">
                  {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                    <div
                      key={i}
                      className={`
                        w-12 h-14 rounded-xl border-2 flex items-center justify-center text-xl font-bold
                        transition-all duration-200
                        ${pin.length > i ? "border-accent bg-accent/10 text-accent" : "border-border bg-bg-secondary text-text-secondary"}
                      `}
                    >
                      {pin[i] ? "•" : ""}
                    </div>
                  ))}
                </div>
                <input
                  type="tel"
                  maxLength={PIN_LENGTH}
                  value={pin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, PIN_LENGTH);
                    setPin(val);
                    setError("");
                  }}
                  className="sr-only"
                  autoFocus
                  aria-label="PIN input"
                  onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
                />
                {error && <p className="text-center text-sm text-danger">{error}</p>}
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "del"].map((n, i) => (
                    <button
                      key={i}
                      className={`
                        h-12 rounded-xl text-lg font-medium transition-all
                        ${n === null ? "invisible" : "bg-bg-secondary hover:bg-white/10 active:scale-95"}
                      `}
                      onClick={() => {
                        if (n === "del") setPin((p) => p.slice(0, -1));
                        else if (n !== null && pin.length < PIN_LENGTH) setPin((p) => p + n);
                      }}
                      aria-label={n === "del" ? "Delete" : `Digit ${n}`}
                    >
                      {n === "del" ? "⌫" : n}
                    </button>
                  ))}
                </div>
                <Button
                  className="w-full"
                  onClick={handlePinSubmit}
                  loading={isVerifying}
                  disabled={pin.length !== PIN_LENGTH}
                >
                  Reveal Details
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
