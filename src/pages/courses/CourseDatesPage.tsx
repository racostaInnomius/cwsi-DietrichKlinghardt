import { useState } from "react";
import { Seo } from "@/components/Seo";
import { Link, useParams } from "react-router-dom";
import { useCollection, text } from "@/lib/content";
import { useTrainingPath, eventsForPath } from "@/lib/trainingPaths";
import { checkoutHref } from "@/lib/checkout";
import { eventDateParts, eventLocation, splitByTime } from "@/lib/format";
import { CheckoutLink, Price } from "@/lib/currency";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

const PAGE_SIZE = 6;

/**
 * The bookable dates for one training path.
 *
 * Each card is an `events` row, so a course date is the same object as any
 * other event — same Stripe link, same fulfillment, same webhook. Nothing new
 * had to be built to take money for a seminar.
 *
 * "Book now" follows the rule the rest of the site follows: no valid live
 * checkout link, no button. The card then links to the event page, where the
 * reader can at least read the detail and see that registration is not open.
 */
export function CourseDatesPage() {
  const { slug } = useParams();
  const path = useTrainingPath(slug);
  const events = useCollection("events");
  const [shown, setShown] = useState(PAGE_SIZE);

  if (!path) {
    return (
      <>
        <Seo
        title={"Training path not found — Dr. Dietrich Klinghardt™"}
        noindex
      />
        <section className="section wrap">
          <h1>This training path is no longer listed.</h1>
          <Link className="btn btn-primary" to="/courses">
            All courses
          </Link>
        </section>
      </>
    );
  }

  const { upcoming } = splitByTime(eventsForPath(events, path));
  const visible = upcoming.slice(0, shown);

  return (
    <>
      <Seo
        title={`${path.abbreviation} Course Dates — Dr. Dietrich Klinghardt™`}
        description={`Upcoming ${path.abbreviation} course dates with Dr. Dietrich Klinghardt.`}
        path={`/courses/${path.slug}/dates`}
      />

      {/* Client (2026-09-11): "el titulo lo siento super grande bajarle
          unos 15 pt" — .course-dates-hero (sections.css) scopes the fix to
          this page's own h1 rather than the shared --fs-display-lg token
          every other page-hero uses. */}
      <AnimatedGradient variant="card" intensity="soft" className="page-hero course-dates-hero">
        <div className="wrap page-hero__inner">
          <Breadcrumbs
            items={[
              { label: "Online courses", href: "/courses" },
              { label: path.abbreviation, href: `/courses/${path.slug}` },
              { label: "Dates" },
            ]}
          />
          <Reveal>
            <p className="eyebrow">Course dates</p>
            <h1><Marked text={path.title} /></h1>
          </Reveal>
        </div>
      </AnimatedGradient>

      {/* Client: "subir el evento mas pegado al titulo, esta super
          despegado" — .section--tight-top (base.css) is the same fix
          already used elsewhere for a section sitting directly under a
          page-hero with nothing between them. */}
      <section className="section section--tight-top wrap">
        {visible.length ? (
          <>
            <ul className="course-list">
              {visible.map((event, index) => {
                const { day, month } = eventDateParts(event);
                const eventSlug = text(event, "slug");
                const href = checkoutHref(event.checkoutUrl);
                const price = typeof event.price === "number" ? event.price : undefined;
                const format = text(event, "format") === "online" ? "Online course" : "Seminar";

                return (
                  // Client (2026-09-11): "hazla un poco mas cuadrada como en
                  // figma" — pointing at the site's own course-path-card
                  // grid (/courses) as the reference: a tinted header
                  // (date + title), a white body (facts), a footer split
                  // into a solid CTA and a tint-matched secondary one.
                  // Same three-zone shape here instead of the old single
                  // horizontal row.
                  <Reveal
                    as="li"
                    key={String(event.id ?? index)}
                    className="course-card"
                    delay={(index % PAGE_SIZE) * 70}
                    shift={16}
                  >
                    <div className="course-card__header">
                      <div className="course-card__date" aria-hidden="true">
                        <b>{day}</b>
                        <span>{month}</span>
                      </div>
                      <p className="eyebrow">{format}</p>
                      <h2>
                        <Link to={eventSlug ? `/events/${eventSlug}` : "/events"}>
                          <Marked text={text(event, "title", "Course date")} />
                        </Link>
                      </h2>
                    </div>

                    <div className="course-card__body">
                      <dl className="course-card__facts">
                        {text(event, "instructor") ? (
                          <div>
                            <dt>Taught by</dt>
                            <dd>
                              <Marked text={text(event, "instructor")} />
                            </dd>
                          </div>
                        ) : null}
                        {text(event, "durationLabel") ? (
                          <div>
                            <dt>Time</dt>
                            <dd>{text(event, "durationLabel")}</dd>
                          </div>
                        ) : null}
                        {eventLocation(event) ? (
                          <div>
                            <dt>Where</dt>
                            <dd>{eventLocation(event)}</dd>
                          </div>
                        ) : null}
                        {/* A date can name its own language; otherwise the
                            path's languages are the truthful answer. */}
                        {text(event, "language") || path.languages.length ? (
                          <div>
                            <dt>Language</dt>
                            <dd>
                              {text(event, "language") || path.languages.join(", ")}
                            </dd>
                          </div>
                        ) : null}
                      </dl>
                    </div>

                    <div className="course-card__footer">
                      {href ? (
                        <CheckoutLink
                          className="course-card__cta course-card__cta--primary"
                          href={href}
                          kind="event"
                          itemId={event.id}
                          currency={text(event, "currency", "usd")}
                        >
                          Book now
                        </CheckoutLink>
                      ) : (
                        <Link
                          className="course-card__cta course-card__cta--primary"
                          to={eventSlug ? `/events/${eventSlug}` : "/events"}
                        >
                          Details
                        </Link>
                      )}
                      {price != null ? (
                        <span className="course-card__cta course-card__cta--secondary">
                          <Price cents={price} currency={text(event, "currency", "usd")} />
                        </span>
                      ) : null}
                    </div>
                  </Reveal>
                );
              })}
            </ul>

            {shown < upcoming.length ? (
              <button
                type="button"
                className="btn btn-outline load-more"
                onClick={() => setShown((count) => count + PAGE_SIZE)}
              >
                Load more
              </button>
            ) : null}
          </>
        ) : (
          <p className="empty-note">
            No dates are open for this path right now. Join the newsletter below
            and you’ll hear as soon as the next ones are scheduled.
          </p>
        )}
      </section>

      <NewsletterSection />
    </>
  );
}
