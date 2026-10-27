import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { type NavItem } from "./navigation";
import { usePrimaryNav } from "@/lib/menu";
import { CartButton } from "./CartButton";
import { useStoreVisible } from "@/lib/store";
import { CurrencySelect } from "./CurrencySelect";
import { AccountButton } from "./AccountButton";
import { ButtonText } from "@/components/ButtonText";

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
  // The cart goes with the store when it's switched off in the CMS.
  const storeVisible = useStoreVisible();
  // Wording, order and submenus come from the CMS (Site Menus); the menu in
  // navigation.ts is the fallback.
  const primaryNav = usePrimaryNav();

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
      className={`site-header${pathname === "/" ? " site-header--home" : ""}`}
      ref={headerRef}
    >
      <div className="site-header__inner">
        <Link className="site-header__brand" to="/" aria-label="Dietrich Klinghardt, home">
          <img className="site-header__brand-mark" src="/images/logo-tm.svg" alt="" />
        </Link>

        <nav
          className={`site-nav${mobileOpen ? " is-open" : ""}`}
          aria-label="Primary"
          id={menuId}
        >
          <ul className="site-nav__list">
            {primaryNav.map((item, index) => {
              const hasChildren = Boolean(item.children?.length);
              const id = `${index}-${item.href}`;
              const isOpen = openMenu === id;
              const isCurrent =
                !item.external &&
                (pathname === item.href || pathname.startsWith(`${item.href}/`));
              const labelLines = (
                <>
                  <Label item={item} />
                  {item.sublabel ? (
                    <span className="site-nav__link">
                      {item.sublabel}
                      {item.mark ? <sup className="tm">{item.mark}</sup> : null}
                    </span>
                  ) : null}
                </>
              );

              return (
                <li
                  key={id}
                  className={`site-nav__item${hasChildren ? " has-children" : ""}`}
                  onMouseEnter={hasChildren ? () => setOpenMenu(id) : undefined}
                  onMouseLeave={hasChildren ? () => setOpenMenu(null) : undefined}
                >
                  <span className="site-nav__row">
                    {/* A top-level option can point off-site too, now that the
                        menu is editable (Site Menus → "External link"). */}
                    {item.external ? (
                      <a
                        className="site-nav__link"
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {labelLines}
                      </a>
                    ) : (
                      <Link
                        className="site-nav__link"
                        to={item.href}
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        {labelLines}
                      </Link>
                    )}
                    {hasChildren ? (
                      <button
                        type="button"
                        className="site-nav__toggle"
                        aria-expanded={isOpen}
                        aria-label={`${item.label} submenu`}
                        onClick={() => setOpenMenu(isOpen ? null : id)}
                      >
                        <svg viewBox="0 0 12 8" aria-hidden="true">
                          <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                        </svg>
                      </button>
                    ) : null}
                  </span>

                  {hasChildren ? (
                    <ul className={`site-nav__menu${isOpen ? " is-open" : ""}`}>
                      {item.children!.map((child, childIndex) => (
                        <li key={`${childIndex}-${child.href}`}>
                          {child.external ? (
                            <a href={child.href} target="_blank" rel="noopener noreferrer">
                              <Label item={child} />
                            </a>
                          ) : (
                            <Link
                              to={child.href}
                              aria-current={isChildCurrent(pathname, child.href) ? "page" : undefined}
                            >
                              <Label item={child} />
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
          {/* Hamburger menu only (≤1129px): the header row has no room for
              the currency switch there — see .site-nav__currency. */}
          <div className="site-nav__currency">
            <CurrencySelect />
          </div>
        </nav>

        <div className="site-header__actions">
          <Link className="btn btn-light site-header__cta" to="/contact">
            <ButtonText id="header-contact" />
          </Link>
          <CurrencySelect />
          {storeVisible ? <CartButton /> : null}
          <AccountButton />
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
      </div>
    </header>
  );
}
