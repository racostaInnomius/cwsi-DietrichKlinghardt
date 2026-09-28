/**
 * Bearer-token store for this site.
 *
 * Same design as the Sistworld donor portal (the first tenant to build this):
 *   - access token  → in-memory only. Lost on reload, restored via refresh.
 *   - refresh token → localStorage. Survives reloads; cleared on sign-out or
 *                     any rotation failure.
 *
 * A module-level singleton (not React state) so `apiFetch`-style helpers can
 * read the current access token without importing the auth context into a
 * plain function.
 */

const REFRESH_KEY = "bx_refresh";

let accessToken: string | null = null;
let refreshToken: string | null = null;
let initialized = false;

function ensureInit(): void {
  if (initialized) return;
  initialized = true;
  if (typeof window === "undefined") return;
  try {
    refreshToken = window.localStorage.getItem(REFRESH_KEY);
  } catch {
    refreshToken = null;
  }
}

export function setTokens(input: { accessToken: string; refreshToken: string }): void {
  ensureInit();
  accessToken = input.accessToken;
  refreshToken = input.refreshToken;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(REFRESH_KEY, input.refreshToken);
  } catch {
    /* storage unavailable — session stays in-memory for this page load */
  }
}

export function clearTokens(): void {
  ensureInit();
  accessToken = null;
  refreshToken = null;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(REFRESH_KEY);
  } catch {
    /* ignore */
  }
}

export function getAccessToken(): string | null {
  ensureInit();
  return accessToken;
}

export function getRefreshToken(): string | null {
  ensureInit();
  return refreshToken;
}
