"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE_NAME,
  ADMIN_SESSION_COOKIE_NAME,
  LOGIN_CHALLENGE_COOKIE_NAME,
  SESSION_TTL_SECONDS,
  LOGIN_CHALLENGE_TTL_SECONDS,
} from "@/lib/constants";
import type { ActionResult } from "@/types";
import {
  createSessionToken,
  createUserLoginChallengeToken,
  verifyUserLoginChallengeToken,
} from "@/lib/auth/session";
import { initializeDatabase } from "@/lib/db/init";
import { getAdminPassword, getAdminUsername, getUserPin, getUserUsername } from "@/lib/auth/config";
import { getClientIpAddress } from "@/lib/auth/request";
import { getLoginLockState, recordFailedLoginAttempt, resetLoginAttempts } from "@/lib/auth/login-attempts";

interface AuthFeedback {
  lockedUntil?: string;
  remainingSeconds?: number;
  resetFlow?: boolean;
}

function getLockedMessage(remainingSeconds?: number): string {
  const remainingMinutes = Math.max(1, Math.ceil((remainingSeconds || 0) / 60));
  return `Access temporarily locked. Try again in ${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}.`;
}

export async function beginUserLogin(username: string): Promise<ActionResult<AuthFeedback>> {
  await initializeDatabase();

  const normalizedUsername = username.trim();
  const ipAddress = await getClientIpAddress();
  const cookieStore = await cookies();
  const lockState = await getLoginLockState("user", normalizedUsername, ipAddress);

  if (lockState.locked) {
    cookieStore.delete(LOGIN_CHALLENGE_COOKIE_NAME);
    return {
      success: false,
      error: getLockedMessage(lockState.remainingSeconds),
      data: { lockedUntil: lockState.lockedUntil, remainingSeconds: lockState.remainingSeconds },
    };
  }

  if (normalizedUsername !== getUserUsername()) {
    const nextLockState = await recordFailedLoginAttempt("user", normalizedUsername, ipAddress);
    cookieStore.delete(LOGIN_CHALLENGE_COOKIE_NAME);

    if (nextLockState.locked) {
      return {
        success: false,
        error: getLockedMessage(nextLockState.remainingSeconds),
        data: { lockedUntil: nextLockState.lockedUntil, remainingSeconds: nextLockState.remainingSeconds },
      };
    }

    return { success: false, error: "Unable to verify credentials." };
  }

  cookieStore.set(
    LOGIN_CHALLENGE_COOKIE_NAME,
    await createUserLoginChallengeToken(normalizedUsername, LOGIN_CHALLENGE_TTL_SECONDS),
    {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
      maxAge: LOGIN_CHALLENGE_TTL_SECONDS,
      path: "/",
    }
  );

  return { success: true };
}

export async function completeUserLogin(pin: string): Promise<ActionResult<AuthFeedback>> {
  await initializeDatabase();

  const cookieStore = await cookies();
  const challengeToken = cookieStore.get(LOGIN_CHALLENGE_COOKIE_NAME)?.value;
  const challenge = await verifyUserLoginChallengeToken(challengeToken);
  if (!challenge) {
    cookieStore.delete(LOGIN_CHALLENGE_COOKIE_NAME);
    return {
      success: false,
      error: "Login session expired. Enter your username again.",
      data: { resetFlow: true },
    };
  }

  const ipAddress = await getClientIpAddress();
  const lockState = await getLoginLockState("user", challenge.username, ipAddress);
  if (lockState.locked) {
    cookieStore.delete(LOGIN_CHALLENGE_COOKIE_NAME);
    return {
      success: false,
      error: getLockedMessage(lockState.remainingSeconds),
      data: { lockedUntil: lockState.lockedUntil, remainingSeconds: lockState.remainingSeconds, resetFlow: true },
    };
  }

  if (pin !== getUserPin()) {
    const nextLockState = await recordFailedLoginAttempt("user", challenge.username, ipAddress);
    if (nextLockState.locked) {
      cookieStore.delete(LOGIN_CHALLENGE_COOKIE_NAME);
      return {
        success: false,
        error: getLockedMessage(nextLockState.remainingSeconds),
        data: {
          lockedUntil: nextLockState.lockedUntil,
          remainingSeconds: nextLockState.remainingSeconds,
          resetFlow: true,
        },
      };
    }

    return { success: false, error: "Unable to verify credentials." };
  }

  await resetLoginAttempts("user", challenge.username, ipAddress);
  cookieStore.delete(LOGIN_CHALLENGE_COOKIE_NAME);
  cookieStore.set(SESSION_COOKIE_NAME, await createSessionToken("user", SESSION_TTL_SECONDS), {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
  redirect("/dashboard");
}

export async function loginAdmin(username: string, password: string): Promise<ActionResult<AuthFeedback>> {
  await initializeDatabase();

  const normalizedUsername = username.trim();
  const ipAddress = await getClientIpAddress();
  const lockState = await getLoginLockState("admin", normalizedUsername, ipAddress);

  if (lockState.locked) {
    return {
      success: false,
      error: getLockedMessage(lockState.remainingSeconds),
      data: { lockedUntil: lockState.lockedUntil, remainingSeconds: lockState.remainingSeconds },
    };
  }

  if (normalizedUsername !== getAdminUsername() || password !== getAdminPassword()) {
    const nextLockState = await recordFailedLoginAttempt("admin", normalizedUsername, ipAddress);
    if (nextLockState.locked) {
      return {
        success: false,
        error: getLockedMessage(nextLockState.remainingSeconds),
        data: { lockedUntil: nextLockState.lockedUntil, remainingSeconds: nextLockState.remainingSeconds },
      };
    }

    return { success: false, error: "Unable to verify credentials." };
  }

  await resetLoginAttempts("admin", normalizedUsername, ipAddress);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, await createSessionToken("admin", SESSION_TTL_SECONDS), {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
  redirect("/admin");
}

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(LOGIN_CHALLENGE_COOKIE_NAME);
  redirect("/login");
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
  cookieStore.delete(LOGIN_CHALLENGE_COOKIE_NAME);
  redirect("/admin-login");
}

export async function resetUserLoginFlow(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(LOGIN_CHALLENGE_COOKIE_NAME);
}
