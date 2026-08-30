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

      <AnimatedGradient variant="card" intensity="strong" className="hero hero--split">
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
                they are not repeated here. */}
            <div className="hero__actions">
              {joinHref ? (
                <a className="btn btn-light" href={joinHref}>
                  {ctaLabel || "Join now"}
                </a>
              ) : (
                <a className="btn btn-light" href="#pricing">
                  See the membership
                </a>
              )}
              {nextLive ? (
                <Link className="btn btn-ghost" to={`/weekly-talks/live/${String(nextLive.id)}`}>
                  Watch the live
                </Link>
              ) : null}
            </div>
          </Reveal>

          {/* The live session as it actually looks, which is what the design
              puts beside this copy — a membership is easier to picture than to
              describe. */}
          <Reveal className="hero__aside" delay={120}>
            <img
              src="/images/weekly-talks-live.webp"
              alt="A live Weekly Talk session with Dr. Klinghardt"
              width={388}
              height={277}
              loading="lazy"
              decoding="async"
            />
          </Reveal>
        </div>
      </AnimatedGradient>

      {/* Next live session, on its own band as the frame places it. */}
      {nextLive ? (
        <section className="section wrap">
          <Reveal className="next-live">
            <p className="eyebrow">Next live talk</p>
            <p className="next-live__when">{eventLongDate(nextLive)}</p>
            {addToCalendar ? (
              <a className="arrow-link" href={addToCalendar} download="weekly-talk.ics">
                Add to calendar <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </Reveal>
        </section>
      ) : null}

      <section className="section wrap">
        <Reveal className="prose">
          {page.paragraphs.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Reveal>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────── */}
      <section className="section wrap" id="pricing">
        <Reveal className="section-heading section-heading--center">
          <p className="eyebrow">Pricing</p>
          <h2>Learn, Connect, Grow Together</h2>
        </Reveal>

        <Reveal className="plan" delay={90}>
          <p className="eyebrow">{planLabel}</p>
          <p className="plan__price">
            <span className="plan__amount">{planAmount}</span>
            <span className="plan__period">{planPeriod}</span>
          </p>
          <p className="plan__terms">{planTerms}</p>

          <ul className="tick-list plan__benefits">
            {benefits.map(([benefit]) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>

          {joinHref ? (
            <a className="btn btn-primary plan__cta" href={joinHref}>
              {ctaLabel || "Join my talks"}
            </a>
          ) : (
            /* No live Payment Link, so no button that cannot charge — the same
               rule the rest of the site follows. */
            <a className="btn btn-light plan__cta" href="#newsletter">
              Get notified when it opens
            </a>
          )}
          <p className="plan__note">Secure checkout · 7-day free trial</p>
        </Reveal>
      </section>

      <section className="section wrap" id="faq">
        <Reveal className="section-heading section-heading--center">
          <p className="eyebrow">FAQ</p>
          <h2>Frequently Asked Questions</h2>
        </Reveal>
        <Accordion items={faqs.length ? faqs : FAQ_FALLBACK} />
      </section>

      <NewsletterSection />
    </>
  );
}
