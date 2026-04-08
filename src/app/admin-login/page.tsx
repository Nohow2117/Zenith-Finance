import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE_NAME } from "@/lib/constants";
import { verifySessionToken } from "@/lib/auth/session";
import { AdminLoginForm } from "./admin-login-form";

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (await verifySessionToken(session, "admin")) {
    redirect("/admin");
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-yield/5 rounded-full blur-[100px]" />
      </div>
      <div className="relative w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yield to-yield/60 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">⚙</span>
          </div>
          <h1 className="text-2xl font-bold">Admin Access</h1>
          <p className="text-sm text-text-secondary">Enter your admin username and password to continue</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
