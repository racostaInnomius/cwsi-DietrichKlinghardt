import { env } from "./env";

const memorySessions = new Map<string, string>();

function storageKey(scope: "video" | "live" | "track", resourceId: string) {
  return [
    "beytrax",
    "mux-playback-session",
    env.TENANT_ID,
    env.SITE_ID,
    scope,
    resourceId,
  ].join(":");
}

/** Stable per-browser playback identity used only for idempotent cost holds. */
export function muxPlaybackSessionId(
  scope: "video" | "live" | "track",
  resourceId: string,
): string {
  const key = storageKey(scope, resourceId);
  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) return stored;
      const created = window.crypto.randomUUID();
      window.localStorage.setItem(key, created);
      return created;
    } catch {
      // Private browsing can disable storage; keep the identity for this tab.
    }
  }
  const existing = memorySessions.get(key);
  if (existing) return existing;
  const created = globalThis.crypto.randomUUID();
  memorySessions.set(key, created);
  return created;
}
