import { Navigate, Outlet } from "react-router-dom";
import type { RouteRecord } from "vite-react-ssg";
import { ContentProvider } from "@/lib/content";
import { fetchPageContents } from "@/lib/cms";
import { LandingPage } from "@/pages/LandingPage";
import { SubscriptionStatusPage } from "@/pages/SubscriptionStatusPage";

async function loadContent() { return { pages: await fetchPageContents() }; }
function Root() { return <ContentProvider><Outlet /></ContentProvider>; }

export const routes: RouteRecord[] = [{
  path: "/",
  element: <Root />,
  loader: loadContent,
  children: [
    { index: true, element: <LandingPage /> },
    { path: "newsletter/confirmed", element: <SubscriptionStatusPage success /> },
    { path: "newsletter/error", element: <SubscriptionStatusPage success={false} /> },
    { path: "*", element: <Navigate to="/" replace /> },
  ],
}];
