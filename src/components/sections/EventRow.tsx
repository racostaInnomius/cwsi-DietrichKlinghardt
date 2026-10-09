import { Link } from "react-router-dom";
import type { ContentDoc } from "@/data/demo";
import { text } from "@/lib/content";
import { eventDateParts, eventLocation, eventTimeLabel } from "@/lib/format";
import { Price } from "@/lib/currency";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { EventMetaIcon } from "@/components/Icons";

/**
 * One line of the events listing: stacked date block, location eyebrow, title
 * and short description, with the category tag on the right — the row that
 * repeats on the Home strip and on the Events page.
 *
 * The row links to the event detail rather than straight to Stripe: the design
 * puts price, remaining seats and "Book Now" on the detail page, and sending a
 * visitor to checkout from a list would skip all of it.
 */
export function EventRow({
  event,
  delay = 0,
  showPrice = true,
}: {
  event: ContentDoc;
  delay?: number;
  /** Home's teaser strip omits price — the design keeps it for the detail
   *  page and the full Events listing only (2026-09-04: "No poner precios"). */
  showPrice?: boolean;
}) {
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
          {showPrice && price != null ? (
            <span className="event-row__price">
              <Price cents={price} currency={text(event, "currency", "usd")} />
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
  // Client (2026-09-18): "ponerle precio... si no hay precio ponerlo en
  // 0.00" — money()'s own maximumFractionDigits drops to 0 for whole
  // numbers (so a real $0 price would print "$0"), which doesn't match
  // the literal "0.00" asked for here, so the fallback is spelled out
  // instead of routed through money(0, ...).
  const price = typeof event.price === "number"
    ? <Price cents={event.price} currency={text(event, "currency", "usd")} />
    : "$0.00";
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
            <li><EventMetaIcon kind="pin" /><span>{formatLabel}</span></li>
            <li><EventMetaIcon kind="language" /><span>{language}</span></li>
          </ul>
        </div>
      </Link>

      <div className="event-card__footer">
        <Link to={href}>More info</Link>
        <strong>{price}</strong>
      </div>
      {/* Client (2026-09-11, against the Figma): "el boton de VIEW EVENT
          cambia el texto por BOOK NOW" — every card in the reference reads
          "Book now" regardless of registration type; only "Sold out"
          still overrides it. */}
      <Link to={href} className="event-card__cta">
        {soldOut ? "Sold out" : "Book now"}
        <span aria-hidden="true">↗</span>
      </Link>
    </Reveal>
  );
}
