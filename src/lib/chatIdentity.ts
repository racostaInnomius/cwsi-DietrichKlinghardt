import { env } from "./env";

const memoryName = new Map<string, string>();

function storageKey() {
  return ["beytrax", "chat-display-name", env.TENANT_ID, env.SITE_ID].join(":");
}

/** Site-wide (not per-event) display name a visitor typed once for live
 * chat. Same colon-key/localStorage-with-memory-fallback shape as
 * muxSession.ts's muxPlaybackSessionId, but holds free text the visitor
 * typed rather than a generated UUID, so it lives in its own module. */
export function getStoredChatDisplayName(): string | null {
  const key = storageKey();
  if (typeof window !== "undefined") {
    try {
      return window.localStorage.getItem(key) || null;
    } catch {
      // Private browsing can disable storage; fall through to memory.
    }
  }
  return memoryName.get(key) || null;
}

export function storeChatDisplayName(name: string): void {
  const trimmed = name.trim();
  if (!trimmed) return;
  const key = storageKey();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(key, trimmed);
      return;
    } catch {
      // fall through to memory
    }
  }
  memoryName.set(key, trimmed);
}
