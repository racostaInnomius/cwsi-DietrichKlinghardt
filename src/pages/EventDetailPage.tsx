import type { ReactNode } from "react";
import { Seo } from "@/components/Seo";
import type { ContentDoc } from "@/data/demo";
import { Link, useParams } from "react-router-dom";
import { useCollection, text, number, textList } from "@/lib/content";
import { useSection, SECTION } from "@/lib/sections";
import { externalUrl, richTextBlocks, richTextSections, richTextMarked } from "@/lib/cms";
import { checkoutHref } from "@/lib/checkout";
import { EventPrice, eventPriceInfo } from "@/components/EventPrice";
import { eventDateBlock, eventDateRange, eventLocation, eventTimeLabel, splitByTime } from "@/lib/format";
import { dayPassLabel, dayPassesOf } from "@/lib/dayPasses";
import { CheckoutLink, CurrencyNote, Price } from "@/lib/currency";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { EventMetaIcon } from "@/components/Icons";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { Emphasis } from "@/components/Emphasis";
import { ButtonText } from "@/components/ButtonText";
import { useButtonLabel } from "@/lib/buttons";

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
  const events = useCollection("events");
  const event = events.find((row) => row.slug === slug);
  // Headings this page prints around the event's own copy (CMS: the
  // "event-page" block), so they are the tenant's words, not the code's.
  const eventCopy = useSection(SECTION.eventPage);

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
            <ButtonText id="events-all-events" />
          </Link>
        </section>
      </>
    );
  }

  const title = text(event, "title", "Event");
  const summary = text(event, "shortDescription");
  const paragraphs = richTextMarked(event.description);
  const requirements = textList(event, "requirements");
  const whatYouWillLearn = richTextMarked(event.whatYouWillLearn);
  // The purchase policy (CMS "Disclosure"): its first heading, when it opens
  // with one, is the collapsed title; the rest stays hidden until opened.
  const disclosure = richTextSections(event.disclosure);
  const disclosureTitle =
    disclosure[0]?.kind === "heading" ? disclosure[0].text : "Purchase policy";
  const disclosureBody = disclosure[0]?.kind === "heading" ? disclosure.slice(1) : disclosure;
  const tags = textList(event, "tags");
  const location = eventLocation(event);
  const date = eventDateRange(event);
  const time = eventTimeLabel(event);
  const { day, month, year } = eventDateBlock(event);
  const category = text(event, "category");
  const instructor = text(event, "instructor", "Dietrich Klinghardt MD PhD™");
  const language = text(event, "language", "English");
  const capacity = number(event, "capacity");
  // What the page shows: the Stripe price, or the price announced for an
  // event sold elsewhere (CMS: "Precio informativo").
  const priceInfo = eventPriceInfo(event);
  const registrationType = text(event, "registrationType", "open");
  const checkoutUrl = checkoutHref(event.checkoutUrl);
  const learnMoreUrl = externalUrl(event.learnMoreUrl);
  const registrationUrl = registrationType === "paid" ? checkoutUrl : learnMoreUrl;
  const soldOut = event.status === "sold_out" || event.soldOut === true;
  const mapUrl = text(event, "mapUrl");
  // A multi-day course also sold per day (CMS "Day passes"): its days show as
  // cards with their own Buy button. The reverse line ("Also part of <course>"
  // on a day's own page) was removed at the client's request, 2026-10-26.
  const dayPasses = dayPassesOf(event, events);
  const registerLabel = useButtonLabel("event-register");
  const bookFullCourseLabel = useButtonLabel("event-book-full-course");
  const bookNowLabel = useButtonLabel("event-book-now");
  const ctaLabel =
    registrationType !== "paid"
      ? registerLabel
      : dayPasses.length
        ? bookFullCourseLabel
        : bookNowLabel;
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
              {priceInfo ? (
                <>
                  <p className="event-panel__price-value">
                    <EventPrice event={event} />
                    <span>per person</span>
                  </p>
                  {/* An announced price is charged on the other site, so the
                      cart's "you'll pay in…" note would be misleading. */}
                  {priceInfo.announced ? null : (
                    <CurrencyNote
                      currency={priceInfo.currency}
                      charge={registrationType === "paid" ? "selected" : "original"}
                    />
                  )}
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
                <EventCta
                  className="btn btn-primary event-panel__cta"
                  paid={registrationType === "paid"}
                  href={registrationUrl}
                  event={event}
                >
                  {ctaLabel}
                </EventCta>
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
            {/* Through <Emphasis> so an address the editor typed here is a
                real link (client, 2026-10-26). */}
            {summary ? (
              <p className="event-copy__lead"><Emphasis text={summary} /></p>
            ) : null}

            {paragraphs.length ? (
              <div className="event-copy__section">
                <h2><Marked text={eventCopy.title} /></h2>
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}><Emphasis text={paragraph} /></p>
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
                  <p key={paragraph}><Emphasis text={paragraph} /></p>
                ))}
              </div>
            ) : null}

            {dayPasses.length ? (
              <div className="event-copy__section day-passes">
                <h2>Day passes</h2>
                <div className="day-passes__grid">
                  {dayPasses.map((day) => (
                    <DayPassCard key={String(day.id)} pkg={event} day={day} />
                  ))}
                </div>
              </div>
            ) : null}

            {disclosure.length ? (
              <details className="event-copy__section event-disclosure" id="purchase-policy">
                <summary>
                  <h2>{disclosureTitle}</h2>
                </summary>
                <div className="event-disclosure__body">
                  {disclosureBody.map((block, index) =>
                    block.kind === "heading" ? (
                      <h3 key={index}>{block.text}</h3>
                    ) : (
                      <p key={index}>{block.text}</p>
                    ),
                  )}
                </div>
              </details>
            ) : null}

            <div className="event-copy__footer">
              {soldOut ? (
                <span className="event-copy__note">{noteText}</span>
              ) : (
                <>
                  <EventCta
                    className="btn btn-primary"
                    paid={registrationType === "paid"}
                    href={registrationUrl}
                    event={event}
                  >
                    {ctaLabel}
                  </EventCta>
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

/**
 * One day of a multi-day course, sold on its own: "Day 1 — Nov 23", its
 * subtitle (the day's short description), what it covers, time, price and its
 * own Buy button. A sold-out day says so; a day that already happened can't
 * be bought.
 */
function DayPassCard({ pkg, day }: { pkg: ContentDoc; day: ContentDoc }) {
  const label = dayPassLabel(pkg, day);
  const subtitle = text(day, "shortDescription");
  const topics = richTextBlocks(day.whatYouWillLearn);
  const time = eventTimeLabel(day);
  const price = typeof day.price === "number" ? day.price : undefined;
  const currency = text(day, "currency", "usd");
  const paid = text(day, "registrationType", "open") === "paid";
  const href = paid ? checkoutHref(day.checkoutUrl) : externalUrl(day.learnMoreUrl);
  const soldOut = day.status === "sold_out" || day.soldOut === true;
  const past = splitByTime([day]).past.length > 0;
  const seats = number(day, "capacity");
  const dayWord = label.startsWith("Day ") ? label.split(" — ")[0] : "";
  // "Book Day 2" borrows the verb from the event's own Book button, so the
  // day passes follow the wording the editor set there.
  const bookNow = useButtonLabel("event-book-now");
  const bookWord = bookNow.split(" ")[0];
  const register = useButtonLabel("event-register");

  return (
    <article className="day-pass">
      <p className="day-pass__label">{label}</p>
      <h3>{subtitle || text(day, "title")}</h3>
      {time ? <p className="day-pass__time">{time}</p> : null}
      {topics.length ? (
        <ul className="event-copy__list day-pass__topics">
          {topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      ) : null}
      <div className="day-pass__buy">
        {price != null ? (
          <p className="day-pass__price">
            <Price cents={price} currency={currency} />
            <span>per person</span>
          </p>
        ) : null}
        {past ? (
          <p className="day-pass__note">This day has already taken place.</p>
        ) : soldOut ? (
          <p className="day-pass__note">{text(day, "soldOutMessage", "This date is fully booked.")}</p>
        ) : href ? (
          <EventCta className="btn btn-primary day-pass__cta" paid={paid} href={href} event={day}>
            {paid ? (dayWord ? `${bookWord} ${dayWord}` : bookNow) : register}
          </EventCta>
        ) : null}
        {!past && !soldOut && seats > 0 ? (
          <p className="day-pass__note">{seats} seats remaining</p>
        ) : null}
        <Link className="arrow-link day-pass__details" to={`/events/${text(day, "slug")}`}>
          Day details <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

/**
 * The page's registration button: a paid event's checkout honours the
 * visitor's display currency (CheckoutLink); anything else is a plain link.
 */
function EventCta({
  paid,
  href,
  event,
  className,
  children,
}: {
  paid: boolean;
  href: string | undefined;
  event: ContentDoc;
  className: string;
  children: ReactNode;
}) {
  if (paid && href) {
    return (
      <CheckoutLink
        className={className}
        href={href}
        kind="event"
        itemId={event.id}
        currency={text(event, "currency", "usd")}
      >
        {children}
      </CheckoutLink>
    );
  }
  return (
    <a className={className} href={href || "#newsletter"}>
      {children}
    </a>
  );
}
