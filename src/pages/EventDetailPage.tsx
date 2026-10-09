import { Seo } from "@/components/Seo";
import { Link, useParams } from "react-router-dom";
import { useCollection, text, number, textList } from "@/lib/content";
import { externalUrl, richTextBlocks } from "@/lib/cms";
import { checkoutHref } from "@/lib/checkout";
import { eventDateBlock, eventLocation, eventLongDate, eventTimeLabel } from "@/lib/format";
import { CurrencyNote, Price } from "@/lib/currency";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { EventMetaIcon } from "@/components/Icons";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/**
 * Event detail: an "Event details" panel on the left (date, facts, price,
 * Book Now) with the programme copy on the right — eyebrow, title, lead,
 * About the Programme, Requirements, What You Will Learn, and a closing
 * Book Now bar. No page-hero band here; the design runs this page on plain
 * ground with the breadcrumb sitting directly above both columns.
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
        <Seo
        title={"Event not found — Dr. Dietrich Klinghardt™"}
        noindex
      />
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
  const requirements = textList(event, "requirements");
  const whatYouWillLearn = richTextBlocks(event.whatYouWillLearn);
  const tags = textList(event, "tags");
  const location = eventLocation(event);
  const date = eventLongDate(event);
  const time = eventTimeLabel(event);
  const { day, month, year } = eventDateBlock(event);
  const category = text(event, "category");
  const instructor = text(event, "instructor", "Dietrich Klinghardt MD PhD™");
  const language = text(event, "language", "English");
  const capacity = number(event, "capacity");
  const price = typeof event.price === "number" ? event.price : undefined;
  const registrationType = text(event, "registrationType", "open");
  const checkoutUrl = checkoutHref(event.checkoutUrl);
  const learnMoreUrl = externalUrl(event.learnMoreUrl);
  const registrationUrl = registrationType === "paid" ? checkoutUrl : learnMoreUrl;
  const soldOut = event.status === "sold_out" || event.soldOut === true;
  const mapUrl = text(event, "mapUrl");
  const ctaLabel = registrationType === "paid" ? "Book now" : "Register / learn more";
  const noteText = text(event, "soldOutMessage", "This date is fully booked.");

  const eyebrow = [category, month && year ? `${month} ${year}` : ""]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <Seo
        title={`${title} — Dr. Dietrich Klinghardt™`}
        description={summary}
        path={`/events/${slug}`}
      />

      <section className="section wrap event-detail-page">
        <Breadcrumbs
          items={[{ label: "Events", href: "/events" }, { label: title }]}
        />

        <div className="event-detail">
          <Reveal as="aside" className="event-panel">
            <div className="event-panel__card">
              <div className="event-panel__date">
                <p className="event-panel__date-label">Event details</p>
                <div className="event-panel__date-row">
                  <b>{day}</b>
                  <span>
                    {month}
                    <br />
                    {year}
                  </span>
                </div>
              </div>

              <dl className="event-panel__facts">
                {time ? (
                  <div className="event-panel__fact">
                    <EventMetaIcon kind="time" />
                    <div>
                      <dt>Time</dt>
                      <dd>{time}</dd>
                    </div>
                  </div>
                ) : null}
                {date ? (
                  <div className="event-panel__fact">
                    <EventMetaIcon kind="calendar" />
                    <div>
                      <dt>Date</dt>
                      <dd>{date}</dd>
                    </div>
                  </div>
                ) : null}
                {category ? (
                  <div className="event-panel__fact">
                    <EventMetaIcon kind="tag" />
                    <div>
                      <dt>Category</dt>
                      <dd>{category}</dd>
                    </div>
                  </div>
                ) : null}
                {location ? (
                  <div className="event-panel__fact">
                    <EventMetaIcon kind="pin" />
                    <div>
                      <dt>{text(event, "format") === "online" ? "Platform" : "Location"}</dt>
                      <dd>{location}</dd>
                    </div>
                  </div>
                ) : null}
                <div className="event-panel__fact">
                  <EventMetaIcon kind="language" />
                  <div>
                    <dt>Language</dt>
                    <dd>{language}</dd>
                  </div>
                </div>
                <div className="event-panel__fact">
                  <EventMetaIcon kind="person" />
                  <div>
                    <dt>Instructor</dt>
                    <dd>{instructor}</dd>
                  </div>
                </div>
                {capacity > 0 ? (
                  <div className="event-panel__fact">
                    <EventMetaIcon kind="seats" />
                    <div>
                      <dt>Seats</dt>
                      <dd>{capacity} remaining</dd>
                    </div>
                  </div>
                ) : null}
              </dl>
            </div>

            <div className="event-panel__price">
              {price != null ? (
                <>
                  <p className="event-panel__price-value">
                    <Price cents={price} currency={text(event, "currency", "usd")} />
                    <span>per person</span>
                  </p>
                  <CurrencyNote currency={text(event, "currency", "usd")} />
                </>
              ) : null}

              {tags.length ? (
                <div className="event-panel__tags">
                  {tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {soldOut ? (
                <p className="event-panel__note">{noteText}</p>
              ) : (
                <a
                  className="btn btn-primary event-panel__cta"
                  href={registrationUrl || "#newsletter"}
                >
                  {ctaLabel}
                </a>
              )}

              {mapUrl ? (
                <a className="arrow-link" href={mapUrl} target="_blank" rel="noreferrer">
                  Open in maps <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          </Reveal>

          <Reveal className="event-copy" delay={100}>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h1><Marked text={title} /></h1>
            {summary ? <p className="event-copy__lead">{summary}</p> : null}

            {paragraphs.length ? (
              <div className="event-copy__section">
                <h2>About the Programme</h2>
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            {requirements.length ? (
              <div className="event-copy__section">
                <h2>Requirements</h2>
                <ul className="event-copy__list">
                  {requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {whatYouWillLearn.length ? (
              <div className="event-copy__section">
                <h2>What You Will Learn</h2>
                {whatYouWillLearn.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            <div className="event-copy__footer">
              {soldOut ? (
                <span className="event-copy__note">{noteText}</span>
              ) : (
                <>
                  <a className="btn btn-primary" href={registrationUrl || "#newsletter"}>
                    {ctaLabel}
                  </a>
                  {capacity > 0 ? (
                    <span className="event-copy__note">{capacity} seats remaining</span>
                  ) : null}
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
