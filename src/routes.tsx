import { Navigate, Outlet } from "react-router-dom";
import type { RouteRecord } from "vite-react-ssg";
import { ContentProvider, loadSiteContent } from "@/lib/content";
import { CartProvider } from "@/lib/cart";
import { fetchCollection, fetchEvents } from "@/lib/cms";
import { trainingPaths } from "@/data/trainingPaths";
import { SiteShell } from "@/components/shell/SiteShell";
import { HomePage } from "@/pages/HomePage";
import { EventsPage } from "@/pages/EventsPage";
import { EventDetailPage } from "@/pages/EventDetailPage";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { FiveLevelsPage } from "@/pages/FiveLevelsPage";
import { MusicPage } from "@/pages/MusicPage";
import { FoundationPage } from "@/pages/FoundationPage";
import { WeeklyTalksPage } from "@/pages/WeeklyTalksPage";
import { SophiaPage } from "@/pages/sophia/SophiaPage";
import { SophiaTeamPage } from "@/pages/sophia/SophiaTeamPage";
import { NewPatientsPage } from "@/pages/sophia/NewPatientsPage";
import { AccommodationsPage } from "@/pages/sophia/AccommodationsPage";
import { CoursesPage } from "@/pages/courses/CoursesPage";
import { TrainingPathPage } from "@/pages/courses/TrainingPathPage";
import { CourseDatesPage } from "@/pages/courses/CourseDatesPage";
import { AcademyPage } from "@/pages/AcademyPage";
import { ArtPage } from "@/pages/ArtPage";
import { LegalPage } from "@/pages/LegalPage";
import { SubscriptionStatusPage } from "@/pages/SubscriptionStatusPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";

/**
 * Root: content + cart providers wrap everything, so any page (and the header's
 * cart badge) can read them. One loader feeds the whole tree: every collection
 * the site reads is fetched once at build time and revalidated together in the
 * browser, so no page issues a request of its own.
 */
function Root() {
  return (
    <CartProvider>
      <ContentProvider>
        <Outlet />
      </ContentProvider>
    </CartProvider>
  );
}

/** Layout for every page of the new site. */
function ShellLayout() {
  return (
    <SiteShell>
      <Outlet />
    </SiteShell>
  );
}

/**
 * Method slugs to pre-render: the bundled five, plus any the CMS adds. Built
 * from both so a new method is a content change, not a code change.
 */
async function trainingPathSlugs(): Promise<string[]> {
  const rows = await fetchCollection("training-paths");
  const slugs = new Set(trainingPaths.map((path) => path.slug));
  for (const row of rows) {
    if (typeof row.slug === "string" && row.slug) slugs.add(row.slug);
  }
  return [...slugs];
}

/** Full paths for the two course templates (see the note on events/:slug). */
const coursePaths = async () =>
  (await trainingPathSlugs()).map((slug) => `courses/${slug}`);
const courseDatePaths = async () =>
  (await trainingPathSlugs()).map((slug) => `courses/${slug}/dates`);

/** Small helper so the scaffold stays readable. */
const placeholder = (props: Parameters<typeof PlaceholderPage>[0]) => (
  <PlaceholderPage {...props} />
);

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <Root />,
    loader: loadSiteContent,
    children: [
      {
        element: <ShellLayout />,
        children: [
          { index: true, element: <HomePage /> },

          // Double opt-in landings. Confirmation emails already in inboxes
          // point at these two paths — they never change.
          { path: "newsletter/confirmed", element: <SubscriptionStatusPage success /> },
          {
            path: "newsletter/error",
            element: <SubscriptionStatusPage success={false} />,
          },

          { path: "about", element: <AboutPage /> },
          { path: "events", element: <EventsPage /> },
          {
            path: "events/:slug",
            element: <EventDetailPage />,
            // Every published event gets its own pre-rendered HTML file. If the
            // CMS is unreachable at build time the list comes back empty and no
            // detail pages are emitted — the listing still builds, and the SPA
            // fallback serves the route client-side.
            //
            // These are FULL paths, not bare slugs: vite-react-ssg resolves a
            // returned path against the parent route's prefix, which is "" here,
            // so returning "my-event" writes dist/my-event.html at the root.
            getStaticPaths: async () => {
              const events = await fetchEvents();
              return events
                .filter((event): event is typeof event & { slug: string } =>
                  typeof event.slug === "string" && !!event.slug)
                .map((event) => `events/${event.slug}`);
            },
          },
          { path: "academy", element: <AcademyPage /> },
          { path: "academy/art", element: <ArtPage /> },
          { path: "academy/five-levels", element: <FiveLevelsPage /> },
          {
            path: "academy/therapists",
            element: placeholder({
              title: "Are You Looking For an A.R.T. Therapist?",
              eyebrow: "Global practitioner directory",
              intro: "Browse our directory to find practitioners near you.",
              phase: "F4",
              crumbs: [{ label: "Academy", href: "/academy" }, { label: "Find a therapist" }],
            }),
          },
          {
            path: "academy/publications",
            element: placeholder({
              title: "Educational Resources",
              eyebrow: "Publications",
              phase: "F3",
              crumbs: [{ label: "Academy", href: "/academy" }, { label: "Publications" }],
            }),
          },
          {
            path: "academy/akademie",
            element: placeholder({
              title: "Klinghardt Akademie",
              eyebrow: "Learning center",
              // The designer's notes mark the Akademie as separate work the
              // client is handling; it lands with the content load, not before.
              phase: "F9",
              crumbs: [{ label: "Academy", href: "/academy" }, { label: "Klinghardt Akademie" }],
            }),
          },
          { path: "courses", element: <CoursesPage /> },
          // One pre-rendered page per method, for both templates. The slugs
          // come from the same source the pages read, so a method added in the
          // CMS is built as soon as the next deploy runs.
          {
            path: "courses/:slug",
            element: <TrainingPathPage />,
            getStaticPaths: coursePaths,
          },
          {
            path: "courses/:slug/dates",
            element: <CourseDatesPage />,
            getStaticPaths: courseDatePaths,
          },
          {
            path: "store",
            element: placeholder({
              title: "Explore the Klinghardt Store",
              eyebrow: "Shop",
              intro:
                "Books, work materials, testing kits, scripts and other professional resources.",
              phase: "F6",
            }),
          },
          {
            path: "cart",
            element: placeholder({
              title: "Your Cart",
              eyebrow: "Checkout",
              phase: "F6",
            }),
          },
          { path: "music", element: <MusicPage /> },
          { path: "weekly-talks", element: <WeeklyTalksPage /> },
          { path: "foundation", element: <FoundationPage /> },
          { path: "contact", element: <ContactPage /> },
          { path: "privacy", element: <LegalPage type="privacy" /> },
          { path: "terms", element: <LegalPage type="terms" /> },

          // ── Sophia Health Institute (teal theme, route-driven) ────
          { path: "sophia", element: <SophiaPage /> },
          { path: "sophia/team", element: <SophiaTeamPage /> },
          { path: "sophia/new-patients", element: <NewPatientsPage /> },
          { path: "sophia/accommodations", element: <AccommodationsPage /> },
        ],
      },

      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
];
