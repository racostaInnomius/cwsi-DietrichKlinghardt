import type { ContentDoc } from "@/data/demo";
import { text } from "./content";

/**
 * Add-to-calendar for a live session.
 *
 * Built as an .ics data URL rather than a link to any calendar provider: a
 * download works with whatever the reader actually uses, needs no third party,
 * and leaks nothing about who is coming.
 */

/** ICS escapes commas, semicolons and newlines; unescaped they break the file. */
function escape(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function stamp(date: Date): string {
  // ICS UTC form: 20260901T140000Z
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

/**
 * Returns an .ics data URL for the event, or undefined when it has no usable
 * start — an invitation with no time is worse than no invitation.
 */
export function calendarHref(
  event: ContentDoc | undefined,
  { url }: { url?: string } = {},
): string | undefined {
  const rawStart = text(event, "startDateTime");
  if (!rawStart) return undefined;
  const start = new Date(rawStart);
  if (Number.isNaN(start.getTime())) return undefined;

  const rawEnd = text(event, "endDateTime");
  const parsedEnd = rawEnd ? new Date(rawEnd) : null;
  const end =
    parsedEnd && !Number.isNaN(parsedEnd.getTime())
      ? parsedEnd
      : // No end time given: an hour is the honest default for a weekly talk.
        new Date(start.getTime() + 60 * 60 * 1000);

  const title = text(event, "title", "Weekly talk with Dr. Klinghardt");
  const description = text(event, "shortDescription");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Dietrich Klinghardt//Weekly Talks//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${String(event?.id ?? start.getTime())}@dietrich-klinghardt.com`,
    `DTSTAMP:${stamp(new Date(start))}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escape(title)}`,
    ...(description ? [`DESCRIPTION:${escape(description)}`] : []),
    ...(url ? [`URL:${escape(url)}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  // CRLF is what the spec asks for, and some clients reject LF-only files.
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}
