import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import type { MuxLiveError } from "@/lib/muxLive";
import type { PublicMuxLiveSession } from "@/lib/muxLive";
import { checkoutHref } from "@/lib/checkout";
import { LiveNotice } from "@/components/LiveNotice";

const MuxPlayer = lazy(() => import("@mux/mux-player-react"));

/**
 * The player-or-gate switch LiveTalkPage used to render inline. Extracted so
 * the same access logic (membership gate, purchase gate, waiting/ended
 * states) can also back a compact embed — the Weekly Talks hero's free talk
 * and the paid talk's "Live Now" badge — without a second copy of it.
 *
 * `compact`: shorter copy, no "back to weekly talks" framing, meant for
 * a card-sized embed rather than a full page. The access RULES are
 * identical in both modes — only the presentation shrinks.
 */
export function LiveTalkStage({
  session,
  error,
  checkoutUrl,
  onRetry,
  compact = false,
}: {
  session: PublicMuxLiveSession | null;
  error: MuxLiveError | null;
  /** Event's own Payment Link, used as a purchase_required fallback. */
  checkoutUrl?: string | null;
  onRetry?: () => void;
  compact?: boolean;
}) {
  const buyHref = error?.checkoutUrl ? checkoutHref(error.checkoutUrl) : checkoutHref(checkoutUrl);

  if (session?.playbackId && session.tokens) {
    return (
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
              ? { height: compact ? "min(60vh, 520px)" : "min(78vh, 760px)", aspectRatio: "9 / 16", margin: "0 auto", display: "block" }
              : { width: "100%", aspectRatio: "16 / 9" }
          }
        />
      </Suspense>
    );
  }

  if (error?.code === "membership_required") {
    return (
      <LiveNotice
        eyebrow="Members only"
        title={compact ? "This talk needs an active membership." : "This talk is part of the membership."}
        body={
          error.requiresLogin
            ? "Sign in to your account to watch — your membership unlocks this talk."
            : compact
              ? "You're signed in, but this stream is reserved for active members. Join to watch live."
              : "You're signed in, but this talk needs an active membership."
        }
      >
        {error.requiresLogin ? (
          <Link className="btn btn-primary" to="/account">
            Sign in
          </Link>
        ) : (
          <Link className="btn btn-primary" to="/weekly-talks#pricing">
            Become a member
          </Link>
        )}
      </LiveNotice>
    );
  }

  if (error?.code === "purchase_required") {
    return (
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
          <Link className="btn btn-primary" to="/weekly-talks#pricing">
            About the membership
          </Link>
        )}
      </LiveNotice>
    );
  }

  if (error) {
    return (
      <LiveNotice
        eyebrow="Not available"
        title="We could not load the broadcast."
        body={error.message === "We could not load the broadcast." ? undefined : error.message}
      >
        {onRetry ? (
          <button className="btn btn-outline" type="button" onClick={onRetry}>
            Try again
          </button>
        ) : null}
      </LiveNotice>
    );
  }

  if (session?.mode === "interrupted") {
    return (
      <LiveNotice
        eyebrow="Reconnecting"
        title="The signal dropped for a moment."
        body="The broadcast can come back. This refreshes itself — no need to reload."
      />
    );
  }

  if (session?.mode === "ended") {
    return (
      <LiveNotice
        eyebrow="Finished"
        title="The talk has ended."
        body="If a replay was enabled it appears here once Mux finishes processing it."
      />
    );
  }

  if (session) {
    return (
      <LiveNotice
        eyebrow="Starting soon"
        title="The talk has not started yet."
        body="This updates on its own as soon as the signal arrives."
      />
    );
  }

  return <LiveNotice eyebrow="One moment" title="Authorising the broadcast…" />;
}
