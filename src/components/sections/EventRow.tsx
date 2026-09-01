import { Link } from "react-router-dom";
import type { ContentDoc } from "@/data/demo";
import { text } from "@/lib/content";
import { eventDateParts, eventLocation, eventTimeLabel, money } from "@/lib/format";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";

/**
 * One line of the events listing: stacked date block, location eyebrow, title
 * and short description, with the category tag on the right — the row that
 * repeats on the Home strip and on the Events page.
 *
 * The row links to the event detail rather than straight to Stripe: the design
 * puts price, remaining seats and "Book Now" on the detail page, and sending a
 * visitor to checkout from a list would skip all of it.
 */
export function EventRow({ event, delay = 0 }: { event: ContentDoc; delay?: number }) {
  const { day, month } = eventDateParts(event);
  const slug = text(event, "slug");
  const title = text(event, "title", "Untitled event");
  const summary = text(event, "shortDescription");
  const category = text(event, "category");
  const location = eventLocation(event);
  const price = typeof event.price === "number" ? event.price : undefined;
  const soldOut = event.status === "sold_out" || event.soldOut === true;

  return (
    <Reveal as="li" className="event-row" delay={delay} shift={16}>
      <Link to={slug ? `/events/${slug}` : "/events"} className="event-row__link">
        <div className="event-row__date" aria-hidden="true">
          <b>{day}</b>
          <span>{month}</span>
        </div>

        <div className="event-row__body">
          {location ? <p className="eyebrow">{location}</p> : null}
          <h3>{title}</h3>
          {summary ? <p>{summary}</p> : null}
        </div>

        <div className="event-row__meta">
          {soldOut ? <span className="tag">Sold out</span> : null}
          {category ? <span className="tag">{category}</span> : null}
          {price != null ? (
            <span className="event-row__price">
              {money(price, text(event, "currency", "usd"))}
            </span>
          ) : null}
          <span className="event-row__arrow" aria-hidden="true">
            ↗
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

function EventMetaIcon({ kind }: { kind: "person" | "time" | "format" | "language" }) {
  if (kind === "person") {
    return <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="5" r="2.25" /><path d="M4.5 13c.3-2.2 1.5-3.4 3.5-3.4s3.2 1.2 3.5 3.4" /></svg>;
  }
  if (kind === "time") {
    return <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.25" /><path d="M8 4.7V8l2.2 1.5" /></svg>;
  }
  if (kind === "format") {
    return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14s4-3.6 4-7A4 4 0 0 0 4 7c0 3.4 4 7 4 7Z" /><circle cx="8" cy="7" r="1.35" /></svg>;
  }
  return <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.25" /><path d="M2.9 8h10.2M8 2.75c1.6 1.5 2.3 3.2 2.3 5.25S9.6 11.8 8 13.25C6.4 11.8 5.7 10 5.7 8S6.4 4.2 8 2.75Z" /></svg>;
}

/** Three-column card used by the Events page. */
export function EventCard({ event, delay = 0 }: { event: ContentDoc; delay?: number }) {
  const { day, month } = eventDateParts(event);
  const slug = text(event, "slug");
  const title = text(event, "title", "Untitled event");
  const location = eventLocation(event);
  const instructor = text(event, "instructor", "Dietrich Klinghardt MD PhD™");
  const time = text(event, "durationLabel") || eventTimeLabel(event);
  const format = text(event, "format");
  const platform = text(event, "onlinePlatform");
  const formatLabel = format === "online"
    ? `Online${platform ? ` — ${platform}` : ""}`
    : format === "hybrid"
      ? `Hybrid${platform ? ` — ${platform}` : ""}`
      : "In person";
  const language = text(event, "language", "English");
  const price = typeof event.price === "number"
    ? money(event.price, text(event, "currency", "usd"))
    : "";
  const soldOut = event.status === "sold_out" || event.soldOut === true;
  const href = slug ? `/events/${slug}` : "/events";

  return (
    <Reveal as="li" className="event-card" delay={delay} shift={16}>
      <Link to={href} className="event-card__main">
        <div className="event-card__date" aria-hidden="true">
          <b>{day}</b>
          <span>{month}</span>
        </div>

        <div className="event-card__body">
          {location ? <p className="event-card__location">{location}</p> : null}
          <h3><Marked text={title} /></h3>
          <ul className="event-card__details">
            <li><EventMetaIcon kind="person" /><span>{instructor}</span></li>
            {time ? <li><EventMetaIcon kind="time" /><span>{time}</span></li> : null}
            <li><EventMetaIcon kind="format" /><span>{formatLabel}</span></li>
            <li><EventMetaIcon kind="language" /><span>{language}</span></li>
          </ul>
        </div>
      </Link>

      <div className="event-card__footer">
        <Link to={href}>More info</Link>
        {price ? <strong>{price}</strong> : null}
      </div>
      <Link to={href} className="event-card__cta">
        {soldOut ? "Sold out" : event.registrationType === "paid" ? "Book now" : "View event"}
        <span aria-hidden="true">↗</span>
      </Link>
    </Reveal>
  );
}
