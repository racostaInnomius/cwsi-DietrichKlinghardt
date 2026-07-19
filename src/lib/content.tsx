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
  const initial = useMemo(() => {
    const loaded = loader?.pages ?? [];
    return loaded.length
      ? { ...demoContent, "page-contents": mergePages(loaded) }
      : demoContent;
  }, [loader]);
  const [content, setContent] = useState<ContentMap>(initial);

  useEffect(() => {
    if (!env.RUNTIME_CMS || !env.TENANT_ID || !env.SITE_ID) return;
    let active = true;
    void fetchPageContents().then((rows) => {
      if (active && rows.length) {
        setContent((current) => ({ ...current, "page-contents": mergePages(rows) }));
      }
    });
    return () => { active = false; };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
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
