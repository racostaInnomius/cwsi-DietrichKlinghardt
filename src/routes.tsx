import { Navigate, Outlet } from "react-router-dom";
import type { RouteRecord } from "vite-react-ssg";
import { ContentProvider, loadSiteContent } from "@/lib/content";
import { CartProvider } from "@/lib/cart";
import { fetchEvents } from "@/lib/cms";
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
            getStaticPaths: async () => {
              const events = await fetchEvents();
              return events
                .map((event) => event.slug)
                .filter((slug): slug is string => typeof slug === "string" && !!slug);
            },
          },
          {
            path: "academy",
            element: placeholder({
              title: "Dr. Klinghardt Academy",
              eyebrow: "Learning center",
              phase: "F2",
            }),
          },
          {
            path: "academy/art",
            element: placeholder({
              title: "A.R.T. Klinghardt",
              eyebrow: "Signature method",
              phase: "F2",
              crumbs: [{ label: "Academy", href: "/academy" }, { label: "A.R.T. Klinghardt" }],
            }),
          },
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
              phase: "F2",
              crumbs: [{ label: "Academy", href: "/academy" }, { label: "Publications" }],
            }),
          },
          {
            path: "academy/akademie",
            element: placeholder({
              title: "Klinghardt Akademie",
              eyebrow: "Learning center",
              phase: "F2",
              crumbs: [{ label: "Academy", href: "/academy" }, { label: "Klinghardt Akademie" }],
            }),
          },
          {
            path: "courses",
            element: placeholder({
              title: "Online Courses",
              eyebrow: "Training paths",
              phase: "F3",
            }),
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
