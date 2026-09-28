import { env } from "./env";
import type { MeResponse } from "@/features/auth/types";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/features/auth/tokenStore";

/**
 * Beytrax's own OAuth-style identity, proven in production on the Sistworld
 * donor portal — reused as-is here rather than inventing a second scheme.
 * The API redirects the browser to Safecertus (the shared IDP), then back to
 * this site's /auth/return with a one-time `exchange_code`; this file only
 * handles the code exchange, token refresh and /auth/me — the actual OAuth
 * hop is entirely server-side.
 */

export class AuthApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "AuthApiError";
  }
}

function apiUrl(path: string): string {
  return `${env.API_URL.replace(/\/$/, "")}${path}`;
}

let inflightRefresh: Promise<boolean> | null = null;

/** Single-flight so N parallel 401s trigger exactly one rotation. */
async function tryRefreshOnce(): Promise<boolean> {
  if (inflightRefresh) return inflightRefresh;
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  inflightRefresh = (async () => {
    try {
      const res = await fetch(apiUrl("/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        clearTokens();
        return false;
      }
      const json = (await res.json()) as {
        data: { accessToken: string; refreshToken: string };
      };
      setTokens({ accessToken: json.data.accessToken, refreshToken: json.data.refreshToken });
      return true;
    } catch {
      return false;
    } finally {
      inflightRefresh = null;
    }
  })();
  return inflightRefresh;
}

/** fetch wrapper that attaches the bearer token and retries once after a refresh. */
export async function authedFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const buildHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string> | undefined) ?? {}),
    };
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  let res = await fetch(apiUrl(path), { ...options, headers: buildHeaders() });
  if (res.status === 401 && getRefreshToken()) {
    if (await tryRefreshOnce()) {
      res = await fetch(apiUrl(path), { ...options, headers: buildHeaders() });
    }
  }
  return res;
}

export function buildSignInUrl(returnTo: string): string {
  const url = new URL("/auth/login", env.API_URL);
  url.searchParams.set("return", returnTo);
  return url.toString();
}

export function buildSignUpUrl(returnTo: string): string {
  const url = new URL("/auth/register", env.API_URL);
  url.searchParams.set("return", returnTo);
  return url.toString();
}

export async function fetchMe(): Promise<MeResponse> {
  const res = await authedFetch("/auth/me");
  if (!res.ok) throw new AuthApiError(res.status, await res.text().catch(() => res.statusText));
  const json = (await res.json()) as { data: MeResponse };
  return json.data;
}

export async function signOutRemote(): Promise<{ idpLogoutUrl: string | null }> {
  const res = await authedFetch("/auth/logout", { method: "POST" });
  if (!res.ok) throw new AuthApiError(res.status, await res.text().catch(() => res.statusText));
  const json = (await res.json()) as { data: { idpLogoutUrl: string } };
  return { idpLogoutUrl: json.data.idpLogoutUrl ?? null };
}

export interface ExchangeResult {
  accessToken: string;
  refreshToken: string;
}

/** Consumes the one-time code from the OAuth callback. Unauthenticated by design — the code IS the credential. */
export async function exchangeAuthCode(exchangeCode: string): Promise<ExchangeResult> {
  const res = await fetch(apiUrl("/auth/exchange"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ exchangeCode }),
  });
  if (!res.ok) throw new AuthApiError(res.status, await res.text().catch(() => res.statusText));
  const json = (await res.json()) as { data: ExchangeResult };
  return json.data;
}
