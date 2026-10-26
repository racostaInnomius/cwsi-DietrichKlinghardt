import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Marked } from "@/components/Marked";
import { Emphasis } from "@/components/Emphasis";
import { useSection, SECTION } from "@/lib/sections";
import { Reveal } from "@/components/motion/Reveal";
import { useAuth } from "@/features/auth/useAuth";
import {
  ARCHIVE_COLLECTIONS,
  ArchivesError,
  fetchArchiveAccess,
  fetchArchivesList,
  fetchArchivesSummary,
  type ArchiveCollection,
  type ArchiveListItem,
} from "@/lib/archives";
import { fetchMembershipStatus, type MembershipStatus } from "@/lib/membership";

/**
 * /archives — "The Klinghardt Living Archive" (client design, 2026-10-10:
 * hero, six collections, how it works, waiting list), on the page's own
 * gradient like the design (no hero card).
 *
 * Members only (client, 2026-10-12: "se debe mostrar cuando esté el usuario
 * logeado y que tenga suscripción a la weekly talks"): anyone without an
 * active membership gets the "Members only" invitation card alone — sign in
 * or join — and none of the page. A member gets the whole page: the six
 * collections come from the CMS (ArchiveItems' `collection`), each with its
 * count from /archives/summary ("Coming soon" until it holds pieces), and the
 * list right under them — a collection card filters it. The design's waiting
 * list was for visitors, so members don't get it.
 *
 * Access is still two calls (see the API): /list never returns a working URL;
 * opening an item asks /access for a short-lived signed one.
 */

interface CollectionCopy {
  title: string;
  description: string;
  icon: ReactNode;
}

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const COLLECTIONS: Record<ArchiveCollection, CollectionCopy> = {
  recordings: {
    title: "Unheard Recordings",
    description: "Private audio sessions and clinical conversations never before released to the public.",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
      </svg>
    ),
  },
  letters: {
    title: "Letters & Correspondence",
    description: "Decades of written exchange with colleagues, patients, and researchers worldwide.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M12 20h9" />
        <path d="M16.4 3.6a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
  diagrams: {
    title: "Original Diagrams",
    description: "Hand-drawn schematics and working models developed across four decades of practice.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
        <path d="M14 3v5h5M9 13h6M9 17h6M9 9h1" />
      </svg>
    ),
  },
  lectures: {
    title: "Lecture Materials",
    description: "Course slides, handouts, and annotated syllabi from international training programs.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M22 10 12 5 2 10l10 5 10-5Z" />
        <path d="M6 12v5c3 2 9 2 12 0v-5" />
      </svg>
    ),
  },
  videos: {
    title: "Videos",
    description: "Rare footage from seminars, interviews, and clinical demonstrations across the years.",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="2" y="6" width="14" height="12" rx="2" />
        <path d="m16 10 6-3v10l-6-3" />
      </svg>
    ),
  },
  seminars: {
    title: "Seminars",
    description: "Full seminar recordings and transcripts from landmark educational events.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M2 5h6a4 4 0 0 1 4 4v11a3 3 0 0 0-3-3H2ZM22 5h-6a4 4 0 0 0-4 4v11a3 3 0 0 1 3-3h7Z" />
      </svg>
    ),
  },
};

/* The hero, the collections' heading and "How it works" (its steps are
   cards, reorderable) are Page Contents blocks: archives-home,
   archives-six-collections, archives-how-it-works (copy in src/data/blocks.ts
   until the rows have it). The six collections themselves stay here: each is
   tied to ArchiveItems' `collection` value and its count. */

function broadcastDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(
    new Date(iso),
  );
}

const pieces = (n: number) => `${n} ${n === 1 ? "piece" : "pieces"}`;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ArchivesPage() {
  const hero = useSection(SECTION.archivesHome);
  const collectionsHead = useSection("archives-six-collections");
  const how = useSection("archives-how-it-works");
  const { status: authStatus, signIn } = useAuth();
  const [items, setItems] = useState<ArchiveListItem[] | null>(null);
  const [error, setError] = useState<ArchivesError | null>(null);
  const [membership, setMembership] = useState<MembershipStatus | null>(null);
  const [viewing, setViewing] = useState<ArchiveListItem | null>(null);
  const [counts, setCounts] = useState<Record<ArchiveCollection, number> | null>(null);
  const [filter, setFilter] = useState<ArchiveCollection | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchArchivesSummary().then((result) => {
      if (!cancelled) setCounts(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

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

  const visible = useMemo(
    () => (items && filter ? items.filter((item) => item.collection === filter) : items),
    [items, filter],
  );

  function openCollection(collection: ArchiveCollection) {
    setFilter(collection);
    scrollToId("archive-content");
  }

  const seo = (
    <Seo
      title={"The Klinghardt Living Archive — Dr. Dietrich Klinghardt™"}
      description="Four decades of Dr. Klinghardt's notes, recordings, diagrams, correspondence and seminar footage — restored and released one piece at a time."
      path="/archives"
      noindex
    />
  );

  if (!items) {
    return (
      <>
        {seo}
        <section className="section wrap archive-gate-page" aria-live="polite">
          {error?.code === "membership_required" ? (
            <MembershipGate error={error} membership={membership} onSignIn={() => signIn("/archives")} />
          ) : error ? (
            <p className="empty-note">{error.message}</p>
          ) : (
            <p className="empty-note">Loading the Archives…</p>
          )}
        </section>
      </>
    );
  }

  return (
    <>
      {seo}

      <section className="archive-hero wrap">
        <Reveal>
          {hero.eyebrow ? <p className="eyebrow"><Marked text={hero.eyebrow} /></p> : null}
          <h1><Marked text={hero.title} /></h1>
          {hero.subtitle ? (
            <p className="archive-hero__subtitle"><Marked text={hero.subtitle} /></p>
          ) : null}
          {hero.marked.map((paragraph) => (
            <p key={paragraph} className="archive-hero__lead">
              <Emphasis text={paragraph} />
            </p>
          ))}
          <button
            type="button"
            className="btn btn-primary archive-hero__cta"
            onClick={() => scrollToId("archive-content")}
          >
            Explore the Archive <span aria-hidden="true">→</span>
          </button>
        </Reveal>
      </section>

      <section className="archive-collections wrap" aria-labelledby="archive-collections-title">
        <Reveal className="archive-section-head">
          {collectionsHead.eyebrow ? (
            <p className="eyebrow"><Marked text={collectionsHead.eyebrow} /></p>
          ) : null}
          <h2 id="archive-collections-title"><Marked text={collectionsHead.title} /></h2>
          {collectionsHead.subtitle ? <p><Marked text={collectionsHead.subtitle} /></p> : null}
          {collectionsHead.marked.map((paragraph) => (
            <p key={paragraph}><Emphasis text={paragraph} /></p>
          ))}
        </Reveal>

        <ul className="archive-collection-grid">
          {ARCHIVE_COLLECTIONS.map((key, index) => {
            const copy = COLLECTIONS[key];
            const count = counts?.[key] ?? 0;
            const open = count > 0;
            return (
              <Reveal as="li" key={key} className="archive-collection" delay={(index % 3) * 70}>
                <div className="archive-collection__top">
                  <span className="archive-collection__icon">{copy.icon}</span>
                  <span className="archive-collection__number">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3>{copy.title}</h3>
                <p>{copy.description}</p>
                {open ? (
                  <button
                    type="button"
                    className="archive-collection__badge archive-collection__badge--open"
                    onClick={() => openCollection(key)}
                  >
                    {`Explore · ${pieces(count)}`}
                  </button>
                ) : (
                  <span className="archive-collection__badge">Coming soon</span>
                )}
              </Reveal>
            );
          })}
        </ul>
      </section>

      <section id="archive-content" className="archive-content wrap" aria-live="polite">
        {items.length === 0 ? (
          <p className="empty-note">
            The first pieces are being restored. Check back soon, or reach out via{" "}
            <a href="/contact">Contact</a> for anything you&apos;re looking for.
          </p>
        ) : (
          <>
            <div className="archive-filter" role="group" aria-label="Filter by collection">
              <button type="button" aria-pressed={filter === null} onClick={() => setFilter(null)}>
                All · {items.length}
              </button>
              {ARCHIVE_COLLECTIONS.filter((key) => items.some((item) => item.collection === key)).map(
                (key) => (
                  <button
                    type="button"
                    key={key}
                    aria-pressed={filter === key}
                    onClick={() => setFilter(key)}
                  >
                    {COLLECTIONS[key].title} · {items.filter((item) => item.collection === key).length}
                  </button>
                ),
              )}
            </div>
            <ul className="archive-grid">
              {(visible ?? []).map((item, index) => (
                <Reveal as="li" key={`${item.source}:${item.id}`} className="archive-card" delay={(index % 3) * 60}>
                  <span className={`archive-card__badge archive-card__badge--${item.kind}`}>
                    {{ video: "Video", image: "Image", pdf: "PDF", audio: "Audio" }[item.kind]}
                  </span>
                  <p className="archive-card__collection">{COLLECTIONS[item.collection].title}</p>
                  <h3>{item.title}</h3>
                  {item.source === "weekly_talk" ? (
                    // One recording per week of the same talk: the date is
                    // what tells them apart.
                    <p className="archive-card__date">{broadcastDate(item.addedAt)}</p>
                  ) : null}
                  {item.description ? <p>{item.description}</p> : null}
                  <button type="button" className="btn btn-outline" onClick={() => setViewing(item)}>
                    {item.kind === "pdf" ? "Open" : "View"}
                  </button>
                </Reveal>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="archive-how wrap" aria-labelledby="archive-how-title">
        <Reveal className="archive-section-head">
          {how.eyebrow ? <p className="eyebrow"><Marked text={how.eyebrow} /></p> : null}
          <h2 id="archive-how-title"><Marked text={how.title} /></h2>
        </Reveal>
        <Reveal as="ol" className="archive-steps">
          {how.cards.map((step, index) => (
            <li key={`${index}-${step.title}`}>
              <p className="archive-steps__label">Step {String(index + 1).padStart(2, "0")}</p>
              <h3><Marked text={step.title} /></h3>
              <span className="archive-steps__rule" aria-hidden="true" />
              {step.body ? <p>{step.body}</p> : null}
            </li>
          ))}
        </Reveal>
      </section>

      {viewing ? <ArchiveViewer item={viewing} onClose={() => setViewing(null)} /> : null}
    </>
  );
}

/**
 * The invitation a non-member gets instead of the page. Signed-out visitors
 * can sign in or go straight to the plans; signed-in ones are told why
 * their account doesn't open it yet.
 */
function MembershipGate({
  error,
  membership,
  onSignIn,
}: {
  error: ArchivesError;
  membership: MembershipStatus | null;
  onSignIn: () => void;
}) {
  return (
    <div className="archive-membership-gate">
      <div className="course-path-card archive-membership-card" role="status">
        <div className="course-path-card__header">
          <span className="course-path-card__badge">Members only</span>
          <h2>The Archives are part of the Weekly Talks membership.</h2>
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
            <>
              <button
                className="course-path-card__cta course-path-card__cta--primary"
                type="button"
                onClick={onSignIn}
              >
                Sign in <span aria-hidden="true">↗</span>
              </button>
              <Link className="course-path-card__cta course-path-card__cta--secondary" to="/weekly-talks">
                Become a member <span aria-hidden="true">↗</span>
              </Link>
            </>
          ) : (
            <>
              <Link className="course-path-card__cta course-path-card__cta--primary" to="/weekly-talks">
                {membership?.status ? "Rejoin membership" : "Become a member"}{" "}
                <span aria-hidden="true">↗</span>
              </Link>
              <Link className="course-path-card__cta course-path-card__cta--secondary" to="/account">
                View account <span aria-hidden="true">↗</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
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
