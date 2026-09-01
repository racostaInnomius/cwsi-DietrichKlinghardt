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
  // Temporary — added 2026-09-01 at the client's request to verify the home
  // page's Upcoming/Past events tabs while the CMS has zero events of either
  // kind. Same rule as every other fallback here: the live CMS wins the
  // moment it has real rows, so these disappear on their own once real
  // events are entered — delete this block then, don't wait for that day.
  events: [
    {
      id: "demo-event-1",
      slug: "art-klinghardt-foundations-workshop",
      title: "A.R.T. Klinghardt™ Foundations Workshop",
      startDateTime: "2026-09-15T09:00:00-07:00",
      city: "Seattle",
      country: "USA",
      category: "Workshop",
      shortDescription:
        "A two-day introduction to Autonomic Response Testing® for practitioners new to the method.",
      price: 49000,
      currency: "usd",
    },
    {
      id: "demo-event-2",
      slug: "five-levels-of-healing-live-seminar",
      title: "The 5 Levels of Healing™ — Live Seminar",
      startDateTime: "2026-10-06T09:00:00-04:00",
      city: "New York",
      country: "USA",
      category: "Seminar",
      shortDescription:
        "Dr. Klinghardt walks through the framework in depth, with case studies from the clinic.",
      price: 39000,
      currency: "usd",
    },
    {
      id: "demo-event-3",
      slug: "chronic-illness-case-studies-webinar",
      title: "Chronic Illness Case Studies — Online Webinar",
      startDateTime: "2026-10-20T17:00:00-07:00",
      onlinePlatform: "Zoom",
      category: "Webinar",
      shortDescription:
        "A live online session reviewing real cases and the reasoning behind each treatment plan.",
      price: 9000,
      currency: "usd",
    },
  ],
};
