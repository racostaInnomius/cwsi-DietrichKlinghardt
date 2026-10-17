import type { ContentDoc } from "@/data/demo";

/**
 * Display helpers shared by the events, courses and store views.
 *
 * Dates are rendered in the event's own timezone when it declares one — a
 * webinar listed "10:00 AM EST" must read the same for every visitor, not shift
 * to whatever timezone the browser happens to be in.
 */

export function tzOf(doc: ContentDoc | undefined): string | undefined {
  const tz = doc?.timezone;
  return typeof tz === "string" && tz ? tz : undefined;
}

export function dateOf(doc: ContentDoc | undefined): Date | null {
  const raw = doc?.startDateTime ?? doc?.date;
  if (typeof raw !== "string" || !raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function endDateOf(doc: ContentDoc | undefined): Date | null {
  const raw = doc?.endDateTime;
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

/** "14" / "August" / "2026" — the day block on the event detail panel. */
export function eventDateBlock(
  doc: ContentDoc | undefined,
): { day: string; month: string; year: string } {
  const date = dateOf(doc);
  if (!date) return { day: "—", month: "", year: "" };
  const timeZone = tzOf(doc);
  return {
    day: new Intl.DateTimeFormat("en-US", { day: "2-digit", timeZone }).format(date),
    month: new Intl.DateTimeFormat("en-US", { month: "long", timeZone }).format(date),
    year: new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone }).format(date),
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

/**
 * eventLongDate, or a range when the event ends on a later day:
 * "Monday, November 23 – Tuesday, November 24, 2026".
 */
export function eventDateRange(doc: ContentDoc | undefined): string {
  const start = dateOf(doc);
  const end = endDateOf(doc);
  if (!start) return "";
  const format = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: tzOf(doc),
  });
  const day = (date: Date) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: tzOf(doc) }).format(date);
  return end && end > start && day(end) !== day(start)
    ? format.formatRange(start, end)
    : format.format(start);
}

/** "9:00 AM – 12:00 PM PDT" in the event's declared timezone. */
export function eventTimeLabel(doc: ContentDoc | undefined): string {
  const start = dateOf(doc);
  if (!start) return "";

  const timeZone = tzOf(doc);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });
  const zone = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short",
  })
    .formatToParts(start)
    .find((part) => part.type === "timeZoneName")?.value;

  const end = endDateOf(doc);
  const range = end
    ? `${time.format(start)} – ${time.format(end)}`
    : time.format(start);

  return zone ? `${range} ${zone}` : range;
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

/** "October 2nd" — the announcement bar's short form, in the event's own timezone. */
export function eventMonthDayOrdinal(doc: ContentDoc | undefined): string {
  const date = dateOf(doc);
  if (!date) return "";
  const timeZone = tzOf(doc);
  const month = new Intl.DateTimeFormat("en-US", { month: "long", timeZone }).format(date);
  const day = Number(new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone }).format(date));
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  return `${month} ${day}${suffix}`;
}

/** A talk saved without an end time is assumed to run this long. */
const DEFAULT_TALK_LENGTH_MS = 2 * 60 * 60 * 1000;
/** How long after its scheduled end a talk is still checked for running over. */
const MAX_OVERRUN_MS = 12 * 60 * 60 * 1000;

/** The scheduled end in ms — or start + DEFAULT_TALK_LENGTH_MS when the CMS has none. */
function scheduledEnd(doc: ContentDoc | undefined): number | null {
  const end = endDateOf(doc)?.getTime();
  if (end != null) return end;
  const start = dateOf(doc)?.getTime();
  return start == null ? null : start + DEFAULT_TALK_LENGTH_MS;
}

/** Talks streamed on Mux, free or members-only, soonest first. */
function streamedWeeklyTalks(events: ContentDoc[]): ContentDoc[] {
  return sortByStart(events.filter((event) => event.liveMode === "mux"));
}

/**
 * The current or next weekly talk, free or members-only (client, 2026-10-16:
 * "que el bloque muestre el siguiente sea Gratis o No") — same selection the
 * "next live talk" band on /weekly-talks uses, shared here so the sitewide
 * announcement bar always names the same session. A talk stays current from
 * its start through its scheduled end (a talk without an end time is assumed
 * to last DEFAULT_TALK_LENGTH_MS) — even when the stream finished early —
 * and past that end only while it is still on air (`stillLiveId`, see
 * useNextWeeklyTalk).
 */
export function nextWeeklyTalk(
  events: ContentDoc[],
  now = Date.now(),
  stillLiveId?: string,
): ContentDoc | undefined {
  return streamedWeeklyTalks(events).find((event) => {
    if (stillLiveId && String(event.id) === stillLiveId) return true;
    const start = dateOf(event)?.getTime();
    if (start == null || start >= now) return true;
    const end = scheduledEnd(event);
    return end != null && end > now;
  });
}

/**
 * The latest talk whose scheduled end has passed recently — the one that may
 * still be running over, so its live state is worth asking about.
 */
export function overrunCandidate(events: ContentDoc[], now = Date.now()): ContentDoc | undefined {
  return streamedWeeklyTalks(events)
    .filter((event) => {
      const end = scheduledEnd(event);
      return end != null && end <= now && end + MAX_OVERRUN_MS > now;
    })
    .at(-1);
}

export type WeeklyTalkStatus = { label: string; tone: "live" | "interrupted" | "waiting" };

/**
 * The /weekly-talks "next live talk" badge for a polled Mux mode:
 *   - "Live Now" whenever the stream is on air, including past the scheduled end.
 *   - "Reconnecting…" while a dropped signal may still come back.
 *   - "Starting shortly" only between the scheduled start and the moment the
 *     stream actually begins (e.g. 2:30 → 2:35), never before the start and
 *     never once the broadcast is over (`muxStatus` "completed", or past the
 *     scheduled end).
 *   - Nothing otherwise — an upcoming talk, or one already finished.
 */
export function weeklyTalkStatus(
  doc: ContentDoc | undefined,
  mode: string | null | undefined,
  muxStatus?: string,
  now = Date.now(),
): WeeklyTalkStatus | null {
  if (mode === "live") return { label: "Live Now", tone: "live" };
  if (mode === "interrupted") return { label: "Reconnecting…", tone: "interrupted" };
  if (mode !== "waiting" || muxStatus === "completed") return null;
  const start = dateOf(doc)?.getTime();
  const end = scheduledEnd(doc);
  return start != null && end != null && start <= now && now < end
    ? { label: "Starting shortly", tone: "waiting" }
    : null;
}
