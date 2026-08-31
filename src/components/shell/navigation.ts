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
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "About", href: "/about" },
  {
    label: "Sophia Health Institute",
    sublabel: "by Dr. Klinghardt™",
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
    // "Akademy", not "Academy" — that is how the design writes the trademark in
    // the navigation, and 15 of the 19 times it appears in the file. The other
    // four say "Academy", so the design contradicts itself; the nav form wins
    // here and the spelling is pending the client's confirmation (see A14).
    // `Klinghardt Akademie` below is a different thing: the German academy in
    // Europe, whose name really is spelled that way.
    label: "Dr. Klinghardt Akademy",
    href: "/academy",
    mark: "™",
    children: [
      { label: "Find A.R.T. therapists", href: "/academy/therapists" },
      { label: "A.R.T. Klinghardt", href: "/academy/art", mark: "™" },
      { label: "The 5 Levels of Healing", href: "/academy/five-levels", mark: "™" },
      { label: "Publications", href: "/academy/publications" },
      { label: "Klinghardt Akademie", href: "/academy/akademie" },
      { label: "Dr. Klinghardt Foundation", href: "/foundation", mark: "™" },
    ],
  },
  { label: "Online courses", href: "/courses" },
  { label: "Store", href: "/store" },
  { label: "Music", href: "/music" },
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
