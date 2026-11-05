/**
 * The contact data a card carries in the CMS ("Más datos" → Subtítulo,
 * Teléfono, Liga), turned into links a reader can follow.
 *
 * Shared by the hotels on /sophia/accommodations and the cards on /contact,
 * so an address, a phone and a site read and behave the same in both.
 */

/** "comfortinn.com" or a full URL → a link the browser can follow. */
export function siteHref(site: string) {
  return /^https?:\/\//i.test(site) ? site : `https://${site}`;
}

/** The site as the reader should see it, without the scheme. */
export function siteLabel(site: string) {
  return site.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

/** Digits only — what a phone link needs, from what a reader should see. */
export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
