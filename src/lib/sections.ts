import { useCollection } from "./content";
import { mediaAlt, mediaUrl, richTextBlocks, richTextMarked } from "./cms";
import { plainText } from "@/components/Emphasis";
import type { ContentDoc } from "@/data/demo";
import { BLOCKS } from "@/data/blocks";

/**
 * Section vocabulary.
 *
 * A `page-contents` row gives us `title` + `body` (rich text) + optional
 * hero/video/music. Rather than packing a whole page into one row and reading
 * copy by block index — brittle, and exactly the kind of positional coupling
 * that silently broke Iconic — each section of the site owns its own slug.
 * Editors see one clearly-named row per block of the page, and a missing row
 * degrades to the bundled fallback instead of shifting every other string.
 *
 * Adding a section = add a slug here and its copy in src/data/blocks.ts (what
 * it shows until the CMS row exists, and what the seed creates the row with).
 */
export const SECTION = {
  announcement: "announcement",

  aboutChapters: "about-chapters",
  aboutTimeline: "about-timeline",
  contactCards: "contact-cards",
  fiveLevelsList: "five-levels-list",
  musicLinks: "music-links",

  homeHero: "home-hero",
  homeIntro: "home-intro",
  homeEvents: "home-events",
  homeArt: "home-art",
  homeShop: "home-shop",
  homeTalks: "home-talks",
  newsletter: "newsletter",

  about: "about",
  contact: "contact",
  fiveLevels: "five-levels",
  music: "music",
  foundation: "foundation",
  weeklyTalks: "weekly-talks",

  homeSophia: "home-sophia",

  sophiaHome: "sophia-home",
  sophiaFigures: "sophia-figures",
  sophiaOurApproach: "sophia-our-approach",
  sophiaSixPillars: "sophia-six-pillars",
  sophiaCuttingEdgeScience: "sophia-cutting-edge-science",
  sophiaCare: "sophia-naturopathic-care",
  sophiaWhatWeTreat: "sophia-what-we-treat",
  sophiaCtaStopWondering: "sophia-cta-stop-wondering",
  sophiaTeam: "sophia-team",
  newPatients: "new-patients",
  newPatientsWelcome: "sophia-new-patients-welcome",
  newPatientsWondering: "sophia-new-patients-you-may-be-wondering",
  newPatientsDifferent: "sophia-new-patients-what-makes-this-different",
  newPatientsExpect: "sophia-new-patients-what-to-expect",
  sophiaCtaNextStep: "sophia-cta-ready-to-take-the-next-step",
  accommodations: "accommodations",
  accommodationsHotels: "sophia-accommodations-hotels",

  coursesInstructors: "courses-instructors",

  /* Headings the event page prints around each event's own copy. They belong
     to the site, not to one event, so they live in a single block every event
     page reads (client, 2026-10-26: "About the Programme" was hard-coded). */
  eventPage: "event-page",

  /* Client (2026-09-18): "Archives" — migrated from klinghardt-akademie.de
     (password-protected legacy site), kept in German on purpose. Own slugs
     rather than reusing e.g. SECTION.fiveLevels: same subject as the
     existing English /academy pages, different (German) copy and source,
     not a replacement for them. */
  archivesHome: "archives-home",
  archivesArt: "archives-art-klinghardt",
  archivesApn: "archives-apn",
  archivesFiveLevels: "archives-five-levels",
  archivesFiveLevelsList: "archives-five-levels-list",
} as const;

export interface Card {
  /** Icon key chosen in the CMS (Page Contents → Cards); each page maps it. */
  icon: string;
  title: string;
  body: string;
  /** Cards → "Más datos": a year or figure, a secondary line, contact data. */
  label?: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  link?: string;
  /** Cards → Foto (a CMS upload), or a bundled path in BLOCKS. */
  image?: string;
}

export interface Section {
  /** Small line above the heading. */
  eyebrow: string;
  /** Heading for the block. */
  title: string;
  /** Line under the heading (in closing bands, the heading's second line). */
  subtitle: string;
  /** Body copy, one entry per paragraph. */
  paragraphs: string[];
  /** First paragraph, the common case. */
  lead: string;
  /** The paragraphs with **bold** / *italic* kept, for <Emphasis>. */
  marked: string[];
  /** The block's cards, in the editor's order (Page Contents → Tarjetas). */
  cards: Card[];
  image?: string;
  /** The uploaded image's own alt text (Media → "Texto alternativo"). */
  imageAlt?: string;
  raw?: ContentDoc;
}

export interface SectionFallback {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  paragraphs?: string[];
  cards?: Card[];
  /**
   * A picture the client delivered and that ships with the build, used until
   * the same slot is filled in the CMS. The CMS still wins when it has one, so
   * uploading a portrait later replaces this without a code change.
   */
  image?: string;
}

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

function itemCards(doc: ContentDoc | undefined): Card[] {
  const items = Array.isArray(doc?.items) ? (doc.items as Record<string, unknown>[]) : [];
  return items
    .map((item) => ({
      icon: text(item.icon),
      title: text(item.title),
      body: text(item.body),
      label: text(item.label),
      subtitle: text(item.subtitle),
      email: text(item.email),
      phone: text(item.phone),
      link: text(item.link),
      image: mediaUrl(item.image),
    }))
    .filter((card) => card.title);
}

/**
 * Normalised view of a section, with per-field fallbacks: the CMS wins where it
 * has content; the copy in BLOCKS (src/data/blocks.ts, the same copy the CMS
 * was seeded with) fills every gap, and an explicit `fallback` wins over it.
 */
export function useSection(slug: string, fallback: SectionFallback = {}): Section {
  const defaults = { ...BLOCKS[slug], ...fallback };
  const doc = useCollection("page-contents").find((item) => item.slug === slug);
  const paragraphs = doc ? richTextBlocks(doc.body) : [];
  const marked = doc ? richTextMarked(doc.body) : [];
  const resolved = paragraphs.length ? paragraphs : (defaults.paragraphs ?? []).map(plainText);
  const cards = itemCards(doc);

  return {
    eyebrow: text(doc?.eyebrow) || defaults.eyebrow || "",
    title: text(doc?.title) || defaults.title || "",
    subtitle: text(doc?.subtitle) || defaults.subtitle || "",
    paragraphs: resolved,
    lead: resolved[0] ?? "",
    marked: marked.length ? marked : (defaults.paragraphs ?? []),
    cards: cards.length ? cards : (defaults.cards ?? []),
    image: mediaUrl(doc?.heroImage) ?? defaults.image,
    imageAlt: mediaAlt(doc?.heroImage),
    raw: doc,
  };
}

/**
 * The cards of a block, from Page Contents → "Tarjetas" (`items`), in the
 * order the editor dragged them into. With no row, or a row without cards, the
 * cards in BLOCKS (or `fallback.cards`) ship instead.
 */
export function useCards(slug: string, fallback: SectionFallback = {}): Section {
  return useSection(slug, fallback);
}

/**
 * Lists that used to live in Body as one line per record, fields separated by
 * a pipe (`1978 | Freiburg | Where the questions started.`), before Page
 * Contents had cards. Cards win; a row still carrying the old lines keeps
 * working through `fromRecord` (the seed moves them into cards); with neither,
 * the BLOCKS copy. Lines with too few fields are dropped.
 */
export function useCardList(
  slug: string,
  fields: number,
  fromRecord: (cells: string[], index: number) => Card,
): Section {
  const section = useSection(slug);
  if (itemCards(section.raw).length) return section;
  const records = (section.raw ? richTextBlocks(section.raw.body) : [])
    .filter((line) => line.includes("|"))
    .map((line) => line.split("|").map((cell) => cell.trim()))
    .filter((cells) => cells.length >= fields && cells.slice(0, fields).every(Boolean));
  return records.length ? { ...section, cards: records.map(fromRecord) } : section;
}

/**
 * One line per record, fields separated by a pipe — kept for the lists whose
 * records are not cards (the discography carries a price and a cover path).
 */
export function useRecords(
  slug: string,
  fields: number,
  fallback: string[][] = [],
): string[][] {
  const { paragraphs } = useSection(slug);
  const rows = paragraphs
    .map((line) => line.split("|").map((cell) => cell.trim()))
    .filter((cells) => cells.length >= fields && cells.every(Boolean));
  return rows.length ? rows : fallback;
}
