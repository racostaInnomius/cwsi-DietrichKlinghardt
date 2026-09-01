import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLoaderData } from "react-router-dom";
import { demoContent, type ContentDoc } from "@/data/demo";
import { env } from "./env";
import {
  fetchCollection,
  fetchEvents,
  fetchMusicEmbeds,
  fetchPageContents,
  richText,
} from "./cms";

/**
 * Content store for the whole site: statically generated at build time by the
 * route loaders, then revalidated in the browser against the live CMS.
 *
 * Fallback rule (unchanged from the landing, now applied per collection): a
 * collection the CMS answers with rows replaces the local one; an empty or
 * failed answer keeps the bundled fallback, so a page never renders blank
 * because the CMS blinked.
 */

type ContentMap = Record<string, ContentDoc[]>;

export type LoaderContent = Partial<Record<string, ContentDoc[]>>;

const ContentContext = createContext<ContentMap>(demoContent);

/**
 * Loader shared by every route: one pass fetches every collection the site
 * reads, so a page never waits on its own request and the browser revalidates
 * everything in a single pass on navigation.
 *
 * Collections are fetched concurrently and each one degrades on its own — a
 * collection the tenant has no capability for simply comes back empty.
 *
 * `practitioners` and `training-paths` are deliberately NOT here. They are the
 * two collections big enough to matter (~120KB and ~12KB) and each is read by a
 * handful of pages, so they load from those routes instead — otherwise every
 * page of the site would ship a directory of third parties' contact details and
 * a full course curriculum it never renders.
 */
export async function loadSiteContent(): Promise<LoaderContent> {
  const [pages, events, faqs, board, products, videos, music, legal] =
    await Promise.all([
      fetchPageContents(),
      fetchEvents(),
      fetchCollection("faqs"),
      fetchCollection("board-members"),
      fetchCollection("digital-products"),
      fetchCollection("video-embeds", { scopeToSite: false }),
      fetchMusicEmbeds(),
      fetchCollection("legal-pages"),
    ]);
  return {
    "page-contents": pages,
    events,
    faqs,
    "board-members": board,
    "digital-products": products,
    "video-embeds": videos,
    "music-embeds": music,
    "legal-pages": legal,
  };
}

/**
 * CMS rows win field by field, but a page still inherits any field the CMS
 * leaves empty from its local fallback — that is what keeps a half-filled CMS
 * from stripping copy the design depends on.
 */
function mergePages(rows: ContentDoc[]): ContentDoc[] {
  const fallbacks = demoContent["page-contents"] ?? [];
  const merged = rows.map((row) => {
    const local = fallbacks.find((item) => item.slug === row.slug);
    return local ? { ...local, ...row } : row;
  });
  // Keep fallback-only pages (e.g. the announcement bar) that the CMS has no
  // row for yet, so the shell never loses its copy.
  const seen = new Set(merged.map((row) => row.slug));
  return [...merged, ...fallbacks.filter((row) => !seen.has(row.slug))];
}

function buildContent(
  loaded: LoaderContent,
  fallback: ContentMap = demoContent,
): ContentMap {
  const content: ContentMap = { ...fallback };
  for (const [name, rows] of Object.entries(loaded)) {
    if (!rows?.length) continue;
    content[name] = name === "page-contents" ? mergePages(rows) : rows;
  }
  return content;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const loader = useLoaderData() as LoaderContent | undefined;
  const initial = useMemo(() => buildContent(loader ?? {}), [loader]);
  const [content, setContent] = useState<ContentMap>(initial);

  const shouldRefresh =
    env.RUNTIME_CMS && Boolean(env.TENANT_ID) && Boolean(env.SITE_ID);

  useEffect(() => {
    if (!shouldRefresh) return;
    let active = true;
    void loadSiteContent().then((fresh) => {
      // A transient empty/failed collection keeps the last valid loader or
      // runtime result. Rebuilding from demoContent here used to erase events
      // that were already present in the statically rendered page.
      if (active) setContent((current) => buildContent(fresh, current));
    });
    return () => {
      active = false;
    };
  }, [shouldRefresh]);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

/** Every row of a collection, in CMS order. */
export function useCollection(name: string): ContentDoc[] {
  return useContext(ContentContext)[name] ?? [];
}

/** The `page-contents` row for a slug, e.g. "home" or "announcement". */
export function usePageContent(slug: string): ContentDoc | undefined {
  return useCollection("page-contents").find((item) => item.slug === slug);
}

/** Reads a field as text, flattening Lexical rich text when needed. */
export function text(doc: ContentDoc | undefined, key: string, fallback = ""): string {
  if (!doc) return fallback;
  const value = key === "bodyText" && doc.body != null ? doc.body : doc[key];
  if (typeof value === "string") return value || fallback;
  if (typeof value === "object" && value !== null) return richText(value) || fallback;
  return fallback;
}

/** Reads a numeric field (price, capacity) with a fallback. */
export function number(doc: ContentDoc | undefined, key: string, fallback = 0): number {
  const value = doc?.[key];
  return typeof value === "number" ? value : fallback;
}
