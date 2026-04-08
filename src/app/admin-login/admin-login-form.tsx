"use client";

import { useState } from "react";
import { loginAdmin } from "@/app/_actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true);
    setError("");
    try {
      const result = await loginAdmin(username, password);
      if (result && !result.success) setError(result.error || "Unable to verify credentials.");
    } catch {
      // redirect throws
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter admin username"
        autoComplete="username"
        autoFocus
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter admin password"
        autoComplete="current-password"
        error={error}
      />
      <Button type="submit" className="w-full" loading={loading} disabled={!username.trim() || !password}>
        Sign In
      </Button>
    </form>
  );
}
