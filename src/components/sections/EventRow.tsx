import { Link } from "react-router-dom";
import type { ContentDoc } from "@/data/demo";
import { text } from "@/lib/content";
import { mediaUrl } from "@/lib/cms";
import { eventDateParts, eventLocation, money } from "@/lib/format";
import { Reveal } from "@/components/motion/Reveal";

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

/** Card variant used where the design shows images instead of a list. */
export function EventCard({ event, delay = 0 }: { event: ContentDoc; delay?: number }) {
  const { day, month } = eventDateParts(event);
  const slug = text(event, "slug");
  const image = mediaUrl(event.image);
  const location = eventLocation(event);

  return (
    <Reveal as="li" className="event-card" delay={delay} shift={16}>
      <Link to={slug ? `/events/${slug}` : "/events"}>
        <div className="event-card__media">
          {image ? (
            <img src={image} alt="" loading="lazy" />
          ) : (
            <span className="event-card__date">
              <b>{day}</b>
              <span>{month}</span>
            </span>
          )}
        </div>
        {location ? <p className="eyebrow">{location}</p> : null}
        <h3>{text(event, "title", "Untitled event")}</h3>
        <p>{text(event, "shortDescription")}</p>
      </Link>
    </Reveal>
  );
}
