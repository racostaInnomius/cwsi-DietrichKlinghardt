import { Navigate, Outlet } from "react-router-dom";
import type { RouteRecord } from "vite-react-ssg";
import { ContentProvider } from "@/lib/content";
import { CartProvider } from "@/lib/cart";
import { fetchPageContents } from "@/lib/cms";
import { SiteShell } from "@/components/shell/SiteShell";
import { LandingPage } from "@/pages/LandingPage";
import { SubscriptionStatusPage } from "@/pages/SubscriptionStatusPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";

async function loadContent() {
  return { pages: await fetchPageContents() };
}

/**
 * Root: content + cart providers wrap everything, so any page (and the header's
 * cart badge) can read them.
 *
 * Two shells coexist on purpose during F1. `/` and the newsletter status pages
 * are the *live* temporary landing — they keep their own minimal chrome and are
 * not touched, because they are in production collecting double opt-in signups.
 * Every new route renders inside `SiteShell`, the designed frame. F2 moves the
 * home page into the shell and the landing retires.
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
    loader: loadContent,
    children: [
      // ── Live temporary landing (untouched until F2) ──────────────
      { index: true, element: <LandingPage /> },
      { path: "newsletter/confirmed", element: <SubscriptionStatusPage success /> },
      { path: "newsletter/error", element: <SubscriptionStatusPage success={false} /> },

      // ── The designed site ────────────────────────────────────────
      {
        element: <ShellLayout />,
        children: [
          {
            path: "about",
            element: placeholder({
              title: "Dr. Dietrich Klinghardt",
              eyebrow: "About",
              intro:
                "Physician, educator, author and internationally recognized voice in biological and integrative medicine.",
              phase: "F2",
            }),
          },
          {
            path: "events",
            element: placeholder({
              title: "Learn Directly from Dr. Klinghardt",
              eyebrow: "Events & webinars",
              intro:
                "Browse upcoming workshops, webinars and live sessions with Dr. Dietrich Klinghardt.",
              phase: "F2",
            }),
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
          {
            path: "academy/five-levels",
            element: placeholder({
              title: "The 5 Levels of Healing",
              eyebrow: "A framework for wholeness",
              phase: "F2",
              crumbs: [{ label: "Academy", href: "/academy" }, { label: "The 5 Levels of Healing" }],
            }),
          },
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
          {
            path: "music",
            element: placeholder({
              title: "Music as Medicine",
              eyebrow: "Sound and healing",
              phase: "F2",
            }),
          },
          {
            path: "weekly-talks",
            element: placeholder({
              title: "Join My Weekly Talks",
              eyebrow: "Exclusive membership",
              intro: "Live answers, every week, directly from Dr. Klinghardt.",
              phase: "F7",
            }),
          },
          {
            path: "foundation",
            element: placeholder({
              title: "Preserving Knowledge. Advancing Education.",
              eyebrow: "Klinghardt Foundation",
              phase: "F5",
            }),
          },
          {
            path: "contact",
            element: placeholder({
              title: "Contact Us",
              eyebrow: "Get in touch",
              phase: "F2",
            }),
          },
          {
            path: "privacy",
            element: placeholder({ title: "Privacy Policy", phase: "F2" }),
          },
          {
            path: "terms",
            element: placeholder({ title: "Terms of Service", phase: "F2" }),
          },

          // ── Sophia Health Institute (teal theme, route-driven) ────
          {
            path: "sophia",
            element: placeholder({
              title: "Sophia Health Institute",
              eyebrow: "By Dr. Klinghardt",
              intro:
                "A world-renowned healing center dedicated to restoring health on every level.",
              phase: "F2",
            }),
          },
          {
            path: "sophia/team",
            element: placeholder({
              title: "Meet Our Team",
              eyebrow: "Sophia Health Institute",
              phase: "F2",
              crumbs: [{ label: "Sophia", href: "/sophia" }, { label: "Our team" }],
            }),
          },
          {
            path: "sophia/new-patients",
            element: placeholder({
              title: "New Patient Information",
              eyebrow: "Sophia Health Institute",
              phase: "F2",
              crumbs: [{ label: "Sophia", href: "/sophia" }, { label: "New patients" }],
            }),
          },
          {
            path: "sophia/accommodations",
            element: placeholder({
              title: "How to Find Us",
              eyebrow: "Travel & accommodations",
              phase: "F2",
              crumbs: [{ label: "Sophia", href: "/sophia" }, { label: "Travel & accommodations" }],
            }),
          },
        ],
      },

      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
];
