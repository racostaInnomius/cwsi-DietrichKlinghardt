import { Seo } from "@/components/Seo";
import { useCollection, text, number } from "@/lib/content";
import { useSection, useRecords, SECTION } from "@/lib/sections";
import { checkoutHref } from "@/lib/checkout";
import { eventLongDate, splitByTime } from "@/lib/format";
import { calendarHref } from "@/lib/calendar";
import { env } from "@/lib/env";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Link } from "react-router-dom";
import { Accordion } from "@/components/sections/Accordion";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/**
 * Weekly Talks — the membership page.
 *
 * The live player and the member archive belong to a later phase; what this
 * page does today is state what the membership is, show when the next live
 * session runs (from the events collection, so it is never a stale hardcoded
 * date), and take a subscription through a Stripe Payment Link.
 *
 * The Join button appears only when a `weekly-talks-cta` row supplies a valid
 * live Stripe link. Without one the page asks people to join the newsletter,
 * which is honest, instead of showing a button that cannot charge.
 */
export function WeeklyTalksPage() {
  const page = useSection(SECTION.weeklyTalks, {
    title: "Join My Weekly Talks",
    paragraphs: [
      "Every week, a live session with Dr. Klinghardt: a short teaching on what he is working through clinically, then open questions from the community.",
      "Members get the live session, the replay, and the archive of everything that came before.",
    ],
  });

  const [ctaLabel, ctaUrl] = useRecords("weekly-talks-cta", 2, [])[0] ?? [];
  const joinHref = checkoutHref(ctaUrl);

  // The next live session, taken from the events the CMS already publishes.
  // `liveMode` is the CMS select ("mux"), not a boolean — anything truthy other
  // than "off" means this event streams.
  const nextLive = splitByTime(
    useCollection("events").filter(
      (event) => typeof event.liveMode === "string" && event.liveMode !== "off",
    ),
  ).upcoming[0];
  const addToCalendar = calendarHref(nextLive, {
    url: `${env.SITE_URL}/weekly-talks`,
  });

  const faqs = [...useCollection("faqs")]
    .sort((a, b) => number(a, "order") - number(b, "order"))
    .map((row, index) => ({
      id: String(row.id ?? index),
      question: text(row, "question"),
      answer: text(row, "answer"),
    }))
    .filter((item) => item.question && item.answer);

  return (
    <>
      <Seo
        title={"Weekly Talks — Dr. Dietrich Klinghardt™"}
        description="A live session with Dr. Klinghardt every week, plus the replay and the full archive."
        path="/weekly-talks"
      />

      <AnimatedGradient variant="card" intensity="strong" className="hero">
        <div className="wrap hero__inner">
          <Reveal>
            <p className="eyebrow hero__eyebrow">Exclusive membership</p>
            <h1 className="display-xl"><Marked text={page.title} /></h1>
            <p className="hero__lead">{page.lead}</p>
            {nextLive ? (
              <p className="hero__badge">
                Next live session · {eventLongDate(nextLive)}
              </p>
            ) : null}
            <div className="hero__actions">
              {joinHref ? (
                <a className="btn btn-light" href={joinHref}>
                  {ctaLabel || "Join now"}
                </a>
              ) : (
                <a className="btn btn-light" href="#newsletter">
                  Get notified
                </a>
              )}
              {nextLive ? (
                <Link className="btn btn-ghost" to={`/weekly-talks/live/${String(nextLive.id)}`}>
                  Watch the live
                </Link>
              ) : null}
              {addToCalendar ? (
                <a
                  className="btn btn-ghost"
                  href={addToCalendar}
                  download="weekly-talk.ics"
                >
                  Add to calendar
                </a>
              ) : null}
            </div>
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap two-col">
        <Reveal className="prose">
          {page.paragraphs.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Reveal>

        <Reveal as="aside" className="form-panel" delay={100}>
          <p className="eyebrow">What’s included</p>
          <ul className="tick-list">
            <li>The live session each week, with open Q&amp;A</li>
            <li>The replay, if you cannot make the hour</li>
            <li>The archive of previous sessions</li>
            <li>Cancel whenever you like</li>
          </ul>
        </Reveal>
      </section>

      {faqs.length ? (
        <section className="section wrap" id="faq">
          <Reveal>
            <p className="eyebrow">Questions</p>
            <h2 className="section-title">Before you join</h2>
          </Reveal>
          <Accordion items={faqs} />
        </section>
      ) : null}

      <NewsletterSection />
    </>
  );
}
