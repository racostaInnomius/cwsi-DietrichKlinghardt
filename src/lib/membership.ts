import { env } from "./env";
import { authedFetch } from "./auth";

export interface MembershipStatus {
  active: boolean;
  status?: string;
  planKey?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
}

/** /account's own read of "am I a member here" — no Stripe call, just the DB row. */
export async function fetchMembershipStatus(): Promise<MembershipStatus> {
  const res = await authedFetch("/api/memberships/status", {
    method: "POST",
    body: JSON.stringify({ tenantId: env.TENANT_ID, siteId: env.SITE_ID }),
  });
  if (!res.ok) throw new Error("We could not check your membership status.");
  const json = (await res.json()) as { data: MembershipStatus };
  return json.data;
}

/** Redirects the browser to Stripe's Billing Portal for this member's subscription. */
export async function openMembershipPortal(): Promise<void> {
  const res = await authedFetch("/api/memberships/create-portal-session", {
    method: "POST",
    body: JSON.stringify({
      tenantId: env.TENANT_ID,
      siteId: env.SITE_ID,
      returnPath: "/account",
    }),
  });
  const json = (await res.json().catch(() => null)) as { data?: { url: string }; error?: string } | null;
  if (!res.ok || !json?.data?.url) {
    throw new Error(json?.error || "We could not open the membership portal.");
  }
  window.location.href = json.data.url;
}
