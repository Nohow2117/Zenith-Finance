import type { NextRequest } from "next/server";
import { headers } from "next/headers";

export async function getClientIpAddress(): Promise<string> {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return headerStore.get("x-real-ip") || "unknown";
}

export function getExpectedOrigin(request: NextRequest): string | null {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host") || request.nextUrl.host;
  const proto = forwardedProto || request.nextUrl.protocol.replace(":", "");

  if (!host || !proto) {
    return null;
  }

  return `${proto}://${host}`;
}

export function hasAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  const expectedOrigin = getExpectedOrigin(request);
  if (!expectedOrigin) {
    return false;
  }

  try {
    return new URL(origin).origin === expectedOrigin;
  } catch {
    return false;
  }
}
