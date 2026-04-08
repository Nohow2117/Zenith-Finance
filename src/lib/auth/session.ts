const encoder = new TextEncoder();
const decoder = new TextDecoder();

type SessionScope = "user" | "admin";
type TokenKind = "session" | "user-login-challenge";

interface SignedTokenPayload {
  kind: TokenKind;
  scope: SessionScope;
  issuedAt: number;
  expiresAt: number;
  username?: string;
}

function encodeBase64Url(value: string): string {
  const bytes = encoder.encode(value);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (normalized.length % 4)) % 4;
  const binary = atob(`${normalized}${"=".repeat(padding)}`);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return decoder.decode(bytes);
}

async function importSigningKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function encodeBytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64UrlToBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (normalized.length % 4)) % 4;
  const binary = atob(`${normalized}${"=".repeat(padding)}`);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

async function signValue(value: string, secret: string): Promise<string> {
  const key = await importSigningKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return encodeBytesToBase64Url(new Uint8Array(signature));
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not configured");
  }

  return secret;
}

async function createSignedToken(payload: SignedTokenPayload): Promise<string> {
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = await signValue(encodedPayload, getSessionSecret());
  return `${encodedPayload}.${signature}`;
}

async function parseSignedToken(token: string | undefined): Promise<SignedTokenPayload | null> {
  if (!token) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const key = await importSigningKey(getSessionSecret());
  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    toArrayBuffer(decodeBase64UrlToBytes(signature)),
    encoder.encode(encodedPayload)
  );
  if (!isValid) return null;

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as SignedTokenPayload;
    if (
      !payload ||
      !Number.isFinite(payload.issuedAt) ||
      !Number.isFinite(payload.expiresAt) ||
      payload.expiresAt <= Date.now()
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function createSessionToken(scope: SessionScope, ttlSeconds: number): Promise<string> {
  const issuedAt = Date.now();

  return createSignedToken({
    kind: "session",
    scope,
    issuedAt,
    expiresAt: issuedAt + ttlSeconds * 1000,
  });
}

export async function createUserLoginChallengeToken(username: string, ttlSeconds: number): Promise<string> {
  const issuedAt = Date.now();

  return createSignedToken({
    kind: "user-login-challenge",
    scope: "user",
    username,
    issuedAt,
    expiresAt: issuedAt + ttlSeconds * 1000,
  });
}

export async function verifySessionToken(token: string | undefined, expectedScope: SessionScope): Promise<boolean> {
  const payload = await parseSignedToken(token);

  return payload?.kind === "session" && payload.scope === expectedScope;
}

export async function verifyUserLoginChallengeToken(token: string | undefined): Promise<{ username: string } | null> {
  const payload = await parseSignedToken(token);
  if (!payload || payload.kind !== "user-login-challenge" || payload.scope !== "user" || !payload.username) {
    return null;
  }

  return { username: payload.username };
}
