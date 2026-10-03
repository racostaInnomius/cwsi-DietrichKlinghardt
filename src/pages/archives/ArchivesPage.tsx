import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { useAuth } from "@/features/auth/useAuth";
import {
  ArchivesError,
  fetchArchiveAccess,
  fetchArchivesList,
  type ArchiveListItem,
} from "@/lib/archives";
import { fetchMembershipStatus, type MembershipStatus } from "@/lib/membership";

/**
 * Archives — Phase 5 of the membership feature. Real content at last: a
 * member-gated grid merging migrated Weekly Talk replays (Phase 4, served
 * from Azure Blob, not Mux) with whatever staff has uploaded directly
 * (images, PDFs, music, standalone video) — see cwsf-beytrax's ArchiveItems
 * collection. Same membership_required gate contract as LiveTalkPage's, so
 * this page reuses its LiveNotice component.
 *
 * Access is two calls, not one: /list never returns a working URL (see the
 * API for why), so opening any item first asks the API for a short-lived
 * signed one, only at the moment the visitor actually wants to see it.
 */
export function ArchivesPage() {
  const { status: authStatus, signIn } = useAuth();
  const [items, setItems] = useState<ArchiveListItem[] | null>(null);
  const [error, setError] = useState<ArchivesError | null>(null);
  const [membership, setMembership] = useState<MembershipStatus | null>(null);
  const [viewing, setViewing] = useState<ArchiveListItem | null>(null);

  useEffect(() => {
    if (authStatus === "loading") return;
    let cancelled = false;
    setItems(null);
    setError(null);
    if (authStatus === "authenticated") {
      fetchMembershipStatus()
        .then((result) => {
          if (!cancelled) setMembership(result);
        })
        .catch(() => {
          if (!cancelled) setMembership(null);
        });
    } else {
      setMembership(null);
    }
    fetchArchivesList()
      .then((result) => {
        if (!cancelled) setItems(result.items);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ArchivesError ? err : new ArchivesError("We could not load the Archives.", "archives_failed"));
      });
    return () => {
      cancelled = true;
    };
  }, [authStatus]);

  return (
    <>
      <Seo
        title={"Archives — Dr. Dietrich Klinghardt™"}
        description="Member-only recordings, images, PDFs and music from Dr. Klinghardt."
        path="/archives"
        noindex
      />

      <AnimatedGradient variant="card" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <p className="eyebrow">Archives</p>
            <h1>Archives</h1>
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap">
        {authStatus === "loading" || (!items && !error) ? (
          <p className="empty-note">Loading the Archives…</p>
        ) : error?.code === "membership_required" ? (
          <div className="archive-membership-gate">
            <div className="course-path-card archive-membership-card" role="status">
              <div className="course-path-card__header">
                <span className="course-path-card__badge">Members only</span>
                <h2>The Archives are part of the membership.</h2>
              </div>
              <div className="course-path-card__body">
                <p>
                  {error.requiresLogin
                    ? "Sign in to your account — your membership unlocks the Archives."
                    : membership?.status === "incomplete"
                      ? "Your membership checkout was not completed. Choose a plan to finish joining."
                      : membership?.status === "canceled" || membership?.status === "incomplete_expired"
                        ? "Your previous membership has ended. Rejoin to unlock the Archives again."
                        : membership?.status === "unpaid"
                          ? "Your membership needs payment before the Archives can be unlocked."
                          : "You're signed in, but the Archives need an active membership."}
                </p>
              </div>
              <div className="course-path-card__footer">
                {error.requiresLogin ? (
                  <button
                    className="course-path-card__cta course-path-card__cta--primary"
                    type="button"
                    onClick={() => signIn("/archives")}
                  >
                    Sign in <span aria-hidden="true">↗</span>
                  </button>
                ) : (
                  <>
                    <Link
                      className="course-path-card__cta course-path-card__cta--primary"
                      to="/weekly-talks"
                    >
                      {membership?.status ? "Rejoin membership" : "Become a member"}{" "}
                      <span aria-hidden="true">↗</span>
                    </Link>
                    <Link
                      className="course-path-card__cta course-path-card__cta--secondary"
                      to="/account"
                    >
                      View account <span aria-hidden="true">↗</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : error ? (
          <p className="empty-note">{error.message}</p>
        ) : items && items.length === 0 ? (
          <p className="empty-note">
            The Archives are being filled in. Check back soon, or reach out via{" "}
            <a href="/contact">Contact</a> for anything you're looking for.
          </p>
        ) : items ? (
          <ul className="archive-grid">
            {items.map((item, index) => (
              <Reveal as="li" key={`${item.source}:${item.id}`} className="archive-card" delay={index * 60}>
                <span className={`archive-card__badge archive-card__badge--${item.kind}`}>
                  {{ video: "Video", image: "Image", pdf: "PDF", audio: "Music" }[item.kind]}
                </span>
                <h2>{item.title}</h2>
                {item.description ? <p>{item.description}</p> : null}
                <button type="button" className="btn btn-outline" onClick={() => setViewing(item)}>
                  {item.kind === "pdf" ? "Open" : "View"}
                </button>
              </Reveal>
            ))}
          </ul>
        ) : null}
      </section>

      {viewing ? <ArchiveViewer item={viewing} onClose={() => setViewing(null)} /> : null}
    </>
  );
}

function ArchiveViewer({ item, onClose }: { item: ArchiveListItem; onClose: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchArchiveAccess({ source: item.source, id: item.id })
      .then((result) => {
        if (cancelled) return;
        setUrl(result.url);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error("We could not open this item."));
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="feedback-backdrop archive-viewer-backdrop"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section className="archive-viewer" role="dialog" aria-modal="true" aria-label={item.title}>
        <button className="feedback-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2>{item.title}</h2>
        {error ? (
          <div className="archive-viewer__error">
            <p className="empty-note">{error.message}</p>
            {error instanceof ArchivesError && error.code === "membership_required" ? (
              <a className="btn btn-primary" href="/account">Review membership</a>
            ) : null}
          </div>
        ) : !url ? (
          <p className="empty-note">Loading…</p>
        ) : item.kind === "pdf" ? (
          <a className="btn btn-primary" href={url} target="_blank" rel="noopener noreferrer">
            Open PDF in a new tab
          </a>
        ) : item.kind === "video" ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video className="archive-viewer__media" src={url} controls autoPlay />
        ) : item.kind === "audio" ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <audio className="archive-viewer__media" src={url} controls autoPlay />
        ) : (
          <img className="archive-viewer__media" src={url} alt={item.title} />
        )}
      </section>
    </div>,
    document.body,
  );
}
