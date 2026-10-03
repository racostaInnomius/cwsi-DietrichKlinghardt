import { env } from "./env";
import { authedFetch } from "./auth";

export interface MembershipStatus {
  active: boolean;
  status?: string;
  planKey?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
  createdAt?: string | null;
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

/** Starts a Stripe Checkout subscription for the given membership plan, then redirects. */
export async function startMembershipCheckout(planId: string, returnPath = "/weekly-talks"): Promise<void> {
  const res = await authedFetch("/api/memberships/create-checkout-session", {
    method: "POST",
    body: JSON.stringify({ tenantId: env.TENANT_ID, siteId: env.SITE_ID, planId, returnPath }),
  });
  const json = (await res.json().catch(() => null)) as { data?: { url: string }; error?: string } | null;
  if (!res.ok || !json?.data?.url) {
    throw new Error(json?.error || "We could not start the checkout.");
  }
  window.location.href = json.data.url;
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
