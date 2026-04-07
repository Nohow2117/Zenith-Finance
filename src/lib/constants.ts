export const APP_NAME = "ArtDeFinance";
export const EUR_USDT_RATE = 1.08;
export const ATM_AMOUNTS = [2000, 2500, 3000] as const;
export const PIN_LENGTH = 4;
export const SESSION_COOKIE_NAME = "artdefi_session";
export const ADMIN_SESSION_COOKIE_NAME = "artdefi_admin_session";
export const OPENROUTER_TIMEOUT_MS = 30000;
export const WITHDRAWAL_STATUS = {
  PENDING: "Pending Approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
} as const;

export const THEME = {
  BG_PRIMARY: "#0B0E11",
  BG_SECONDARY: "#131722",
  BG_CARD: "#1A1F2E",
  ACCENT: "#00D395",
  ACCENT_HOVER: "#00B880",
  TEXT_PRIMARY: "#FFFFFF",
  TEXT_SECONDARY: "#8A919E",
  BORDER: "#252A37",
  DANGER: "#EF4444",
  WARNING: "#F59E0B",
} as const;
