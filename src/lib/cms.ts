import type { ContentDoc } from "@/data/demo";
import { env } from "./env";

interface PayloadPage<T> {
  docs?: T[];
  totalPages?: number;
  hasNextPage?: boolean;
  nextPage?: number | null;
}

function relationshipId(value: unknown): string | undefined {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (!value || typeof value !== "object") return undefined;
  const id = (value as { id?: unknown }).id;
  return typeof id === "string" || typeof id === "number" ? String(id) : undefined;
}

async function fetchTenantMusic(): Promise<ContentDoc[]> {
  const rows: ContentDoc[] = [];
  let page = 1;
  while (true) {
    const params = new URLSearchParams({
      "where[tenant][equals]": env.TENANT_ID,
      "where[status][equals]": "active",
      depth: "0",
      limit: "100",
      page: String(page),
    });
    const response = await fetch(`${env.CMS_URL}/api/music-embeds?${params}`, {
      credentials: "omit",
    });
    if (!response.ok) return rows;
    const result = (await response.json()) as PayloadPage<ContentDoc>;
    rows.push(...(result.docs ?? []));
    if (!result.hasNextPage && page >= (result.totalPages ?? 1)) return rows;
    page = result.nextPage ?? page + 1;
  }
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
      if (!result.hasNextPage && page >= (result.totalPages ?? 1)) {
        const music = await fetchTenantMusic().catch(() => []);
        const musicById = new Map(
          music.map((item) => [relationshipId(item.id), item]),
        );
        return rows.map((row) => {
          const id = relationshipId(row.featuredMusic);
          return id && musicById.has(id)
            ? { ...row, featuredMusic: musicById.get(id) }
            : row;
        });
      }
      page = result.nextPage ?? page + 1;
    } catch {
      return rows;
    }
  }
}

interface LexicalNode {
  type?: string;
  text?: string;
  children?: unknown[];
}

function lexicalText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const item = node as LexicalNode;
  if (item.type === "linebreak") return "\n";
  if (typeof item.text === "string") return item.text;
  return item.children?.map(lexicalText).join("") ?? "";
}

export function richTextBlocks(doc: unknown): string[] {
  if (!doc || typeof doc !== "object") return [];
  const root = (doc as { root?: { children?: unknown[] } }).root;
  return root?.children?.map(lexicalText).map((value) => value.trim()).filter(Boolean) ?? [];
}

export function richText(doc: unknown): string {
  return richTextBlocks(doc).join("\n\n");
}

export function mediaUrl(media: unknown): string | undefined {
  if (!media || typeof media !== "object") return undefined;
  const url = (media as { url?: unknown }).url;
  if (typeof url !== "string" || !url) return undefined;
  return url.startsWith("http") ? url : `${env.CMS_URL}${url}`;
}

export type MusicEmbed = {
  title: string;
  artist?: string;
  caption?: string;
  kind: "track" | "playlist";
  embedUrl: string;
};

/** Defense in depth: public CMS data may only create SoundCloud iframes. */
export function musicEmbed(value: unknown): MusicEmbed | undefined {
  if (!value || typeof value !== "object") return undefined;
  const row = value as Record<string, unknown>;
  if (
    row.provider !== "soundcloud" ||
    row.status !== "active" ||
    (row.kind !== "track" && row.kind !== "playlist") ||
    typeof row.title !== "string" ||
    typeof row.embedUrl !== "string"
  ) {
    return undefined;
  }

  try {
    const url = new URL(row.embedUrl);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "w.soundcloud.com" ||
      url.pathname !== "/player/"
    ) {
      return undefined;
    }
  } catch {
    return undefined;
  }

  return {
    title: row.title,
    kind: row.kind,
    embedUrl: row.embedUrl,
    caption: typeof row.caption === "string" ? row.caption : undefined,
    artist: typeof row.artist === "string" ? row.artist : undefined,
  };
}
