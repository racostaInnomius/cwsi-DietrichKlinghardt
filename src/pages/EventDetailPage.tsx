import { Head } from "vite-react-ssg";
import { Link, useParams } from "react-router-dom";
import { useCollection, text, number } from "@/lib/content";
import { mediaUrl, richTextBlocks } from "@/lib/cms";
import { checkoutHref } from "@/lib/checkout";
import { eventLocation, eventLongDate, money } from "@/lib/format";
import { env } from "@/lib/env";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/**
 * Event detail: the description on the left, a sticky booking panel on the
 * right (date, place, price, seats, "Book Now").
 *
 * The panel only shows a Book Now button when the CMS carries a valid live
 * checkout URL — see `checkoutHref`. Otherwise it says registration is not open,
 * which is true, instead of linking somewhere that cannot take money.
 */
export function EventDetailPage() {
  const { slug } = useParams();
  const event = useCollection("events").find((row) => row.slug === slug);

  if (!event) {
    return (
      <>
        <Head>
          <title>Event not found — Dr. Dietrich Klinghardt™</title>
          <meta name="robots" content="noindex" />
        </Head>
        <section className="section wrap">
          <h1>This event is no longer listed.</h1>
          <p className="lead">
            It may have finished or been rescheduled. Browse the current dates
            instead.
          </p>
          <Link className="btn btn-primary" to="/events">
            All events
          </Link>
        </section>
      </>
    );
  }

  const title = text(event, "title", "Event");
  const summary = text(event, "shortDescription");
  const paragraphs = richTextBlocks(event.description);
  const image = mediaUrl(event.image);
  const location = eventLocation(event);
  const date = eventLongDate(event);
  const capacity = number(event, "capacity");
  const price = typeof event.price === "number" ? event.price : undefined;
  const href = checkoutHref(event.checkoutUrl);
  const soldOut = event.soldOut === true;
  const mapUrl = text(event, "mapUrl");

  return (
    <>
      <Head>
        <title>{`${title} — Dr. Dietrich Klinghardt™`}</title>
        {summary ? <meta name="description" content={summary} /> : null}
        <link rel="canonical" href={`${env.SITE_URL}/events/${slug}`} />
      </Head>

      <AnimatedGradient variant="page" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Breadcrumbs
            items={[{ label: "Events", href: "/events" }, { label: title }]}
          />
          <Reveal>
            {location ? <p className="eyebrow">{location}</p> : null}
            <h1>{title}</h1>
            {date ? <p className="lead">{date}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap event-detail">
        <div className="event-detail__body">
          {image ? (
            <Reveal>
              <img className="event-detail__image" src={image} alt="" />
            </Reveal>
          ) : null}
          <Reveal className="prose">
            {summary ? <p className="lead">{summary}</p> : null}
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
        </div>

        <Reveal as="aside" className="booking-panel" delay={120}>
          <dl>
            {date ? (
              <div>
                <dt>Date</dt>
                <dd>{date}</dd>
              </div>
            ) : null}
            {text(event, "durationLabel") ? (
              <div>
                <dt>Duration</dt>
                <dd>{text(event, "durationLabel")}</dd>
              </div>
            ) : null}
            {location ? (
              <div>
                <dt>{text(event, "format") === "online" ? "Platform" : "Location"}</dt>
                <dd>
                  {location}
                  {text(event, "address") ? (
                    <>
                      <br />
                      <span className="muted">{text(event, "address")}</span>
                    </>
                  ) : null}
                </dd>
              </div>
            ) : null}
            {capacity > 0 ? (
              <div>
                <dt>Seats</dt>
                <dd>{capacity} available</dd>
              </div>
            ) : null}
            {price != null ? (
              <div>
                <dt>Price</dt>
                <dd className="booking-panel__price">
                  {money(price, text(event, "currency", "usd"))}
                </dd>
              </div>
            ) : null}
          </dl>

          {soldOut ? (
            <p className="booking-panel__note">
              {text(event, "soldOutMessage", "This date is fully booked.")}
            </p>
          ) : href ? (
            <a className="btn btn-primary booking-panel__cta" href={href}>
              Book now
            </a>
          ) : (
            <p className="booking-panel__note">
              Registration for this date is not open yet. Join the newsletter and
              you’ll hear as soon as it is.
            </p>
          )}

          {mapUrl ? (
            <a className="arrow-link" href={mapUrl} target="_blank" rel="noreferrer">
              Open in maps <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </Reveal>
      </section>

      <NewsletterSection />
    </>
  );
}
