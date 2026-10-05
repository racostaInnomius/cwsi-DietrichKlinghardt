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
 * Sandbox links are allowed ONLY when built for this exact site URL — read
 * from VITE_PUBLIC_SITE_URL (baked in at build time, same value on the server
 * prerender and the client, so there's nothing for hydration to disagree on)
 * rather than `window.location`, which this page's component tree never
 * actually recomputes after hydration (a separate, pre-existing issue this
 * sidesteps rather than fixes). This exception must be removed — delete
 * STAGING_HOSTNAME_TEST_LINKS_ALLOWED and its one use below — once the site
 * moves to dietrich-klinghardt.com, or the same gap Iconic hit reopens on the
 * real domain.
 */

const LIVE_HOSTS = new Set(["buy.stripe.com", "checkout.stripe.com"]);
const STAGING_HOSTNAME_TEST_LINKS_ALLOWED = "dkk.beytrax.com";

function builtForStagingDomain(): boolean {
  try {
    return (
      new URL(import.meta.env.VITE_PUBLIC_SITE_URL ?? "").hostname ===
      STAGING_HOSTNAME_TEST_LINKS_ALLOWED
    );
  } catch {
    return false;
  }
}

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
  // so the flow can be exercised, or on the temporary staging build above;
  // never served on the real production domain.
  if (
    LIVE_HOSTS.has(url.hostname) &&
    url.pathname.split("/").some((part) => part.startsWith("test_")) &&
    import.meta.env.PROD &&
    !builtForStagingDomain()
  ) {
    return undefined;
  }

  return url.toString();
}
