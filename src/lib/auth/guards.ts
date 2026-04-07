"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE_NAME, SESSION_COOKIE_NAME } from "@/lib/constants";
import { verifySessionToken } from "./session";

async function hasAllowedSession(scopes: ("user" | "admin")[]): Promise<boolean> {
  const cookieStore = await cookies();
  const userToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const adminToken = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  for (const scope of scopes) {
    const token = scope === "admin" ? adminToken : userToken;
    if (await verifySessionToken(token, scope)) {
      return true;
    }
  }

  return false;
}

export async function requireUserSession(): Promise<void> {
  if (!(await hasAllowedSession(["user"]))) {
    redirect("/login");
  }
}

export async function requireAdminSession(): Promise<void> {
  if (!(await hasAllowedSession(["admin"]))) {
    redirect("/admin-login");
  }
}

export async function hasAdminSession(): Promise<boolean> {
  return hasAllowedSession(["admin"]);
}

export async function hasUserSession(): Promise<boolean> {
  return hasAllowedSession(["user"]);
}

export async function requireAppSession(): Promise<void> {
  if (!(await hasAllowedSession(["user", "admin"]))) {
    redirect("/login");
  }
}
