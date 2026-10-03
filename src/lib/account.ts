import { authedFetch } from "./auth";
import { env } from "./env";
import type { MembershipStatus } from "./membership";

export interface AccountPurchase {
  id: string;
  kind: "product" | "event";
  title: string;
  amountCents: number | null;
  currency: string | null;
  paymentStatus: "paid" | "failed";
  emailStatus: "sent" | "pending" | "failed";
  purchasedAt: string;
}

export interface AccountDonation {
  id: string;
  amountCents: number;
  currency: string;
  frequency: "one-time" | "monthly" | string;
  status: string;
  createdAt: string;
}

export interface AccountBooking {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  status: "held" | "confirmed" | "cancelled" | "expired";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  amountCents: number | null;
  currency: string | null;
  createdAt: string;
}

export interface AccountOverview {
  membership: MembershipStatus;
  purchases: AccountPurchase[];
  donations: AccountDonation[];
  bookings: AccountBooking[];
}

export async function fetchAccountOverview(): Promise<AccountOverview> {
  const response = await authedFetch("/api/account/overview", {
    method: "POST",
    body: JSON.stringify({ tenantId: env.TENANT_ID, siteId: env.SITE_ID }),
  });
  const body = (await response.json().catch(() => null)) as {
    data?: AccountOverview;
    error?: string;
  } | null;
  if (!response.ok || !body?.data) {
    throw new Error(body?.error || "We could not load your account activity.");
  }
  return body.data;
}
