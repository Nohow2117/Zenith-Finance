import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE_NAME, SESSION_COOKIE_NAME } from "@/lib/constants";
import { verifySessionToken } from "@/lib/auth/session";
import { HomeHero } from "@/components/ui/home-hero";

export const metadata = { title: "ArtDeFinance — Hybrid Finance Platform" };

export default async function HomePage() {
  const cookieStore = await cookies();
  const userSession = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const adminSession = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (await verifySessionToken(userSession, "user")) redirect("/dashboard");
  if (await verifySessionToken(adminSession, "admin")) redirect("/admin");

  return <HomeHero />;
}
