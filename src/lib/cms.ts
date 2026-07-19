import type { ContentDoc } from "@/data/demo";
import { env } from "./env";

interface PayloadPage<T> {
  docs?: T[];
  totalPages?: number;
  hasNextPage?: boolean;
  nextPage?: number | null;
}

export async function fetchPageContents(): Promise<ContentDoc[]> {
  if (!env.TENANT_ID || !env.SITE_ID) return [];
  const rows: ContentDoc[] = [];
  let page = 1;

  while (true) {
    const params = new URLSearchParams({
      "where[tenant][equals]": env.TENANT_ID,
      "where[site][equals]": env.SITE_ID,
      depth: "2",
      limit: "100",
      page: String(page),
    });
    try {
      const response = await fetch(`${env.CMS_URL}/api/page-contents?${params}`, {
        credentials: "omit",
      });
      if (!response.ok) return rows;
      const result = (await response.json()) as PayloadPage<ContentDoc>;
      rows.push(...(result.docs ?? []));
      if (!result.hasNextPage && page >= (result.totalPages ?? 1)) return rows;
      page = result.nextPage ?? page + 1;
    } catch {
      return rows;
    }
  }
}

export function richText(doc: unknown): string {
  if (!doc || typeof doc !== "object") return "";
  const root = (doc as { root?: { children?: unknown[] } }).root;
  const walk = (node: unknown): string => {
    if (!node || typeof node !== "object") return "";
    const item = node as { text?: string; children?: unknown[] };
    if (typeof item.text === "string") return item.text;
    return item.children?.map(walk).join("") ?? "";
  };
  return root?.children?.map(walk).filter(Boolean).join("\n\n") ?? "";
}

export function mediaUrl(media: unknown): string | undefined {
  if (!media || typeof media !== "object") return undefined;
  const url = (media as { url?: unknown }).url;
  if (typeof url !== "string" || !url) return undefined;
  return url.startsWith("http") ? url : `${env.CMS_URL}${url}`;
}
