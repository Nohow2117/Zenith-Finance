import { requireUserSession } from "@/lib/auth/guards";
import { DashboardShell } from "./dashboard-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireUserSession();
  return <DashboardShell>{children}</DashboardShell>;
}
