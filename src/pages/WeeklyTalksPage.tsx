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
import { EventMetaIcon } from "@/components/Icons";
import { Accordion } from "@/components/sections/Accordion";

/**
 * The plan, as the frame states it: label, amount, period, terms.
 *
 * ⚠️ This price and the Stripe Payment Link behind the button are two separate
 * pieces of content, and nothing checks that they agree. If the link is ever
 * changed to charge something else, THIS is where the site would keep telling
 * people the old number. Whoever sets the link should set this row in the same
 * sitting. See PENDIENTES A13.
 */
const PLAN_FALLBACK = [["Membership", "$25", "/ month", "Billed monthly · cancel anytime"]];

const BENEFITS_FALLBACK = [
  ["Live weekly talks every Wednesday"],
  ["Full recordings archive (all past sessions)"],
  ["Live Q&A with Dr. Dietrich Klinghardt™"],
  ["Priority access to special guest sessions"],
];

/**
 * The five questions the frame lists. It draws them closed, with no answers
 * written, so the answers are the client's (A13/A2) — until they arrive each row
 * says so rather than opening onto nothing.
 */
const FAQ_FALLBACK = [
  "When are the talks held?",
  "What happens if I miss one?",
  "Can I cancel anytime?",
  "What language are the talks in?",
  "How do I ask questions?",
].map((question) => ({
  id: question,
  question,
  answer:
    "The team is preparing this answer. In the meantime, write to us through the contact page and we will answer it directly.",
}));

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

  const [planLabel, planAmount, planPeriod, planTerms] =
    useRecords("weekly-talks-plan", 4, PLAN_FALLBACK)[0] ?? [];
  const benefits = useRecords("weekly-talks-benefits", 1, BENEFITS_FALLBACK);

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

      <AnimatedGradient variant="card-warm" intensity="normal" className="hero hero--split">
        <p className="hero--split__watermark" aria-hidden="true">Weekly Talks</p>
        <div className="wrap hero__inner">
          <Reveal>
            <p className="eyebrow hero__eyebrow">Exclusive membership</p>
            <h1 className="display-xl"><Marked text={page.title} /></h1>
            {/* The frame sets this line in the display face, a size down from
                the heading — a subtitle, not body copy. */}
            <p className="hero__subtitle">
              Live Answers, Every Week, Directly From Dr. Klinghardt.
            </p>
            <p className="hero__lead">{page.lead}</p>
            {/* The date and the calendar link live in their own band below, so
                they are not repeated here. One button, matching the frame —
                "Watch live" moved down beside the date it actually refers to. */}
            <div className="hero__actions">
              {joinHref ? (
                <a className="btn btn-primary" href={joinHref}>
                  {ctaLabel || "Join now"}
                </a>
              ) : (
                <a className="btn btn-primary" href="#pricing">
                  Join now
                </a>
              )}
            </div>
          </Reveal>

          {/* A generic "live call" mockup, drawn in CSS rather than a
              screenshot — the frame's own version isn't a real photo either,
              just a dark UI with a monogram avatar (see D-note below). */}
          <Reveal className="hero__aside" delay={120}>
            <div className="live-mock" aria-hidden="true">
              <div className="live-mock__bar">
                <span className="live-mock__dot live-mock__dot--red" />
                <span className="live-mock__dot live-mock__dot--yellow" />
                <span className="live-mock__dot live-mock__dot--green" />
                <span className="live-mock__url">weekly-talks.klinghardt-academy.com</span>
              </div>
              <div className="live-mock__screen">
                <div className="live-mock__top">
                  <span className="live-mock__live">
                    <span className="live-mock__live-dot" /> Live
                  </span>
                  <span className="live-mock__watching">247 watching</span>
                </div>
                <div className="live-mock__body">
                  <span className="live-mock__avatar">K</span>
                  <p className="live-mock__name">Dr. Dietrich Klinghardt</p>
                  <p className="live-mock__status">Live now</p>
                </div>
                <div className="live-mock__controls">
                  <span className="live-mock__play" />
                  <span className="live-mock__track">
                    <span className="live-mock__progress" />
                  </span>
                  <span className="live-mock__time">42:18</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </AnimatedGradient>

      {/* Next live session, its own navy band flush against the hero's
          bottom edge — the frame draws it as part of the same panel, not a
          floating card below it. */}
      {nextLive ? (
        <section className="section next-live-band">
          <Reveal className="next-live">
            <span className="next-live__chip">
              <span className="next-live__chip-dot" aria-hidden="true" /> Next live talk
            </span>
            <p className="next-live__when">{eventLongDate(nextLive)}</p>
            {addToCalendar ? (
              <a className="next-live__calendar" href={addToCalendar} download="weekly-talk.ics">
                <EventMetaIcon kind="calendar" /> Add to calendar
              </a>
            ) : null}
          </Reveal>
        </section>
      ) : null}

      {/* ── Pricing ──────────────────────────────────────────────── */}
      <section className="section wrap" id="pricing">
        <Reveal className="section-heading section-heading--center">
          <p className="eyebrow">Pricing</p>
          <h2>Learn, Connect, Grow Together</h2>
        </Reveal>

        <Reveal className="plan" delay={90}>
          <div className="plan__head">
            <p className="eyebrow">{planLabel}</p>
            <p className="plan__price">
              <span className="plan__amount">{planAmount}</span>
              <span className="plan__period">{planPeriod}</span>
            </p>
            <p className="plan__terms">{planTerms}</p>
          </div>

          <div className="plan__body">
            <ul className="tick-list plan__benefits">
              {benefits.map(([benefit]) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>

            {/* No live Payment Link yet falls back to Contact — a real,
                working destination now that this page no longer renders
                <NewsletterSection> (2026-09-16, terminación plana) — rather
                than a dead checkout, but still reads as the intended action
                (see Events for the same pattern). */}
            <a className="btn btn-primary plan__cta" href={joinHref || "/contact"}>
              {ctaLabel || "Join my talks"}
            </a>
            <p className="plan__note">Secure checkout · 7-day free trial</p>
          </div>
        </Reveal>
      </section>

      <section className="section wrap" id="faq">
        <Reveal className="section-heading section-heading--center">
          <p className="eyebrow">FAQ</p>
          <h2>Frequently Asked Questions</h2>
        </Reveal>
        <Accordion
          items={faqs.length ? faqs : FAQ_FALLBACK}
          className="accordion--flat accordion--narrow"
        />
      </section>
    </>
  );
}
