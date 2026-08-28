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
 */

const LIVE_HOSTS = new Set(["buy.stripe.com", "checkout.stripe.com"]);

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
  // so the flow can be exercised; never served to the public build.
  if (
    LIVE_HOSTS.has(url.hostname) &&
    url.pathname.split("/").some((part) => part.startsWith("test_")) &&
    import.meta.env.PROD
  ) {
    return undefined;
  }

  return url.toString();
}
