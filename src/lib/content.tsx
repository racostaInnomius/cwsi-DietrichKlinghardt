import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import { Brand } from "@/components/Brand";
import { demoContent, type ContentDoc } from "@/data/demo";
import { env } from "./env";
import { fetchPageContents, richText } from "./cms";

type ContentMap = Record<string, ContentDoc[]>;
const ContentContext = createContext<ContentMap>(demoContent);

function mergePages(rows: ContentDoc[]): ContentDoc[] {
  const fallbacks = demoContent["page-contents"] ?? [];
  return rows.map((row) => {
    const local = fallbacks.find((item) => item.slug === row.slug);
    return local ? { ...local, ...row } : row;
  });
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const loader = useLoaderData() as { pages?: ContentDoc[] } | undefined;
  const { pathname } = useLocation();
  const initial = useMemo(() => {
    const loaded = loader?.pages ?? [];
    return loaded.length
      ? { ...demoContent, "page-contents": mergePages(loaded) }
      : demoContent;
  }, [loader]);
  const [content, setContent] = useState<ContentMap>(initial);
  const shouldRefresh = pathname === "/" && env.RUNTIME_CMS && Boolean(env.TENANT_ID) && Boolean(env.SITE_ID);
  const [refreshing, setRefreshing] = useState(shouldRefresh);

  useEffect(() => {
    if (!shouldRefresh) return;
    let active = true;
    const minimumDisplay = new Promise<void>((resolve) => window.setTimeout(resolve, 250));
    void Promise.all([fetchPageContents(), minimumDisplay])
      .then(([rows]) => {
        if (active && rows.length) {
          setContent((current) => ({ ...current, "page-contents": mergePages(rows) }));
        }
      })
      .finally(() => {
        if (active) setRefreshing(false);
      });
    return () => { active = false; };
  }, [shouldRefresh]);

  return (
    <ContentContext.Provider value={content}>
      {children}
      {refreshing && (
        <div className="cms-refresh" role="status" aria-live="polite" aria-label="Loading latest content">
          <Brand />
          <span className="cms-refresh-line" aria-hidden="true" />
          <span className="sr-only">Loading latest content…</span>
        </div>
      )}
    </ContentContext.Provider>
  );
}

export function usePageContent(slug: string) {
  return useContext(ContentContext)["page-contents"]?.find((item) => item.slug === slug);
}

export function text(doc: ContentDoc | undefined, key: string, fallback = "") {
  if (!doc) return fallback;
  const value = key === "bodyText" && doc.body != null ? doc.body : doc[key];
  if (typeof value === "string") return value;
  if (typeof value === "object") return richText(value) || fallback;
  return fallback;
}
