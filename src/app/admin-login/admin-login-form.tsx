"use client";

import { useState } from "react";
import { loginAdmin } from "@/app/_actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const result = await loginAdmin(password);
      if (result && !result.success) setError(result.error || "Invalid password");
    } catch {
      // redirect throws
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter admin password"
        error={error}
        autoFocus
      />
      <Button type="submit" className="w-full" loading={loading} disabled={!password}>
        Sign In
      </Button>
    </form>
  );
}
