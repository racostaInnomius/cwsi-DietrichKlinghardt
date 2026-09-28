import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Seo } from "@/components/Seo";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useCollection, text } from "@/lib/content";
import { checkoutHref } from "@/lib/checkout";
import { eventLongDate } from "@/lib/format";
import {
  MuxLiveError,
  clearStoredMuxLiveToken,
  readStoredMuxLiveToken,
  requestMuxLive,
  storeMuxLiveToken,
  type PublicMuxLiveSession,
} from "@/lib/muxLive";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";

// The two heaviest dependencies on the site, and only this page uses them:
// loaded on demand so no other page pays for a video player and a websocket
// client it never touches.
const MuxPlayer = lazy(() => import("@mux/mux-player-react"));
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

  const [session, setSession] = useState<PublicMuxLiveSession | null>(null);
  const [error, setError] = useState<MuxLiveError | null>(null);
  const [attempt, setAttempt] = useState(0);

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

  useEffect(() => {
    if (!eventId || !tokenReady) return;
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
        // A token the API rejects is worse than none: drop it so the page can
        // show the purchase gate instead of retrying with a dead credential.
        if (
          accessToken &&
          ["purchase_required", "access_link_invalid", "access_session_mismatch"].includes(
            failure.code,
          )
        ) {
          clearStoredMuxLiveToken(eventId);
          setTokenState({ eventId, token: undefined });
        }
        setError(failure);
      }
    };

    void load(true);
    return () => {
      active = false;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [accessToken, attempt, eventId, tokenReady]);

  const title = event ? text(event, "title", "Weekly talk") : (session?.title ?? "Weekly talk");
  const buyHref = error?.checkoutUrl
    ? checkoutHref(error.checkoutUrl)
    : checkoutHref(event?.checkoutUrl);

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
          {session?.playbackId && session.tokens ? (
            <Suspense fallback={<LiveNotice eyebrow="One moment" title="Loading the player…" />}>
            <MuxPlayer
              playbackId={session.playbackId}
              tokens={session.tokens}
              streamType={session.mode === "live" ? "live" : "on-demand"}
              metadata={{ video_title: session.title, video_id: session.eventId }}
              accentColor="#bc8f44"
              primaryColor="#f4f0e5"
              secondaryColor="#1c1916"
              style={
                // A phone broadcast is vertical; sizing it by width would make
                // it absurdly tall on a desktop screen.
                session.orientation === "portrait"
                  ? { height: "min(78vh, 760px)", aspectRatio: "9 / 16", margin: "0 auto", display: "block" }
                  : { width: "100%", aspectRatio: "16 / 9" }
              }
            />
            </Suspense>
          ) : error?.code === "membership_required" ? (
            <LiveNotice
              eyebrow="Members only"
              title="This talk is part of the membership."
              body={
                error.requiresLogin
                  ? "Sign in to your account — your membership unlocks this talk."
                  : "You're signed in, but this talk needs an active membership."
              }
            >
              {error.requiresLogin ? (
                <Link className="btn btn-primary" to="/account">
                  Sign in
                </Link>
              ) : (
                <Link className="btn btn-primary" to="/weekly-talks">
                  Become a member
                </Link>
              )}
            </LiveNotice>
          ) : error?.code === "purchase_required" ? (
            <LiveNotice
              eyebrow="Members only"
              title="This talk is part of the membership."
              body="Members receive a personal link by email that works for the live session and its replay."
            >
              {buyHref ? (
                <a className="btn btn-primary" href={buyHref}>
                  Join the weekly talks
                </a>
              ) : (
                <Link className="btn btn-primary" to="/weekly-talks">
                  About the membership
                </Link>
              )}
            </LiveNotice>
          ) : error ? (
            <LiveNotice
              eyebrow="Not available"
              title="We could not load the broadcast."
              // Only when the API said something more specific than our own
              // generic fallback — otherwise the notice repeats itself.
              body={
                error.message === "We could not load the broadcast."
                  ? undefined
                  : error.message
              }
            >
              <button className="btn btn-outline" type="button" onClick={() => setAttempt((n) => n + 1)}>
                Try again
              </button>
            </LiveNotice>
          ) : session?.mode === "interrupted" ? (
            <LiveNotice
              eyebrow="Reconnecting"
              title="The signal dropped for a moment."
              body="The broadcast can come back. This page refreshes itself — there is no need to reload."
            />
          ) : session?.mode === "ended" ? (
            <LiveNotice
              eyebrow="Finished"
              title="The talk has ended."
              body="If a replay was enabled it appears here once Mux finishes processing it."
            />
          ) : session ? (
            <LiveNotice
              eyebrow="Starting soon"
              title="The talk has not started yet."
              body="This page updates on its own as soon as the signal arrives."
            />
          ) : (
            <LiveNotice eyebrow="One moment" title="Authorising the broadcast…" />
          )}
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

function LiveNotice({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="live-notice" role="status">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
      {children}
    </div>
  );
}
