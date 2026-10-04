import { useEffect, useState } from "react";
import { MuxLiveError, requestMuxLive, type PublicMuxLiveSession } from "./muxLive";

/** Error codes meaning "this access token is dead" — the caller should drop
 * it (clearStoredMuxLiveToken + its own token state) rather than retry it. */
export const INVALID_TOKEN_CODES = [
  "purchase_required",
  "access_link_invalid",
  "access_session_mismatch",
];

/**
 * Polls the API for one event's live/replay state and keeps the signed Mux
 * tokens fresh as the broadcast moves through waiting → live → replay.
 * Extracted from LiveTalkPage so the same polling/token logic can also
 * back a compact embed (the hero's free talk, the paid talk's "Live Now"
 * badge) without duplicating it.
 */
export function useLiveTalkSession(
  eventId: string,
  accessToken: string | undefined,
  /** False to skip polling entirely — e.g. an embed that isn't visible yet. */
  enabled = true,
): {
  session: PublicMuxLiveSession | null;
  error: MuxLiveError | null;
  retry: () => void;
} {
  const [session, setSession] = useState<PublicMuxLiveSession | null>(null);
  const [error, setError] = useState<MuxLiveError | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!eventId || !enabled) return;
    let active = true;
    let timer: number | undefined;
    let current: PublicMuxLiveSession | null = null;

    const load = async (includePlayback: boolean) => {
      try {
        let next = await requestMuxLive({ eventId, accessToken, includePlayback });
        if (!active) return;

        if (!includePlayback && next.playbackId) {
          if (current?.playbackId === next.playbackId && current.tokens) {
            // Keep the original token object: replacing it would change the
            // player's HLS URL and rebuffer the stream on every state poll.
            next = { ...next, tokens: current.tokens };
          } else {
            // waiting→live or live→replay: the playback id changed, so mint.
            next = await requestMuxLive({ eventId, accessToken, includePlayback: true });
            if (!active) return;
          }
        }

        current = next;
        setSession(next);
        setError(null);

        if (next.mode !== "replay" && next.mode !== "ended") {
          const seconds = next.mode === "live" ? 10 : next.retryAfterSeconds || 15;
          timer = window.setTimeout(() => void load(false), seconds * 1000);
        }
      } catch (reason) {
        if (!active) return;
        const failure =
          reason instanceof MuxLiveError
            ? reason
            : new MuxLiveError("We could not load the broadcast.", "live_failed");
        // Does NOT clear the token itself — only the caller owns that state
        // (see INVALID_TOKEN_CODES). Retrying here with the same dead
        // credential would just repeat the same error until the caller
        // reacts and this effect re-runs with accessToken=undefined.
        setError(failure);
      }
    };

    void load(true);
    return () => {
      active = false;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [accessToken, attempt, eventId, enabled]);

  return { session, error, retry: () => setAttempt((n) => n + 1) };
}
