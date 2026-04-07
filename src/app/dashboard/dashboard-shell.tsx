"use client";

import { Navbar } from "@/components/layout/navbar";
import { logoutUser } from "@/app/_actions/auth";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar variant="user" onLogout={() => logoutUser()} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
