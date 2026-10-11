import { env } from "./env";
import { authedFetch } from "./auth";

/** The six collections the Archives page presents (CMS `collection`). */
export const ARCHIVE_COLLECTIONS = [
  "recordings",
  "letters",
  "diagrams",
  "lectures",
  "videos",
  "seminars",
] as const;
export type ArchiveCollection = (typeof ARCHIVE_COLLECTIONS)[number];

export interface ArchiveListItem {
  id: string;
  source: "weekly_talk" | "archive_item";
  kind: "video" | "image" | "pdf" | "audio";
  collection: ArchiveCollection;
  title: string;
  description: string | null;
  addedAt: string;
}

export class ArchivesError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly requiresLogin: boolean = false,
  ) {
    super(message);
    this.name = "ArchivesError";
  }
}

async function postArchives<T>(path: string, body: Record<string, unknown>): Promise<T> {
  // Refreshes an expired bearer token once before deciding the visitor is not
  // a member; without this, a still-signed-in member could see a false lock.
  const response = await authedFetch(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const result = (await response.json().catch(() => null)) as {
    data?: T;
    error?: { code?: string; message?: string; requiresLogin?: boolean };
  } | null;
  if (!response.ok) {
    throw new ArchivesError(
      result?.error?.message || "We could not load the Archives.",
      result?.error?.code || "archives_failed",
      result?.error?.requiresLogin ?? false,
    );
  }
  if (!result?.data) throw new ArchivesError("The Archives response was incomplete.", "invalid_response");
  return result.data;
}

export function fetchArchivesList(): Promise<{ items: ArchiveListItem[] }> {
  return postArchives("/api/public/archives/list", {
    tenantId: env.TENANT_ID,
    siteId: env.SITE_ID,
  });
}

export function fetchArchiveAccess(args: {
  source: ArchiveListItem["source"];
  id: string;
  download?: boolean;
}): Promise<{ url: string; expiresAt: string; kind: ArchiveListItem["kind"] }> {
  return postArchives("/api/public/archives/access", {
    tenantId: env.TENANT_ID,
    siteId: env.SITE_ID,
    source: args.source,
    id: args.id,
    ...(args.download ? { download: true } : {}),
  });
}

/**
 * How many pieces each collection holds. Public — no sign-in — so every
 * visitor sees which collections are open; counts only, never content.
 * Null when the API can't answer (the page then shows every collection as
 * "Coming soon", which is never wrong for a visitor).
 */
export async function fetchArchivesSummary(): Promise<Record<ArchiveCollection, number> | null> {
  try {
    const response = await fetch(`${env.API_URL}/api/public/archives/summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId: env.TENANT_ID, siteId: env.SITE_ID }),
    });
    if (!response.ok) return null;
    const result = (await response.json()) as { data?: { collections?: Record<ArchiveCollection, number> } };
    return result.data?.collections ?? null;
  } catch {
    return null;
  }
}
