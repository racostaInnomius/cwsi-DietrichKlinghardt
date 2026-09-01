import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { themeForPath } from "./navigation";
import { usePageContent, text } from "@/lib/content";

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

  // The announcement bar is editable from the CMS like any other copy; the
  // fallback keeps the bar meaningful when the CMS is unreachable.
  const banner = usePageContent("announcement");
  const bannerText = text(
    banner,
    "title",
    "Join my weekly talk: next session September 1st.",
  );
  const bannerCta = text(banner, "ctaLabel", "Join now");
  const bannerHref = text(banner, "ctaUrl", "/weekly-talks");

  // Route changes scroll to top, except when the URL carries an anchor — the
  // nav links into #newsletter and #faq and those must land on the section.
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return (
    <div className="site-shell" data-theme={resolvedTheme}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <aside className="announcement" aria-label="Announcement">
        <p>
          {bannerText}{" "}
          <a href={bannerHref}>{bannerCta}</a>
        </p>
      </aside>

      <SiteHeader />

      <main id="main-content" className={pathname === "/" ? "main-home" : undefined}>
        {children}
      </main>

      <SiteFooter theme={resolvedTheme} />
    </div>
  );
}
