/**
 * Checkout link validation.
 *
 * Every purchase link on this site comes from the CMS — there are no hardcoded
 * fallbacks, by design. A sibling tenant (Iconic, July 2026) shipped hardcoded
 * `buy.stripe.com/test_…` fallbacks; when a CMS field went blank the site
 * quietly sent real buyers to Stripe Sandbox, where payments succeed, no money
 * moves and no fulfillment email is sent. Nobody noticed for weeks.
 *
 * So: a missing link renders no button (the page says registration is not open
 * yet), and a Sandbox link is treated as missing outside development, where it
 * would be indistinguishable from a working one.
 *
 * TEMPORARY EXCEPTION (client, 2026-10-05): dkk.beytrax.com is the site's
 * staging domain while the owner reviews it — client-facing demos happen
 * here before the real cutover to dietrich-klinghardt.com, and need a working
 * "Book now"/"Buy" click-through without DKK's live Stripe key existing yet.
 * Sandbox links are allowed ONLY on this exact hostname. This must be removed
 * — delete STAGING_HOSTNAME_TEST_LINKS_ALLOWED and its one use below — once
 * the site moves to dietrich-klinghardt.com, or the same gap Iconic hit
 * reopens on the real domain.
 */

const LIVE_HOSTS = new Set(["buy.stripe.com", "checkout.stripe.com"]);
const STAGING_HOSTNAME_TEST_LINKS_ALLOWED = "dkk.beytrax.com";

export function checkoutHref(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;

  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return undefined;
  }
  if (url.protocol !== "https:") return undefined;

  // Stripe Sandbox links carry a `test_` path segment. Allowed while developing
  // so the flow can be exercised, or on the temporary staging domain above;
  // never served on the real production domain.
  const onStagingDomain =
    typeof window !== "undefined" &&
    window.location.hostname === STAGING_HOSTNAME_TEST_LINKS_ALLOWED;
  if (
    LIVE_HOSTS.has(url.hostname) &&
    url.pathname.split("/").some((part) => part.startsWith("test_")) &&
    import.meta.env.PROD &&
    !onStagingDomain
  ) {
    return undefined;
  }

  return url.toString();
}
