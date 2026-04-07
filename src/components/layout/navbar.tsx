"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME } from "@/lib/constants";

interface NavbarProps {
  variant: "user" | "admin";
  onLogout?: () => void;
}

export function Navbar({ variant, onLogout }: NavbarProps) {
  const pathname = usePathname();

  const userLinks = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/cards", label: "Cards" },
    { href: "/dashboard/transactions", label: "Transactions" },
    { href: "/dashboard/withdraw", label: "ATM Withdrawal" },
  ];

  const adminLinks = [
    { href: "/admin", label: "Accounts" },
    { href: "/admin/transactions", label: "Transactions" },
    { href: "/admin/ai-import", label: "AI Importer" },
  ];

  const links = variant === "user" ? userLinks : adminLinks;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-bg-primary/80 border-b border-border/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          <Link
            href={variant === "user" ? "/dashboard" : "/admin"}
            className="flex items-center gap-2"
            aria-label="Go to homepage"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
              <span className="text-bg-primary font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">{APP_NAME}</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? "bg-accent/10 text-accent"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                    }
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
              aria-label="Sign out"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden overflow-x-auto gap-1 pb-3 -mx-4 px-4 scrollbar-none">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${isActive ? "bg-accent/10 text-accent" : "text-text-secondary"}
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
