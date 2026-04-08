import { and, eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import { loginAttempts } from "@/lib/db/schema";
import {
  LOGIN_ATTEMPT_THRESHOLD,
  LOGIN_ATTEMPT_WINDOW_MINUTES,
  LOGIN_LOCK_MINUTES,
  LOGIN_RELAPSE_LOCK_MINUTES,
} from "@/lib/constants";

type LoginActorType = "user" | "admin";

interface LockState {
  locked: boolean;
  lockedUntil?: string;
  remainingSeconds?: number;
}

const WINDOW_MS = LOGIN_ATTEMPT_WINDOW_MINUTES * 60 * 1000;
const SHORT_LOCK_MS = LOGIN_LOCK_MINUTES * 60 * 1000;
const RELAPSE_LOCK_MS = LOGIN_RELAPSE_LOCK_MINUTES * 60 * 1000;

function now(): Date {
  return new Date();
}

function toIsoString(value: Date): string {
  return value.toISOString();
}

function remainingSecondsUntil(isoDate: string): number {
  return Math.max(0, Math.ceil((new Date(isoDate).getTime() - Date.now()) / 1000));
}

async function getAttemptRow(actorType: LoginActorType, username: string, ipAddress: string) {
  const rows = await db
    .select()
    .from(loginAttempts)
    .where(
      and(
        eq(loginAttempts.actorType, actorType),
        eq(loginAttempts.username, username),
        eq(loginAttempts.ipAddress, ipAddress)
      )
    )
    .limit(1);

  return rows[0];
}

export async function getLoginLockState(
  actorType: LoginActorType,
  username: string,
  ipAddress: string
): Promise<LockState> {
  const row = await getAttemptRow(actorType, username, ipAddress);
  if (!row?.lockedUntil) {
    return { locked: false };
  }

  const remainingSeconds = remainingSecondsUntil(row.lockedUntil);
  if (remainingSeconds <= 0) {
    return { locked: false };
  }

  return {
    locked: true,
    lockedUntil: row.lockedUntil,
    remainingSeconds,
  };
}

export async function recordFailedLoginAttempt(
  actorType: LoginActorType,
  username: string,
  ipAddress: string
): Promise<LockState> {
  const currentTime = now();
  const currentIso = toIsoString(currentTime);
  const row = await getAttemptRow(actorType, username, ipAddress);

  if (!row) {
    await db.insert(loginAttempts).values({
      id: uuid(),
      actorType,
      username,
      ipAddress,
      attemptCount: 1,
      windowStartedAt: currentIso,
      lastAttemptAt: currentIso,
      updatedAt: currentIso,
    });

    return { locked: false };
  }

  if (row.lockedUntil && remainingSecondsUntil(row.lockedUntil) > 0) {
    return {
      locked: true,
      lockedUntil: row.lockedUntil,
      remainingSeconds: remainingSecondsUntil(row.lockedUntil),
    };
  }

  const priorWindowStartedAt = new Date(row.windowStartedAt);
  const withinWindow = currentTime.getTime() - priorWindowStartedAt.getTime() <= WINDOW_MS;
  const nextAttemptCount = withinWindow ? row.attemptCount + 1 : 1;
  const windowStartedAt = withinWindow ? row.windowStartedAt : currentIso;

  let lockedUntil: string | null = null;
  let lockLevel = row.lockLevel;
  let lastLockedAt = row.lastLockedAt;

  if (nextAttemptCount >= LOGIN_ATTEMPT_THRESHOLD) {
    const hasRecentPriorLock =
      !!row.lastLockedAt && currentTime.getTime() - new Date(row.lastLockedAt).getTime() <= WINDOW_MS;
    lockLevel = hasRecentPriorLock ? 2 : 1;
    lastLockedAt = currentIso;
    lockedUntil = toIsoString(
      new Date(currentTime.getTime() + (lockLevel >= 2 ? RELAPSE_LOCK_MS : SHORT_LOCK_MS))
    );
  }

  await db
    .update(loginAttempts)
    .set({
      attemptCount: nextAttemptCount,
      windowStartedAt,
      lastAttemptAt: currentIso,
      lockedUntil,
      lockLevel,
      lastLockedAt,
      updatedAt: currentIso,
    })
    .where(eq(loginAttempts.id, row.id));

  if (!lockedUntil) {
    return { locked: false };
  }

  return {
    locked: true,
    lockedUntil,
    remainingSeconds: remainingSecondsUntil(lockedUntil),
  };
}

export async function resetLoginAttempts(actorType: LoginActorType, username: string, ipAddress: string): Promise<void> {
  const currentIso = toIsoString(now());
  const row = await getAttemptRow(actorType, username, ipAddress);

  if (!row) {
    return;
  }

  await db
    .update(loginAttempts)
    .set({
      attemptCount: 0,
      windowStartedAt: currentIso,
      lastAttemptAt: currentIso,
      lockedUntil: null,
      lockLevel: 0,
      lastLockedAt: null,
      updatedAt: currentIso,
    })
    .where(eq(loginAttempts.id, row.id));
}
