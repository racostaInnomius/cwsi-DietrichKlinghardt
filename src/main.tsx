import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes";
import "./index.css";

/**
 * vite-react-ssg swaps our route loaders for one of its own that fetches the
 * loader data it wrote at build time and calls `.json()` on the answer without
 * checking it. Those files carry the build's hash in their name, and a deploy
 * removes the previous build's copies, so a tab left open across a deploy — or
 * a browser serving a cached document — asks for a file that is no longer
 * there. The server answers with the 404 page, parsing "<!DOCTYPE" throws
 * inside the root loader, and React Router replaces the whole site with
 * "Unexpected Application Error! Unexpected token '<'". A deploy that leaves
 * those files unreadable (Plesk hands them 640) does the same to every visitor
 * at once, and because the fault is in the library every site built this way
 * has it.
 *
 * So when one of those requests does not come back as JSON, the router gets an
 * empty answer instead of an HTML page. An empty manifest is a case the
 * library already handles: it reports no static data for the route, the page
 * hydrates, and the content fills in from the live API, which it refreshes on
 * every page load anyway (lib/content.tsx). No other request is touched.
 */
if (typeof window !== "undefined") {
  const original = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const response = await original(input, init);
    const url =
      typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (!url.includes("static-loader-data")) return response;
    if (response.ok && (response.headers.get("content-type") ?? "").includes("json")) {
      return response;
    }
    return new Response("{}", {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
}

export const createRoot = ViteReactSSG({ routes });
