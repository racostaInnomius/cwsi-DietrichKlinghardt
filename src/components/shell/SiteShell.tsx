import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { themeForPath } from "./navigation";
import { useCollection, usePageContent, text } from "@/lib/content";
import { eventMonthDayOrdinal, nextWeeklyTalk } from "@/lib/format";

/**
 * Pages that skip <NewsletterSection> and get /foundation's flat-navy
 * footer instead of the amber fade — client-named "terminación plana"
 * (2026-09-16).
 */
const FLAT_ENDING_PATHS = new Set([
  "/foundation",
  "/courses/art",
  "/academy/therapists",
  "/academy/five-levels",
  "/weekly-talks",
]);
/* Client (2026-09-18): "Necesito terminación plana para '/archives/*'" —
 * a whole section (the landing page plus every migrated subpage), not one
 * more exact route to add to the set above, so this checks the prefix
 * instead — the same shape as navigation.ts's own SOPHIA_PREFIXES check.
 * None of the Archives pages render <NewsletterSection>, so they already
 * meet that precondition.
 */
const FLAT_ENDING_PREFIXES = ["/archives"];

function hasFlatEnding(pathname: string): boolean {
  return (
    FLAT_ENDING_PATHS.has(pathname) ||
    FLAT_ENDING_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  );
}

/**
 * The frame every page of the new site renders inside: announcement bar,
 * header, main, footer — plus the brand theme.
 *
 * Theme resolution is route-driven (`themeForPath`) rather than a prop each
 * page has to remember, so a new page under /sophia is teal by construction.
 * An explicit `theme` still wins for one-off sections.
 */
export function SiteShell({
  children,
  theme,
}: {
  children: ReactNode;
  theme?: "dk" | "sophia";
}) {
  const { pathname, hash } = useLocation();
  const resolvedTheme = theme ?? themeForPath(pathname);
  // Every internal DK page (not Home, not /sophia/*, which keep their own
  // treatment). Most of these render <NewsletterSection>, which self-pins
  // and already ends on this exact navy (see NewsletterSection.tsx) — this
  // flag only matters as the static fallback (shell.css) for the handful
  // that don't (Contact, Cart, Legal, the coming-soon placeholders...),
  // where <main> still ends on the page gradient's amber with nothing
  // between it and the footer. shell.css suppresses this fallback outright
  // wherever a pinned newsletter is already on the page.
  // Client (2026-09-15): "solamente en /foundation... que sea azul sin el
  // degradado naranja" — its own quote section already ends the page on
  // the amber tail on purpose (a separate, earlier request), so the
  // footer's fade would double up on the same transition right under it.
  // Client (2026-09-16): named this "terminación plana" going forward —
  // any page that drops its NewsletterSection and wants /foundation's same
  // flat-navy ending (no fade) gets added to this list.
  const footerFade =
    resolvedTheme === "dk" && pathname !== "/" && !hasFlatEnding(pathname);

  // The announcement bar is editable from the CMS like any other copy; the
  // fallback keeps the bar meaningful when the CMS is unreachable.
  const banner = usePageContent("announcement");
  const bannerTextRaw = text(
    banner,
    "title",
    "Join my weekly talk: next session September 1st.",
  );
  // The CMS copy's trailing date ("next session September 1st.") goes stale
  // the moment a new talk is scheduled — swap in the real next weekly talk's
  // date (client, 2026-10-04) while leaving the rest of the CMS wording
  // alone. Events without a next talk, or CMS copy that doesn't end in a
  // date, keep the raw CMS text untouched.
  const nextTalkDate = eventMonthDayOrdinal(nextWeeklyTalk(useCollection("events")));
  const bannerText = nextTalkDate
    ? bannerTextRaw.replace(/[A-Z][a-z]+ \d{1,2}(st|nd|rd|th)\.?$/, `${nextTalkDate}.`)
    : bannerTextRaw;
  const bannerCta = text(banner, "ctaLabel", "Join now");
  const bannerHref = text(banner, "ctaUrl", "/weekly-talks");

  // Shrinks the announcement bar once the page has scrolled past the very
  // top, back to full size at the top again (client, 2026-09-09: "cuando
  // comience a seguir al menu... un 10% mas delgado... cuando regrese a
  // top que regrese a su tamaño original"). A small threshold rather than
  // > 0 so it doesn't flicker on the sub-pixel scroll jitter some
  // trackpads report at rest.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Route changes scroll to top, except when the URL carries an anchor — the
  // nav links into #chronic-illness, #naturopathic-care, #newsletter and
  // #faq and those must land on the section. Client-side navigation (a
  // <Link>, not a real page load) never triggers the browser's own
  // scroll-to-fragment, so this has to do it explicitly — it never did, and
  // the anchor links simply landed at the top of the target page instead
  // (2026-09-07: "no está scrolleando a sus lugares"). Offsets by the
  // sticky header's own height so its section doesn't render half-hidden
  // underneath it. The announcement bar is sticky too now (2026-09-09:
  // "que tambien se mantenga arriba del menu"), stacked above the header
  // inside .site-shell__sticky-top — so the offset has to cover that
  // whole wrapper's height, not just the header's own.
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    const stickyTop = document.querySelector<HTMLElement>(".site-shell__sticky-top");
    const offset = (stickyTop?.getBoundingClientRect().height ?? 0) + 16;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset });
  }, [pathname, hash]);

  return (
    <div className="site-shell" data-theme={resolvedTheme}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="site-shell__sticky-top">
        <aside
          className={`announcement${scrolled ? " is-scrolled" : ""}`}
          aria-label="Announcement"
        >
          <p>
            {bannerText}{" "}
            <a href={bannerHref}>{bannerCta}</a>
          </p>
        </aside>

        <SiteHeader />
      </div>

      <main
        id="main-content"
        className={
          pathname === "/"
            ? "main-home"
            : pathname === "/sophia"
              ? "main-sophia-home"
              : pathname === "/about"
                ? "main-about"
                : pathname.startsWith("/sophia/team/")
                  ? "main-sophia-team-member"
                  : undefined
        }
      >
        {children}
      </main>

      <SiteFooter theme={resolvedTheme} fade={footerFade} />
    </div>
  );
}
