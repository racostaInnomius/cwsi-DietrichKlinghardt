import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Seo } from "@/components/Seo";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useCollection, text } from "@/lib/content";
import { eventLongDate } from "@/lib/format";
import { clearStoredMuxLiveToken, readStoredMuxLiveToken, storeMuxLiveToken } from "@/lib/muxLive";
import { INVALID_TOKEN_CODES, useLiveTalkSession } from "@/lib/useLiveTalkSession";
import { useAuth } from "@/features/auth/useAuth";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { LiveTalkStage } from "@/components/live/LiveTalkStage";

// The heaviest dependency on the site, loaded on demand so no other page
// pays for a websocket client it never touches. (MuxPlayer itself is
// lazy-loaded inside LiveTalkStage.)
const LiveChatWidget = lazy(() =>
  import("@/components/live/LiveChatWidget").then((m) => ({ default: m.LiveChatWidget })),
);

/**
 * The live weekly talk.
 *
 * Playback is signed per viewer by the API, so nothing here can be watched by
 * guessing a URL: the page trades an access token for short-lived Mux tokens
 * and re-polls as the broadcast moves through waiting → live → replay. A paid
 * talk with no token shows the purchase gate rather than a broken player.
 *
 * The API returns a live-chat guest token on every poll, which the chat widget
 * beside the player uses; it renders only while a broadcast is actually live.
 */
export function LiveTalkPage() {
  const { eventId = "" } = useParams();
  const events = useCollection("events");
  const event = useMemo(
    () => events.find((item) => String(item.id) === eventId || item.slug === eventId),
    [eventId, events],
  );

  const [params, setParams] = useSearchParams();
  const queryToken = params.get("access") || undefined;
  const [tokenState, setTokenState] = useState<{ eventId: string; token?: string } | null>(null);
  const tokenReady = tokenState?.eventId === eventId;
  const accessToken = tokenReady ? tokenState.token : undefined;

  // The access link arrives by email once; remember it so a reload still works.
  useEffect(() => {
    if (!eventId) return;
    setTokenState({
      eventId,
      token: queryToken || readStoredMuxLiveToken(eventId) || undefined,
    });
  }, [eventId, queryToken]);

  // Strip the token from the address bar once stored — a shared or
  // shoulder-surfed URL should not carry someone's private access.
  useEffect(() => {
    if (!queryToken || !eventId || !storeMuxLiveToken(eventId, queryToken)) return;
    const sanitized = new URLSearchParams(params);
    sanitized.delete("access");
    setParams(sanitized, { replace: true });
  }, [eventId, params, queryToken, setParams]);

  // Waits for the global auth refresh to settle before the first poll: the
  // access token lives in memory only (never localStorage) and is refreshed
  // from the stored refresh token on mount, so firing immediately would send
  // an unauthenticated request — a membership event returns 403, not 401,
  // so authedFetch's own retry-on-401 never kicks in to recover it.
  const { status: authStatus } = useAuth();
  const { session, error, retry } = useLiveTalkSession(
    eventId,
    accessToken,
    tokenReady && authStatus !== "loading",
  );

  // A token the API rejects is worse than none: drop it (storage + local
  // state) so the page shows the purchase/membership gate instead of
  // retrying with a dead credential on the next poll.
  useEffect(() => {
    if (!error || !accessToken || !INVALID_TOKEN_CODES.includes(error.code)) return;
    clearStoredMuxLiveToken(eventId);
    setTokenState({ eventId, token: undefined });
  }, [error, accessToken, eventId]);

  const title = event ? text(event, "title", "Weekly talk") : (session?.title ?? "Weekly talk");

  return (
    <>
      <Seo
        title={`${title} — Dr. Dietrich Klinghardt™`}
        noindex
      />

      <section className="section wrap live-page">
        <Breadcrumbs
          items={[{ label: "Weekly talks", href: "/weekly-talks" }, { label: "Live" }]}
        />
        <Reveal>
          <p className="eyebrow">Live</p>
          <h1>
            <Marked text={title} />
          </h1>
          {event && text(event, "startDateTime") ? (
            <p className="lead">{eventLongDate(event)}</p>
          ) : null}
        </Reveal>

        <div className="live-layout">
        <div className="live-stage" aria-live="polite">
          <LiveTalkStage session={session} error={error} checkoutUrl={event?.checkoutUrl} onRetry={retry} />
        </div>
        {/* Keyed by event so switching talks starts a clean room. */}
        <Suspense fallback={null}>
          <LiveChatWidget key={eventId} chat={session?.chat ?? null} />
        </Suspense>
        </div>

        <footer className="live-footer">
          <Link className="arrow-link" to="/weekly-talks">
            ← Back to weekly talks
          </Link>
          {accessToken ? (
            <small>Your link works for the live session and its replay. Please don’t share it.</small>
          ) : null}
        </footer>
      </section>
    </>
  );
}
