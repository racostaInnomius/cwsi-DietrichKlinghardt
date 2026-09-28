import { env } from "./env";
import { getAccessToken } from "@/features/auth/tokenStore";

export interface ArchiveListItem {
  id: string;
  source: "weekly_talk" | "archive_item";
  kind: "video" | "image" | "pdf" | "audio";
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
  const accessToken = getAccessToken();
  const response = await fetch(`${env.API_URL.replace(/\/$/, "")}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
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
