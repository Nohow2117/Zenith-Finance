"use client";

import { useState } from "react";
import { loginUser } from "@/app/_actions/auth";
import { Button } from "@/components/ui/button";
import { PIN_LENGTH } from "@/lib/constants";

export function LoginForm() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (pin.length !== PIN_LENGTH) return;
    setLoading(true);
    setError("");
    try {
      const result = await loginUser(pin);
      if (result && !result.success) setError(result.error || "Invalid PIN");
    } catch {
      // redirect throws
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-3">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div
            key={i}
            className={`
              w-14 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-bold
              transition-all duration-200
              ${pin.length > i ? "border-accent bg-accent/10 text-accent" : "border-border bg-bg-card"}
            `}
          >
            {pin[i] ? "•" : ""}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "del"].map((n, i) => (
          <button
            key={i}
            className={`
              h-14 rounded-xl text-lg font-semibold transition-all
              ${n === null ? "invisible" : "bg-bg-card hover:bg-white/10 active:scale-95 border border-border/50"}
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

      {error && (
        <p className="text-center text-sm text-danger">{error}</p>
      )}

      <Button
        className="w-full"
        onClick={handleSubmit}
        loading={loading}
        disabled={pin.length !== PIN_LENGTH}
      >
        Unlock Dashboard
      </Button>
    </div>
  );
}
