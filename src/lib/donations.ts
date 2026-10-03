import { useEffect, useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { env } from "./env";
import { authedFetch } from "./auth";

/**
 * Donation plumbing for the Foundation page.
 *
 * Beytrax is the merchant of record's platform: the charge is created on the
 * platform account and attributed to the Foundation's connected account via
 * `on_behalf_of`, so the Foundation's name is what appears on the donor's
 * statement. The account id must be passed to Stripe Elements as `onBehalfOf`
 * AND set on the PaymentIntent by the API — if the two disagree Stripe rejects
 * the confirmation outright.
 */

let stripePromise: Promise<Stripe | null> | null = null;

/** Loaded once, lazily, and only in the browser. */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    if (!env.STRIPE_KEY) return Promise.resolve(null);
    stripePromise = loadStripe(env.STRIPE_KEY);
  }
  return stripePromise;
}

export interface SiteContext {
  tenantId: string;
  siteId: string;
  siteName: string;
  /**
   * The Foundation's Stripe account, or null. The API returns null both when
   * no account exists and when it cannot yet accept charges — either way
   * donations are closed, because `create-intent` refuses both cases with 409.
   */
  connectedAccountId: string | null;
}

type Status = "loading" | "ready" | "unavailable";

/**
 * Resolves the tenant/site and whether donations can actually be taken.
 *
 * Runs in the browser only: the answer depends on the Foundation's Stripe
 * onboarding state, which changes without a rebuild, so baking it into the
 * static page would eventually be a lie.
 */
export function useDonationContext(): {
  status: Status;
  context: SiteContext | null;
} {
  const [status, setStatus] = useState<Status>("loading");
  const [context, setContext] = useState<SiteContext | null>(null);

  useEffect(() => {
    let active = true;
    // The CMS knows this site by its own domain, which is not necessarily
    // where this build is served from (see env.CMS_SITE_DOMAIN).
    const domain =
      env.CMS_SITE_DOMAIN ||
      (() => {
        try {
          return new URL(env.SITE_URL).host;
        } catch {
          return "";
        }
      })();

    // No publishable key means Elements cannot mount at all, so the answer is
    // the same as an un-onboarded Foundation: donations are closed. Checked
    // before the request so a missing key can never produce a form that looks
    // usable and fails at the last step.
    if (!env.STRIPE_KEY) {
      setStatus("unavailable");
      return;
    }

    void (async () => {
      try {
        const response = await fetch(
          `${env.API_URL}/api/public/site-context?domain=${encodeURIComponent(domain)}`,
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const body = (await response.json()) as { data?: SiteContext };
        if (!active) return;
        if (body.data?.connectedAccountId) {
          setContext(body.data);
          setStatus("ready");
        } else {
          // Resolved fine, but the Foundation cannot accept charges yet.
          setContext(body.data ?? null);
          setStatus("unavailable");
        }
      } catch {
        if (active) setStatus("unavailable");
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { status, context };
}

export interface DonationIntent {
  clientSecret: string;
  frequency: "one-time" | "monthly";
}

export async function createDonationIntent(input: {
  tenantId: string;
  siteId: string;
  amount: number;
  frequency: "one-time" | "monthly";
  name: string;
  email: string;
}): Promise<DonationIntent> {
  // authedFetch remains anonymous when there is no token, but when a signed-in
  // donor gives it lets the API attach user_id so the gift appears in Account.
  const response = await authedFetch("/api/donations/create-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currency: "USD", ...input }),
  });
  const body = (await response.json().catch(() => null)) as {
    data?: DonationIntent;
    error?: string | { message?: string };
  } | null;

  if (!response.ok || !body?.data?.clientSecret) {
    const detail =
      typeof body?.error === "string" ? body.error : body?.error?.message;
    throw new Error(detail || "We could not start the donation. Please try again.");
  }
  return body.data;
}

export const PRESET_AMOUNTS = [50, 100, 250, 500, 1000] as const;
