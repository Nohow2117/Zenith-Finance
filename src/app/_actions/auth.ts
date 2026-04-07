"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, ADMIN_SESSION_COOKIE_NAME } from "@/lib/constants";
import type { ActionResult } from "@/types";
import { createSessionToken } from "@/lib/auth/session";

export async function loginUser(pin: string): Promise<ActionResult> {
  if (pin !== process.env.USER_PIN) {
    return { success: false, error: "Invalid PIN" };
  }
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, await createSessionToken("user"), {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });
  redirect("/dashboard");
}

export async function loginAdmin(password: string): Promise<ActionResult> {
  if (password !== process.env.ADMIN_PASSWORD) {
    return { success: false, error: "Invalid password" };
  }
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, await createSessionToken("admin"), {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });
  redirect("/admin");
}

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
  redirect("/admin-login");
}
