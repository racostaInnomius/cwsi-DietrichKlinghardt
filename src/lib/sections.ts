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
  fallback: { title?: string; paragraphs?: string[] } = {},
): Section {
  const doc = useCollection("page-contents").find((item) => item.slug === slug);
  const paragraphs = doc ? richTextBlocks(doc.body) : [];
  const resolved = paragraphs.length ? paragraphs : (fallback.paragraphs ?? []);

  return {
    title:
      (typeof doc?.title === "string" && doc.title.trim()) || fallback.title || "",
    paragraphs: resolved,
    lead: resolved[0] ?? "",
    image: mediaUrl(doc?.heroImage),
    raw: doc,
  };
}
