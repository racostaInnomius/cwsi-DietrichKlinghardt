import type { ContentDoc } from "@/data/demo";

/**
 * Display helpers shared by the events, courses and store views.
 *
 * Dates are rendered in the event's own timezone when it declares one — a
 * webinar listed "10:00 AM EST" must read the same for every visitor, not shift
 * to whatever timezone the browser happens to be in.
 */

function tzOf(doc: ContentDoc | undefined): string | undefined {
  const tz = doc?.timezone;
  return typeof tz === "string" && tz ? tz : undefined;
}

function dateOf(doc: ContentDoc | undefined): Date | null {
  const raw = doc?.startDateTime ?? doc?.date;
  if (typeof raw !== "string" || !raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** "06" / "Sept" — the stacked date block used in the listings. */
export function eventDateParts(doc: ContentDoc | undefined): { day: string; month: string } {
  const date = dateOf(doc);
  if (!date) return { day: "—", month: "" };
  const timeZone = tzOf(doc);
  return {
    day: new Intl.DateTimeFormat("en-US", { day: "2-digit", timeZone }).format(date),
    month: new Intl.DateTimeFormat("en-US", { month: "short", timeZone }).format(date),
  };
}

/** "Friday, August 14, 2026" */
export function eventLongDate(doc: ContentDoc | undefined): string {
  const date = dateOf(doc);
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: tzOf(doc),
  }).format(date);
}

/** "SEATTLE, WA" — location line, falling back to the online platform. */
export function eventLocation(doc: ContentDoc | undefined): string {
  const parts = [doc?.city, doc?.country].filter(
    (part): part is string => typeof part === "string" && part.length > 0,
  );
  if (parts.length) return parts.join(", ");
  const named = doc?.locationName ?? doc?.location ?? doc?.onlinePlatform;
  return typeof named === "string" ? named : "";
}

/**
 * Prices are stored in MINOR units everywhere in the CMS — both `events.price`
 * and `digital-products.price` are cents ("49000 = $490.00" in their own field
 * descriptions). Formatting one as a major-unit amount turns $490 into $49,000.
 * Whole amounts drop the decimals, which is how the design prints them.
 */
export function money(cents: number, currency = "usd"): string {
  const amount = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

/** Upcoming first; events without a date sink to the bottom. */
export function sortByStart(rows: ContentDoc[]): ContentDoc[] {
  return [...rows].sort((a, b) => {
    const aTime = dateOf(a)?.getTime() ?? Number.POSITIVE_INFINITY;
    const bTime = dateOf(b)?.getTime() ?? Number.POSITIVE_INFINITY;
    return aTime - bTime;
  });
}

/** Splits a list into future and past around now. */
export function splitByTime(rows: ContentDoc[]): {
  upcoming: ContentDoc[];
  past: ContentDoc[];
} {
  const now = Date.now();
  const upcoming: ContentDoc[] = [];
  const past: ContentDoc[] = [];
  for (const row of sortByStart(rows)) {
    const time = dateOf(row)?.getTime();
    if (time != null && time < now) past.push(row);
    else upcoming.push(row);
  }
  return { upcoming, past: past.reverse() };
}
