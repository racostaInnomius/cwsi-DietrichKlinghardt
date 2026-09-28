import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AuthApiError,
  buildSignInUrl,
  buildSignUpUrl,
  fetchMe,
  signOutRemote,
} from "@/lib/auth";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./tokenStore";
import type { MeResponse } from "./types";

export type AuthStatus = "loading" | "authenticated" | "anonymous";

export interface AuthContextValue {
  status: AuthStatus;
  me: MeResponse | null;
  refresh: () => Promise<void>;
  signIn: (returnTo?: string) => void;
  signUp: (returnTo?: string) => void;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Bearer-token auth lifecycle for this site — same shape as the Sistworld
 * donor portal, the first tenant to build this against the shared Beytrax
 * API: identity lives on Safecertus (the IDP), this site only holds the
 * resulting access/refresh pair.
 *
 * On mount: if a refresh token is in localStorage, exchange it for a fresh
 * access token, then call /auth/me. No prior token → "anonymous" immediately,
 * no network call.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [me, setMe] = useState<MeResponse | null>(null);

  const refresh = useCallback(async () => {
    if (!getRefreshToken() && !getAccessToken()) {
      setMe(null);
      setStatus("anonymous");
      return;
    }
    try {
      const next = await fetchMe();
      setMe(next);
      setStatus("authenticated");
    } catch (err) {
      if (err instanceof AuthApiError && err.status === 401) {
        clearTokens();
      } else {
        console.error("Auth refresh failed:", err);
      }
      setMe(null);
      setStatus("anonymous");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const buildReturnUrl = useCallback((returnTo?: string): string => {
    if (typeof window === "undefined") return "/auth/return?next=/account";
    const origin = window.location.origin;
    try {
      const intended = returnTo ?? `${origin}${window.location.pathname}${window.location.search}`;
      const returnUrl = new URL("/auth/return", origin);
      returnUrl.searchParams.set("next", intended);
      return returnUrl.toString();
    } catch {
      return `${origin}/auth/return?next=/account`;
    }
  }, []);

  const signIn = useCallback(
    (returnTo?: string) => {
      if (typeof window === "undefined") return;
      window.location.href = buildSignInUrl(buildReturnUrl(returnTo));
    },
    [buildReturnUrl],
  );

  const signUp = useCallback(
    (returnTo?: string) => {
      if (typeof window === "undefined") return;
      window.location.href = buildSignUpUrl(buildReturnUrl(returnTo));
    },
    [buildReturnUrl],
  );

  const signOut = useCallback(async () => {
    let idpLogoutUrl: string | null = null;
    try {
      const result = await signOutRemote();
      idpLogoutUrl = result.idpLogoutUrl;
    } catch (err) {
      console.error("Sign out failed:", err);
    }
    // Skip setMe/setStatus here on purpose — see the Sistworld AuthProvider
    // this is ported from: the resulting re-render would race the
    // window.location.href assignment below and can win it in some browsers,
    // stranding the user signed out locally but never reaching the IDP's
    // end_session (so Safecertus still thinks they're signed in).
    clearTokens();
    window.location.href = idpLogoutUrl ?? "/";
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, me, refresh, signIn, signUp, signOut }),
    [status, me, refresh, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
