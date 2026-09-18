import { useCollection } from "./content";
import { mediaUrl, richTextBlocks } from "./cms";
import type { ContentDoc } from "@/data/demo";

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
 * Adding a section = add a slug here, create the row in the CMS, done.
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

  sophiaHome: "sophia-home",
  sophiaTeam: "sophia-team",
  newPatients: "new-patients",
  accommodations: "accommodations",

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

export interface Section {
  /** Heading for the block. */
  title: string;
  /** Body copy, one entry per paragraph. */
  paragraphs: string[];
  /** First paragraph, the common case. */
  lead: string;
  image?: string;
  raw?: ContentDoc;
}

/**
 * Normalised view of a section, with per-field fallbacks: the CMS wins where it
 * has content, the design's copy fills every gap.
 */
export function useSection(
  slug: string,
  /**
   * `image` takes the same role the other fallbacks do: a picture the client
   * delivered and that ships with the build, used until the same slot is filled
   * in the CMS. The CMS still wins when it has one, so uploading a portrait
   * later replaces this without a code change.
   */
  fallback: { title?: string; paragraphs?: string[]; image?: string } = {},
): Section {
  const doc = useCollection("page-contents").find((item) => item.slug === slug);
  const paragraphs = doc ? richTextBlocks(doc.body) : [];
  const resolved = paragraphs.length ? paragraphs : (fallback.paragraphs ?? []);

  return {
    title:
      (typeof doc?.title === "string" && doc.title.trim()) || fallback.title || "",
    paragraphs: resolved,
    lead: resolved[0] ?? "",
    image: mediaUrl(doc?.heroImage) ?? fallback.image,
    raw: doc,
  };
}

/**
 * Sophia team member bios have no field of their own in `board-members`
 * (name/role/title/photo only — see TeamMemberPage.tsx and teamBios.ts) —
 * each bio instead lives as its own `page-contents` row, one per person,
 * keyed off the same name-derived slug the roster already uses to link to
 * /sophia/team/<slug>.
 *
 * Not a fixed `SECTION.*` entry like the rest of this file: the roster is
 * CMS data, not code, so the set of people (and slugs) isn't fixed either —
 * a new hire needs a new row, not a code change. `useSection` already takes
 * a plain string, so this is just that string built consistently instead of
 * repeated inline at each call site.
 */
export function sophiaTeamBioSlug(personSlug: string): string {
  return `sophia-team-bio-${personSlug}`;
}

/**
 * A few blocks are lists of small records — the About timeline, the four
 * contact cards, the five levels of the pyramid — and `page-contents` has no
 * repeater field.
 *
 * Rather than inventing a collection for each (a shared CMS: every new
 * collection is a migration everybody else's tenant carries), those rows keep
 * one line per record with fields separated by a pipe:
 *
 *     1978 | Anesthesiology, Freiburg | Where the questions started.
 *
 * A pipe is used instead of a dash because the copy itself is full of dashes.
 * Lines with too few fields are dropped rather than rendered half-empty.
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
