import { Link } from "react-router-dom";
import { FOOTER_NAV, type NavItem } from "./navigation";
import { FacebookIcon, InstagramIcon, TelegramIcon, VimeoIcon } from "@/components/Icons";
import { env } from "@/lib/env";

function Label({ item }: { item: NavItem }) {
  return (
    <>
      {item.label}
      {item.mark ? <sup className="tm">{item.mark}</sup> : null}
    </>
  );
}

/**
 * Four-column footer with the oversized "Dr. Dietrich Klinghardt" watermark,
 * repeated on every frame of the design. Follows the page's own theme —
 * navy on DK pages, teal on /sophia/* — per the client's 2026-09-01 request;
 * it used to stay navy everywhere (the footer closing the whole site, not
 * the sub-brand), but Sophia now gets its own colour here too.
 */
export function SiteFooter({ theme }: { theme: "dk" | "sophia" }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" data-theme={theme}>
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link to="/" aria-label="Dietrich Klinghardt, home">
            <span>Dietrich</span>
            <span>
              Klinghardt<sup className="tm">™</sup>
            </span>
          </Link>
          <div className="site-footer__social">
            <a href={env.INSTAGRAM_URL} aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href={env.FACEBOOK_URL} aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href={env.TELEGRAM_URL} aria-label="Telegram">
              <TelegramIcon />
            </a>
            <a href={env.VIMEO_URL} aria-label="Vimeo">
              <VimeoIcon />
            </a>
          </div>
        </div>

        {FOOTER_NAV.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="site-footer__title">{column.title}</h2>
            <ul>
              {column.items.map((item) => (
                <li key={`${column.title}-${item.href}-${item.label}`}>
                  <Link to={item.href}>
                    <Label item={item} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <p className="site-footer__watermark" aria-hidden="true">
        Dr. Dietrich Klinghardt
      </p>

      <div className="site-footer__legal">
        <span>© {year} Dietrich Klinghardt™ All rights reserved.</span>
        <span className="site-footer__legal-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </span>
      </div>
    </footer>
  );
}
