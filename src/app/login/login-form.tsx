"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ACCOUNT_SEARCH_DELAY_MS, PIN_LENGTH } from "@/lib/constants";
import { beginUserLogin, completeUserLogin, resetUserLoginFlow } from "@/app/_actions/auth";

type LoginStep = "username" | "searching" | "pin";

interface LoginFormProps {
  initialHasChallenge: boolean;
}

export function LoginForm({ initialHasChallenge }: LoginFormProps) {
  const [step, setStep] = useState<LoginStep>(initialHasChallenge ? "pin" : "username");
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleUsernameSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError("");
    setStep("searching");

    const [result] = await Promise.all([
      beginUserLogin(username),
      new Promise((resolve) => setTimeout(resolve, ACCOUNT_SEARCH_DELAY_MS)),
    ]);

    setLoading(false);

    if (result.success) {
      setStep("pin");
      return;
    }

    setError(result.error || "Unable to verify credentials.");
    setStep("username");
  };

  const handlePinSubmit = async () => {
    if (pin.length !== PIN_LENGTH) return;
    setLoading(true);
    setError("");

    try {
      const result = await completeUserLogin(pin);
      if (result && !result.success) {
        setError(result.error || "Unable to verify credentials.");
        setPin("");
        if (result.data?.resetFlow) {
          setStep("username");
        }
      }
    } catch {
      // redirect throws
    } finally {
      setLoading(false);
    }
  };

  const handleResetFlow = async () => {
    setIsResetting(true);
    setError("");
    setPin("");
    await resetUserLoginFlow();
    setStep("username");
    setIsResetting(false);
  };

  return (
    <div className="space-y-6">
      {step === "username" && (
        <form onSubmit={handleUsernameSubmit} className="space-y-4">
          <Input
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter your username"
            autoComplete="username"
            autoFocus
            aria-label="User username"
            error={error}
          />
          <Button type="submit" className="w-full" loading={loading} disabled={!username.trim()}>
            Find Account
          </Button>
        </form>
      )}

      {step === "searching" && (
        <div className="space-y-5 rounded-2xl border border-border/60 bg-bg-card/70 p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
            <svg
              className="h-6 w-6 animate-spin text-accent motion-reduce:animate-none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-text-primary">Searching account...</h2>
            <p className="text-sm text-text-secondary">Verifying your access profile and preparing the secure PIN step.</p>
          </div>
        </div>
      )}

      {step === "pin" && (
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-accent/70">Account Located</p>
            <p className="text-sm text-text-secondary">Enter your 4-digit PIN to unlock the dashboard.</p>
          </div>

          <div className="flex justify-center gap-3" aria-label="PIN digits">
            {Array.from({ length: PIN_LENGTH }).map((_, index) => (
              <div
                key={index}
                className={`
                  flex h-16 w-14 items-center justify-center rounded-xl border-2 text-2xl font-bold transition-all duration-200
                  ${pin.length > index ? "border-accent bg-accent/10 text-accent" : "border-border bg-bg-card"}
                `}
              >
                {pin[index] ? "•" : ""}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2" role="group" aria-label="PIN keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "del"].map((value, index) => (
              <button
                key={index}
                type="button"
                className={`
                  h-14 rounded-xl border border-border/50 text-lg font-semibold transition-all
                  ${value === null ? "invisible" : "bg-bg-card hover:bg-white/10 active:scale-95"}
                `}
                onClick={() => {
                  if (value === "del") setPin((current) => current.slice(0, -1));
                  else if (value !== null && pin.length < PIN_LENGTH) setPin((current) => current + value);
                }}
                aria-label={value === "del" ? "Delete PIN digit" : `Digit ${value}`}
              >
                {value === "del" ? "⌫" : value}
              </button>
            ))}
          </div>

          {error && <p className="text-center text-sm text-danger">{error}</p>}

          <div className="space-y-3">
            <Button className="w-full" onClick={handlePinSubmit} loading={loading} disabled={pin.length !== PIN_LENGTH}>
              Unlock Dashboard
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              onClick={handleResetFlow}
              loading={isResetting}
              disabled={loading || isResetting}
            >
              Use Different Username
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
