function requireEnvValue(key: "ADMIN_PASSWORD" | "ADMIN_USERNAME" | "SESSION_SECRET" | "USER_PIN" | "USER_USERNAME"): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is not configured`);
  }

  return value;
}

export function getAdminPassword(): string {
  return requireEnvValue("ADMIN_PASSWORD");
}

export function getAdminUsername(): string {
  return requireEnvValue("ADMIN_USERNAME");
}

export function getUserPin(): string {
  return requireEnvValue("USER_PIN");
}

export function getUserUsername(): string {
  return requireEnvValue("USER_USERNAME");
}
