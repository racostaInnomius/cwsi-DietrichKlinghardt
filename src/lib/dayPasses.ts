import type { ContentDoc } from "@/data/demo";
import { relationshipId } from "./cms";
import { dateOf, endDateOf, sortByStart, tzOf } from "./format";

/**
 * Multi-day events sold as a package AND per day (CMS: Events → "Day passes").
 * The package lists single-day events; each day is a full event of its own
 * (price, Payment Link, capacity), shown as a card on the package's page.
 *
 * Everything here works on the events the site already has — published and
 * sold-out only — so a draft or cancelled day simply never shows up.
 */

function dayPassIds(event: ContentDoc | undefined): string[] {
  const value = event?.dayPasses;
  if (!Array.isArray(value)) return [];
  return value.map(relationshipId).filter((id): id is string => Boolean(id));
}

/** The package's days that are on the site, earliest first. */
export function dayPassesOf(event: ContentDoc | undefined, events: ContentDoc[]): ContentDoc[] {
  const ids = new Set(dayPassIds(event));
  if (!ids.size) return [];
  return sortByStart(events.filter((row) => ids.has(String(row.id)) && row.id !== event?.id));
}

/**
 * A package and the days it sells, side by side and in that order.
 *
 * Both the package and each of its days are listed (client's call, 2026-11-04:
 * the home strip used to hide the days). They share a start date, so plain
 * date order can split a group apart and leave the package out of a short
 * list: each day is pulled up right behind its own package instead.
 */
export function groupPackagesWithDays(events: ContentDoc[]): ContentDoc[] {
  const sold = new Set<string>();
  for (const event of events) for (const id of dayPassIds(event)) sold.add(id);
  const claimed = new Set<string>();
  const grouped: ContentDoc[] = [];
  for (const event of events) {
    const id = String(event.id);
    // A day waits for its own package to pull it in, even when its date
    // would otherwise place it first.
    if (claimed.has(id) || sold.has(id)) continue;
    grouped.push(event);
    claimed.add(id);
    for (const day of dayPassesOf(event, events)) {
      const dayId = String(day.id);
      if (claimed.has(dayId)) continue;
      grouped.push(day);
      claimed.add(dayId);
    }
  }
  // A day whose package is not on the list (a draft, a past package) still
  // belongs on it, in its own date order.
  for (const event of events) if (!claimed.has(String(event.id))) grouped.push(event);
  return grouped;
}

/** The visible packages that include this event as one of their days. */
export function packagesIncluding(event: ContentDoc | undefined, events: ContentDoc[]): ContentDoc[] {
  if (!event) return [];
  const id = String(event.id);
  return events.filter((row) => row.id !== event.id && dayPassIds(row).includes(id));
}

/** Calendar day (YYYY-MM-DD) of a date in the event's own timezone. */
function calendarDay(date: Date, timeZone: string | undefined): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

/**
 * "Day 1 — Nov 23": the day's position within the package's dates (Nov 24 is
 * Day 2 even when Day 1 isn't sold separately). Falls back to the day's own
 * title when it isn't a single date inside the package's range — e.g. an
 * add-on session the evening before — or has no date at all.
 */
export function dayPassLabel(pkg: ContentDoc, day: ContentDoc): string {
  const title = typeof day.title === "string" ? day.title : "Day pass";
  const timeZone = tzOf(day) ?? tzOf(pkg);
  const dayStart = dateOf(day);
  const pkgStart = dateOf(pkg);
  if (!dayStart || !pkgStart) return title;
  const dayEnd = endDateOf(day) ?? dayStart;
  const pkgEnd = endDateOf(pkg) ?? pkgStart;
  const first = calendarDay(dayStart, timeZone);
  if (calendarDay(dayEnd, timeZone) !== first) return title;
  const pkgFirst = calendarDay(pkgStart, timeZone);
  const pkgLast = calendarDay(pkgEnd, timeZone);
  if (first < pkgFirst || first > pkgLast) return title;
  const index = Math.round((Date.parse(first) - Date.parse(pkgFirst)) / 86_400_000) + 1;
  const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone }).format(dayStart);
  return `Day ${index} — ${short}`;
}
