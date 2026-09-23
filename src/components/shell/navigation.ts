/**
 * The site's information architecture, transcribed from the "Navigation
 * sitemap" frame of the Figma file (frame 2, `SITE MAP`) — that frame is the
 * client-approved structure, so it lives here as data rather than being
 * scattered across header, footer and breadcrumb markup.
 *
 * `theme` marks the branches that render under the Sophia palette; the shell
 * reads it so a section can never end up wearing the wrong brand.
 */

export type Brand = "dk" | "sophia";

export interface NavItem {
  label: string;
  href: string;
  /** Present on trademarked names so the shell can render the mark small+raised. */
  mark?: "™" | "®";
  /** Small second line under the label — only the Sophia item carries one. */
  sublabel?: string;
  children?: NavItem[];
  theme?: Brand;
  /** True for a link off this site — SiteHeader renders a plain <a
   *  target="_blank"> instead of a router <Link>, since react-router's
   *  <Link> assumes an internal route. */
  external?: boolean;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "About", href: "/about" },
  {
    label: "Sophia Health Institute",
    /* The mark used to be baked into this string as a plain "™" character,
       full-size instead of the small+raised treatment Label gives the main
       label's own mark — inconsistent side by side (2026-09-05: "el de
       arriba mas pequeño que el de abajo"). Bare now; SiteHeader.tsx
       appends item.mark the same way for both lines. */
    sublabel: "by Dr. Klinghardt",
    href: "/sophia",
    mark: "™",
    theme: "sophia",
    children: [
      { label: "Chronic illness", href: "/sophia#chronic-illness", theme: "sophia" },
      { label: "Naturopathic care", href: "/sophia#naturopathic-care", theme: "sophia" },
      { label: "Our team", href: "/sophia/team", theme: "sophia" },
      { label: "New patients", href: "/sophia/new-patients", theme: "sophia" },
      { label: "Travel & accommodations", href: "/sophia/accommodations", theme: "sophia" },
    ],
  },
  { label: "Events", href: "/events" },
  {
    // "Akademie", matching the German spelling — client-confirmed (see A14),
    // superseding the design's original "Akademy" navigation form.
    label: "Dr. Klinghardt Akademie",
    href: "/academy",
    mark: "™",
    children: [
      { label: "Find A.R.T. therapists", href: "/academy/therapists" },
      { label: "A.R.T. Klinghardt", href: "/academy/art", mark: "™" },
      { label: "The 5 Levels of Healing", href: "/academy/five-levels", mark: "™" },
      { label: "Publications", href: "/academy/publications" },
      // Client (2026-09-23): links out to the real (German) Akademie site
      // rather than the internal /academy/akademie page.
      { label: "Klinghardt Akademie", href: "https://klinghardt-akademie.de/", external: true },
      { label: "Dr. Klinghardt Foundation", href: "/foundation", mark: "™" },
    ],
  },
  {
    // Two lines to trim this item's own horizontal footprint (client,
    // 2026-09-09: "probar mostrar 'Online Courses' en dos lineas para
    // mejorar el espacio del menu") — reusing the same label/sublabel
    // stack Sophia's nav item already uses, which renders both lines at
    // the same size/weight (site-nav__link .site-nav__link only changes
    // display/padding, not typography).
    label: "Online",
    sublabel: "Courses",
    href: "/courses",
  },
  { label: "Store", href: "/store" },
  { label: "Music", href: "/music" },
  // Client (2026-09-18): migrated from klinghardt-akademie.de (password-
  // protected legacy site) — its own "Ausbildung & Seminare" dropdown
  // becomes this item's children, minus Kontakt (not migrated; the site's
  // own /contact covers it). Content stays German on purpose.
  {
    label: "Archives",
    href: "/archives",
    children: [
      { label: "A.R.T. Klinghardt", href: "/archives/art-klinghardt", mark: "™" },
      { label: "Applied Psycho-Neurobiology (APN)", href: "/archives/apn-applied-psycho-neurobiology" },
      { label: "5 Levels of Healing", href: "/archives/five-levels-of-healing", mark: "™" },
    ],
  },
];

/** Footer columns, from the four-column footer that repeats on every frame. */
export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "About",
    items: [
      { label: "Sophia Health Institute", href: "/sophia", mark: "™" },
      { label: "A.R.T. Klinghardt", href: "/academy/art", mark: "™" },
      { label: "Find a Practitioner", href: "/academy/therapists" },
    ],
  },
  {
    title: "Programs",
    items: [
      { label: "Upcoming Events", href: "/events" },
      { label: "Training Programs", href: "/courses" },
      { label: "Certifications", href: "/courses" },
      { label: "Archives", href: "/archives" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Careers", href: "/contact" },
      { label: "Newsletter", href: "/#newsletter" },
      { label: "Dr. Klinghardt Foundation", href: "/foundation", mark: "™" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/sophia/new-patients#faq" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

/** Routes that render under the Sophia palette (prefix match). */
const SOPHIA_PREFIXES = ["/sophia"];

export function themeForPath(pathname: string): Brand {
  return SOPHIA_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
    ? "sophia"
    : "dk";
}
