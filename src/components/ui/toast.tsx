"use client";

import { useState, useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors: Record<string, string> = {
    success: "bg-accent/10 border-accent/30 text-accent",
    error: "bg-danger/10 border-danger/30 text-danger",
    info: "bg-white/5 border-border text-text-primary",
  };

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-[800]
        px-5 py-3 rounded-xl border backdrop-blur-xl
        animate-[fadeIn_0.3s_ease-out]
        ${colors[type]}
      `}
      role="alert"
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
  };

  const ToastComponent = toast ? (
    <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
  ) : null;

  return { showToast, ToastComponent };
}
