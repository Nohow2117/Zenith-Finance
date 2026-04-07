import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { HomeHero } from "@/components/ui/home-hero";

export const metadata = { title: "ArtDeFinance — Hybrid Finance Platform" };

export default async function HomePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (session?.value) redirect("/dashboard");

  return <HomeHero />;
}
