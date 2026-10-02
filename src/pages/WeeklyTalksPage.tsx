import { useEffect, useState } from "react";
import { Seo } from "@/components/Seo";
import { useCollection, text, number } from "@/lib/content";
import { useSection, useRecords, SECTION } from "@/lib/sections";
import { eventLongDate, splitByTime } from "@/lib/format";
import { calendarHref } from "@/lib/calendar";
import { env } from "@/lib/env";
import { useAuth } from "@/features/auth/useAuth";
import {
  fetchMembershipStatus,
  openMembershipPortal,
  startMembershipCheckout,
  type MembershipStatus,
} from "@/lib/membership";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { EventMetaIcon } from "@/components/Icons";
import { Accordion } from "@/components/sections/Accordion";

/** "2500" cents + "usd" → "$25". Whole-dollar plans only (none of DKK's are cents-precise). */
function formatPlanPrice(cents: number, currency: string): string {
  const amount = cents / 100;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
  return formatted;
}

/**
 * Benefits list shown on every plan card. Not plan-specific data in the
 * membership_plans schema (title/description/interval/price only), so it
 * stays a shared CMS-editable row rather than per-plan content.
 */
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

  const benefits = useRecords("weekly-talks-benefits", 1, BENEFITS_FALLBACK);

  // Real membership plans (Stripe-backed), published for this site, cheapest
  // interval first — replaces the old hardcoded price/CTA page-contents rows.
  const plans = [...useCollection("membership-plans")].sort(
    (a, b) => number(a, "order") - number(b, "order"),
  );

  const { status: authStatus, signIn } = useAuth();
  const [checkoutState, setCheckoutState] = useState<
    Record<string, "idle" | "loading" | "error">
  >({});

  // The member's current plan, so an already-subscribed interval shows
  // "Subscribed" instead of a Join button that would double-charge them.
  const [membership, setMembership] = useState<MembershipStatus | null>(null);
  useEffect(() => {
    if (authStatus !== "authenticated") {
      setMembership(null);
      return;
    }
    let cancelled = false;
    fetchMembershipStatus()
      .then((result) => {
        if (!cancelled) setMembership(result);
      })
      .catch(() => {
        // Non-fatal here — worst case the Join button stays active and
        // create-checkout-session itself blocks a duplicate subscription.
      });
    return () => {
      cancelled = true;
    };
  }, [authStatus]);

  const subscribedInterval =
    membership?.active && membership.planKey === "annual"
      ? "year"
      : membership?.active && membership.planKey === "monthly"
        ? "month"
        : null;

  // Site-wide: one active membership at a time (the backend's own rule —
  // create-checkout-session 409s "already have an active membership on this
  // site" for ANY plan once one is active). So a signed-in member looking at
  // a plan that ISN'T theirs can't start a second checkout; the Billing
  // Portal is where they actually change plans (Stripe's own "Update
  // subscription" flow, already enabled on this account, proration and all)
  // — generalizes to however many plans/intervals exist later, no new
  // backend endpoint needed.
  //
  // Per-card, not a single flag: "active elsewhere" means active AND not
  // this card's own interval (the bug this replaced compared against
  // subscribedInterval being falsy, which is never true once subscribed).
  const isOtherActivePlan = (interval: string) =>
    Boolean(membership?.active) && subscribedInterval !== interval;

  const handleJoin = (planId: string) => {
    if (authStatus !== "authenticated") {
      signIn("/weekly-talks");
      return;
    }
    setCheckoutState((s) => ({ ...s, [planId]: "loading" }));
    startMembershipCheckout(planId, "/weekly-talks").catch(() => {
      setCheckoutState((s) => ({ ...s, [planId]: "error" }));
    });
  };

  const handleSwitch = (planId: string) => {
    setCheckoutState((s) => ({ ...s, [planId]: "loading" }));
    openMembershipPortal().catch(() => {
      setCheckoutState((s) => ({ ...s, [planId]: "error" }));
    });
  };

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
              {/* Scrolls to the real plan cards below — pricing/checkout
                  lives in one place (membership_plans), not duplicated here. */}
              <a className="btn btn-primary" href="#pricing">
                Join now
              </a>
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

        {authStatus === "authenticated" ? (
          <p className="plan-status-note">
            {!membership ? (
              "Checking your membership…"
            ) : membership.active ? (
              <>
                You're subscribed to the{" "}
                <strong>
                  {text(
                    plans.find((p) => text(p, "interval") === subscribedInterval),
                    "title",
                    "Membership",
                  )}
                </strong>{" "}
                plan
                {membership.cancelAtPeriodEnd ? (
                  <>
                    {" "}
                    — ends on{" "}
                    {membership.currentPeriodEnd
                      ? new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(new Date(membership.currentPeriodEnd))
                      : "the end of this period"}{" "}
                    and won't renew.
                  </>
                ) : membership.status === "past_due" ? (
                  <> — your last payment failed. Update your payment method to avoid losing access.</>
                ) : membership.currentPeriodEnd ? (
                  <>
                    , renews on{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(membership.currentPeriodEnd))}
                    .
                  </>
                ) : (
                  "."
                )}
              </>
            ) : (
              "You don't have an active membership yet."
            )}
          </p>
        ) : null}

        <div className="plan-grid">
          {plans.length ? (
            plans.map((plan, index) => {
              const planId = String(plan.id);
              const interval = text(plan, "interval");
              const state = checkoutState[planId] ?? "idle";
              return (
                <Reveal className="plan" delay={90 + index * 50} key={planId}>
                  <div className="plan__head">
                    <p className="eyebrow">{text(plan, "title")}</p>
                    <p className="plan__price">
                      <span className="plan__amount">
                        {formatPlanPrice(number(plan, "price"), text(plan, "currency", "usd"))}
                      </span>
                      <span className="plan__period">{interval === "year" ? "/ year" : "/ month"}</span>
                    </p>
                    <p className="plan__terms">{text(plan, "description")}</p>
                  </div>

                  <div className="plan__body">
                    <ul className="tick-list plan__benefits">
                      {benefits.map(([benefit]) => (
                        <li key={benefit}>{benefit}</li>
                      ))}
                    </ul>

                    {subscribedInterval === interval ? (
                      <button type="button" className="btn btn-primary plan__cta" disabled>
                        Subscribed
                      </button>
                    ) : isOtherActivePlan(interval) ? (
                      <button
                        type="button"
                        className="btn btn-primary plan__cta"
                        onClick={() => handleSwitch(planId)}
                        disabled={state === "loading"}
                      >
                        {state === "loading" ? "Opening…" : "Switch to this plan"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary plan__cta"
                        onClick={() => handleJoin(planId)}
                        disabled={state === "loading"}
                      >
                        {state === "loading" ? "Redirecting…" : "Join my talks"}
                      </button>
                    )}
                    {subscribedInterval === interval ? (
                      <p className="plan__note">You're subscribed to this plan.</p>
                    ) : state === "error" ? (
                      <p className="plan__note" style={{ color: "var(--error)" }}>
                        {isOtherActivePlan(interval)
                          ? "We could not open the membership portal. Please try again."
                          : "We could not start checkout. Please try again."}
                      </p>
                    ) : isOtherActivePlan(interval) ? (
                      <p className="plan__note">Manage your plan change in the billing portal.</p>
                    ) : (
                      <p className="plan__note">
                        Secure checkout · {interval === "year" ? "cancel anytime" : "7-day free trial"}
                      </p>
                    )}
                  </div>
                </Reveal>
              );
            })
          ) : (
            <Reveal className="plan">
              <div className="plan__body">
                <p className="plan__terms">
                  Membership plans are being set up. Please check back soon, or{" "}
                  <a href="/contact">contact us</a> for details.
                </p>
              </div>
            </Reveal>
          )}
        </div>
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
