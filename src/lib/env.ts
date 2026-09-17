const value = (key: string, fallback = "") =>
  (import.meta.env[key] as string | undefined)?.trim() || fallback;

export const env = {
  SITE_URL: value("VITE_PUBLIC_SITE_URL", "http://localhost:4325"),
  /**
   * The domain the CMS knows this site by — NOT where this build is served.
   * While the definitive site previews on dkk.beytrax.com, the `sites` row
   * still says dietrich-klinghardt.com (the old landing lives there), and
   * `/api/public/site-context` resolves by that domain. Defaults to the served
   * host, which is right once the two become the same.
   */
  CMS_SITE_DOMAIN: value("VITE_PUBLIC_CMS_SITE_DOMAIN"),
  /**
   * Whether this deployment may be indexed. False on the preview subdomain:
   * the real domain serves a different site today, so letting search engines
   * in would create a duplicate and a canonical pointing at other content.
   */
  INDEXABLE: value("VITE_PUBLIC_INDEXABLE", "false") === "true",
  API_URL: value("VITE_PUBLIC_API_URL", "http://localhost:3500"),
  CMS_URL: value("VITE_PUBLIC_CMS_URL", "http://localhost:3000"),
  TENANT_ID: value("VITE_PUBLIC_TENANT_ID"),
  SITE_ID: value("VITE_PUBLIC_SITE_ID"),
  RUNTIME_CMS: value("VITE_PUBLIC_ENABLE_RUNTIME_CMS", "true") === "true",
  // Beytrax's PLATFORM publishable key, not the tenant's: donations are taken
  // by the platform and attributed to the tenant with `on_behalf_of`.
  STRIPE_KEY: value("VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
  CONTACT_URL: value("VITE_PUBLIC_CONTACT_URL", "#newsletter"),
  VIMEO_URL: value("VITE_PUBLIC_VIMEO_URL", "#newsletter"),
  INSTAGRAM_URL: value("VITE_PUBLIC_INSTAGRAM_URL", "#newsletter"),
  // No profile yet — placeholders until the client shares the real links.
  FACEBOOK_URL: value("VITE_PUBLIC_FACEBOOK_URL", "#newsletter"),
  TELEGRAM_URL: value("VITE_PUBLIC_TELEGRAM_URL", "#newsletter"),
  // The client's own MapTiler style (custom navy/white colors) for the
  // practitioner directory map — see PractitionerMap.tsx. The key inside
  // this URL is a client-side map key (ships in every page load, not a
  // server secret), scoped to this style.
  MAPTILER_STYLE_URL: value("VITE_PUBLIC_MAPTILER_STYLE_URL"),
};
