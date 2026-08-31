import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PRIMARY_NAV, type NavItem } from "./navigation";
import { CartButton } from "./CartButton";

// Hash-anchor children (e.g. "/sophia#chronic-illness") share a pathname with
// their parent page and several siblings, so pathname alone can't tell which
// section is "current" — only real routed children get the highlight.
function isChildCurrent(pathname: string, href: string): boolean {
  if (href.includes("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Trademark marks render small and raised everywhere in the brand. */
function Label({ item }: { item: NavItem }) {
  return (
    <>
      {item.label}
      {item.mark ? <sup className="tm">{item.mark}</sup> : null}
    </>
  );
}

/**
 * Primary navigation: announcement bar sits above (rendered by SiteShell), then
 * the brand, the mega-nav with two dropdown branches (Sophia and the Academy),
 * the Contact CTA and the cart.
 *
 * Dropdowns open on hover for pointer users and on click/Enter for everyone
 * else — hover alone would strand keyboard and touch users on the two branches
 * that hold half the site.
 */
export function SiteHeader() {
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const menuId = useId();

  // Publishes the header's real rendered height as --header-h, which .hero
  // (sections.css) reads to extend its own background up behind the header —
  // measured rather than guessed because the nav wraps to a second line at
  // some widths, changing the header's height.
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const publish = () => {
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    };
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The home hero panel opens on the same navy as the header, so the header
  // stays transparent until the page scrolls past it — everywhere else, and
  // once scrolled, it keeps its normal solid background.
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);
  const isTransparent = isHome && !isScrolled;

  // Any navigation closes everything — otherwise a dropdown survives the route
  // change and hangs over the new page.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!openMenu && !mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openMenu, mobileOpen]);

  return (
    <header
      className={`site-header${isTransparent ? " site-header--transparent" : ""}`}
      ref={headerRef}
    >
      <Link className="site-header__brand" to="/" aria-label="Dietrich Klinghardt, home">
        <span>Dietrich</span>
        <span>
          Klinghardt<sup className="tm">™</sup>
        </span>
      </Link>

      <nav
        className={`site-nav${mobileOpen ? " is-open" : ""}`}
        aria-label="Primary"
        id={menuId}
      >
        <ul className="site-nav__list">
          {PRIMARY_NAV.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const isOpen = openMenu === item.href;
            const isCurrent =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li
                key={item.href}
                className={`site-nav__item${hasChildren ? " has-children" : ""}`}
                onMouseEnter={hasChildren ? () => setOpenMenu(item.href) : undefined}
                onMouseLeave={hasChildren ? () => setOpenMenu(null) : undefined}
              >
                <span className="site-nav__row">
                  <Link
                    className="site-nav__link"
                    to={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    <Label item={item} />
                  </Link>
                  {hasChildren ? (
                    <button
                      type="button"
                      className="site-nav__toggle"
                      aria-expanded={isOpen}
                      aria-label={`${item.label} submenu`}
                      onClick={() => setOpenMenu(isOpen ? null : item.href)}
                    >
                      <svg viewBox="0 0 12 8" aria-hidden="true">
                        <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                    </button>
                  ) : null}
                </span>

                {hasChildren ? (
                  <ul className={`site-nav__menu${isOpen ? " is-open" : ""}`}>
                    {item.children!.map((child) => (
                      <li key={child.href}>
                        <Link
                          to={child.href}
                          aria-current={isChildCurrent(pathname, child.href) ? "page" : undefined}
                        >
                          <Label item={child} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="site-header__actions">
        <Link className="btn btn-light site-header__cta" to="/contact">
          Contact us
        </Link>
        <CartButton />
        <button
          type="button"
          className="site-header__burger"
          aria-expanded={mobileOpen}
          aria-controls={menuId}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span aria-hidden="true">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </div>
    </header>
  );
}
