import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { LiveNotice } from "@/components/LiveNotice";
import { useAuth } from "@/features/auth/useAuth";
import {
  ArchivesError,
  fetchArchiveAccess,
  fetchArchivesList,
  type ArchiveListItem,
} from "@/lib/archives";

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
  const { status: authStatus } = useAuth();
  const [items, setItems] = useState<ArchiveListItem[] | null>(null);
  const [error, setError] = useState<ArchivesError | null>(null);
  const [viewing, setViewing] = useState<ArchiveListItem | null>(null);

  useEffect(() => {
    if (authStatus === "loading") return;
    let cancelled = false;
    setError(null);
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
          <div className="live-stage">
            <LiveNotice
              eyebrow="Members only"
              title="The Archives are part of the membership."
              body={
                error.requiresLogin
                  ? "Sign in to your account — your membership unlocks the Archives."
                  : "You're signed in, but the Archives need an active membership."
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchArchiveAccess({ source: item.source, id: item.id })
      .then((result) => {
        if (cancelled) return;
        // A PDF has no inline viewer here — open it in its own tab and close
        // the modal immediately rather than showing an empty dialog.
        if (item.kind === "pdf") {
          window.open(result.url, "_blank", "noopener,noreferrer");
          onClose();
          return;
        }
        setUrl(result.url);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "We could not open this item.");
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

  if (item.kind === "pdf") return null;

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
          <p className="empty-note">{error}</p>
        ) : !url ? (
          <p className="empty-note">Loading…</p>
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
