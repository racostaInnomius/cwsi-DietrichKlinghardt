export type ContentDoc = Record<string, unknown> & { id?: string | number };

/**
 * Bundled fallback content.
 *
 * Only rows that carry fields beyond title + body live here. Ordinary section
 * copy has its fallback inline at the call site (`useSection(slug, {…})`), next
 * to the markup it belongs to — two competing fallback layers for the same slug
 * is how a page ends up rendering copy nobody can find in the codebase.
 */
export const demoContent: Record<string, ContentDoc[]> = {
  "page-contents": [
    {
      // The announcement bar is on every page, so its fallback matters more
      // than most: an empty CMS must not leave a blank gold strip at the top of
      // the site. It also carries a CTA label + URL, which `useSection` (title +
      // body only) has no place for.
      id: "announcement-fallback",
      slug: "announcement",
      title: "Join my weekly talk: next session September 1st.",
      ctaLabel: "Join now",
      ctaUrl: "/weekly-talks",
    },
  ],
};
