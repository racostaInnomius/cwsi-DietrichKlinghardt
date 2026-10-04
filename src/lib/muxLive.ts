import { env } from "./env";
import { muxPlaybackSessionId } from "./muxSession";
import { authedFetch } from "./auth";

const TOKEN_PATTERN = /^[a-f0-9]{64}$/i;

export interface PublicMuxLiveSession {
  eventId: string;
  title: string;
  mode: "live" | "replay" | "interrupted" | "waiting" | "ended";
  status: string;
  playbackId: string | null;
  tokens: {
    playback: string;
    thumbnail: string;
    storyboard: string;
    expiresIn: number;
  } | null;
  startDateTime: string | null;
  endDateTime: string | null;
  accessMode: "free" | "paid" | "membership";
  /**
   * Shape the broadcaster locked in before going live. Lets us size the player
   * BEFORE the first frame instead of assuming 16:9 — a phone broadcast is
   * usually vertical. Absent on older API builds, hence the optional type.
   */
  orientation?: "portrait" | "landscape";
  retryAfterSeconds: number;
  /**
   * Anonymous live-chat guest token (ADR-0004). Non-null only while
   * mode === "live". Minted fresh on EVERY poll (a new guestId each time,
   * not conditioned on includePlayback) — a caller that renders chat must
   * connect the socket once and keep it alive, not reconnect per poll.
   *
   * Consumed by `components/live/LiveChatWidget`.
   */
  chat: { token: string; expiresIn: number } | null;
}

export class MuxLiveError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly checkoutUrl: string | null = null,
    /** Only meaningful for code === "membership_required": true means the
     * visitor has no session at all (send them to sign in), false means
     * they're signed in but not an active member (send them to join). */
    public readonly requiresLogin: boolean = false,
    /** The event's real live/replay/ended state, sent even to a visitor the
     * gate just rejected — lets a "Live Now" indicator work for anyone,
     * while playbackId/tokens stay withheld until they're actually entitled. */
    public readonly mode: PublicMuxLiveSession["mode"] | null = null,
  ) {
    super(message);
    this.name = "MuxLiveError";
  }
}

function key(eventId: string) {
  return ["beytrax", "mux-live-access", env.TENANT_ID, env.SITE_ID, eventId].join(":");
}

export function readStoredMuxLiveToken(eventId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const token = window.localStorage.getItem(key(eventId));
    return token && TOKEN_PATTERN.test(token) ? token : null;
  } catch {
    return null;
  }
}

export function storeMuxLiveToken(eventId: string, token: string): boolean {
  if (typeof window === "undefined" || !TOKEN_PATTERN.test(token)) return false;
  try {
    window.localStorage.setItem(key(eventId), token);
    return true;
  } catch {
    return false;
  }
}

export function clearStoredMuxLiveToken(eventId: string) {
  if (typeof window === "undefined") return;
  try { window.localStorage.removeItem(key(eventId)); } catch { /* no-op */ }
}

export async function requestMuxLive(args: {
  eventId: string;
  accessToken?: string;
  /** State polls omit playback so the API does not sign three fresh JWTs. */
  includePlayback?: boolean;
}): Promise<PublicMuxLiveSession> {
  // authedFetch is still a plain anonymous request without stored tokens, but
  // refreshes a signed-in member once before the API evaluates the gate.
  const response = await authedFetch("/api/public/mux/live-playback", {
    method: "POST",
    body: JSON.stringify({
      tenantId: env.TENANT_ID,
      siteId: env.SITE_ID,
      eventId: args.eventId,
      sessionId: muxPlaybackSessionId("live", args.eventId),
      ...(args.accessToken ? { accessToken: args.accessToken } : {}),
      includePlayback: args.includePlayback ?? true,
    }),
  });
  const result = await response.json().catch(() => null) as {
    data?: PublicMuxLiveSession;
    error?: {
      code?: string;
      message?: string;
      checkoutUrl?: string | null;
      requiresLogin?: boolean;
      mode?: PublicMuxLiveSession["mode"];
    };
  } | null;
  if (!response.ok) {
    throw new MuxLiveError(
      result?.error?.message || "No pudimos autorizar la transmisión.",
      result?.error?.code || "live_failed",
      result?.error?.checkoutUrl || null,
      result?.error?.requiresLogin ?? false,
      result?.error?.mode ?? null,
    );
  }
  if (!result?.data) throw new MuxLiveError("La sesión Live está incompleta.", "invalid_response");
  return result.data;
}
