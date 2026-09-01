import type { ContentDoc } from "@/data/demo";
import { env } from "./env";

interface PayloadPage<T> {
  docs?: T[];
  totalPages?: number;
  hasNextPage?: boolean;
  nextPage?: number | null;
}

/**
 * Browser requests in local development go through Vite's same-origin proxy;
 * Payload's production CORS allow-list deliberately does not include arbitrary
 * localhost ports. Builds and deployed browsers continue to use the CMS URL.
 */
function cmsBaseUrl(): string {
  return import.meta.env.DEV && typeof window !== "undefined" ? "/__cms" : env.CMS_URL;
}

function relationshipId(value: unknown): string | undefined {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (!value || typeof value !== "object") return undefined;
  const id = (value as { id?: unknown }).id;
  return typeof id === "string" || typeof id === "number" ? String(id) : undefined;
}

/**
 * Reads any tenant-scoped collection in pages of 100 and concatenates every
 * row. Site-scoped collections take `site` too; the caller decides, because a
 * few collections (music-embeds) are tenant-wide rather than per-site.
 *
 * Never throws: a CMS hiccup must degrade to the local fallback content, not
 * blank a statically generated page.
 */
export async function fetchCollection<T extends ContentDoc>(
  collection: string,
  {
    scopeToSite = true,
    depth = 2,
    where = {},
  }: {
    scopeToSite?: boolean;
    /** Relationship expansion. 0 where nothing needs expanding. */
    depth?: number;
    where?: Record<string, string>;
  } = {},
): Promise<T[]> {
  if (!env.TENANT_ID) return [];
  if (scopeToSite && !env.SITE_ID) return [];

  const rows: T[] = [];
  let page = 1;
  while (true) {
    const params = new URLSearchParams({
      "where[tenant][equals]": env.TENANT_ID,
      depth: String(depth),
      limit: "100",
      page: String(page),
      ...where,
    });
    if (scopeToSite) params.set("where[site][equals]", env.SITE_ID);

    try {
      const response = await fetch(`${cmsBaseUrl()}/api/${collection}?${params}`, {
        credentials: "omit",
      });
      if (!response.ok) return rows;
      const result = (await response.json()) as PayloadPage<T>;
      rows.push(...(result.docs ?? []));
      if (!result.hasNextPage && page >= (result.totalPages ?? 1)) return rows;
      page = result.nextPage ?? page + 1;
    } catch {
      return rows;
    }
  }
}

/** Public events — the CMS exposes both published and sold-out dates. */
export async function fetchEvents(): Promise<ContentDoc[]> {
  return fetchCollection("events", {
    where: { "where[status][in]": "published,sold_out" },
  });
}

/**
 * Music embeds are tenant-wide, not per-site: one library of tracks shared by
 * every site the tenant owns. Only active rows are published.
 */
export async function fetchMusicEmbeds(): Promise<ContentDoc[]> {
  return fetchCollection("music-embeds", {
    scopeToSite: false,
    depth: 0,
    where: { "where[status][equals]": "active" },
  });
}

export async function fetchPageContents(): Promise<ContentDoc[]> {
  const [rows, music] = await Promise.all([
    fetchCollection("page-contents"),
    fetchMusicEmbeds(),
  ]);

  // `featuredMusic` points at the tenant-wide library, which a site-scoped
  // query cannot expand — so the relationship is resolved here by id.
  const musicById = new Map(music.map((item) => [relationshipId(item.id), item]));
  return rows.map((row) => {
    const id = relationshipId(row.featuredMusic);
    return id && musicById.has(id)
      ? { ...row, featuredMusic: musicById.get(id) }
      : row;
  });
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
  return url.startsWith("http") ? url : `${cmsBaseUrl()}${url}`;
}

/**
 * Any URL that comes from the CMS and ends up in an `href`. Blocks
 * `javascript:` and every other scheme an editor could paste in.
 */
export function externalUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

/** Google Maps embed URLs only — the one iframe host the design asks for. */
export function mapEmbedUrl(value: unknown): string | undefined {
  const href = externalUrl(value);
  if (!href) return undefined;
  const { hostname, pathname, protocol } = new URL(href);
  const isGoogleMaps =
    (hostname === "www.google.com" || hostname === "maps.google.com") &&
    pathname.startsWith("/maps/embed");
  return protocol === "https:" && isGoogleMaps ? href : undefined;
}

export type VideoEmbed = {
  title: string;
  caption?: string;
  embedUrl: string;
  aspectRatio: string;
};

/**
 * Same defence as `musicEmbed`: public CMS data may only produce an iframe
 * pointing at an allow-listed video host.
 *
 * Mux rows are deliberately not handled here. Mux playback is signed — the
 * player needs a token minted by the API — so rendering one from an `embedUrl`
 * is not possible, and guessing would put a broken frame on the page.
 */
const VIDEO_HOSTS = new Set([
  "www.youtube.com",
  "www.youtube-nocookie.com",
  "player.vimeo.com",
  "www.loom.com",
]);

export function videoEmbed(value: unknown): VideoEmbed | undefined {
  if (!value || typeof value !== "object") return undefined;
  const row = value as Record<string, unknown>;
  if (
    row.status !== "active" ||
    typeof row.title !== "string" ||
    typeof row.embedUrl !== "string"
  ) {
    return undefined;
  }

  try {
    const url = new URL(row.embedUrl);
    if (url.protocol !== "https:" || !VIDEO_HOSTS.has(url.hostname)) return undefined;
  } catch {
    return undefined;
  }

  return {
    title: row.title,
    embedUrl: row.embedUrl,
    caption: typeof row.caption === "string" ? row.caption : undefined,
    aspectRatio: row.aspectRatio === "9:16" || row.aspectRatio === "1:1"
      ? row.aspectRatio
      : "16:9",
  };
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
