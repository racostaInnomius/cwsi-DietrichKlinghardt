import { useEffect, useRef, useState, type RefObject } from "react";
import { Link } from "react-router-dom";
import { ReadMoreText } from "@/components/ReadMoreText";
import { Seo } from "@/components/Seo";
import { useCollection, text, number } from "@/lib/content";
import { useSection, useCardList, SECTION } from "@/lib/sections";
import {
  eventLongDate,
  eventTimeLabel,
  splitByTime,
  weeklyTalkStatus,
} from "@/lib/format";
import { calendarHref } from "@/lib/calendar";
import { env } from "@/lib/env";
import { useAuth } from "@/features/auth/useAuth";
import {
  fetchMembershipStatus,
  openMembershipPortal,
  startMembershipCheckout,
  type MembershipStatus,
} from "@/lib/membership";
import { readStoredMuxLiveToken } from "@/lib/muxLive";
import { CurrencyNote, useCurrency } from "@/lib/currency";
import { useLiveTalkSession } from "@/lib/useLiveTalkSession";
import { useNextWeeklyTalk } from "@/lib/useNextWeeklyTalk";
import { LiveTalkStage } from "@/components/live/LiveTalkStage";
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

/* The benefits on every plan card are cards of the "weekly-talks-benefits"
   Page Contents block (one card per benefit, title only, reorderable; copy in
   src/data/blocks.ts until the row has it). Not plan-specific data in the
   membership_plans schema, so a shared block rather than per-plan content. */

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
  const page = useSection(SECTION.weeklyTalks);
  const pricing = useSection("weekly-talks-pricing");
  const faqHeading = useSection("weekly-talks-faq");
  const faqPin = useRef<HTMLDivElement | null>(null);
  const faqCard = useRef<HTMLElement | null>(null);
  useFaqPin(faqPin, faqCard);

  // Read early: the next-live poll below needs to wait for this to settle
  // before its first request (see nextLiveSession).
  const { status: authStatus, signIn } = useAuth();

  // The next live session, taken from the events the CMS already publishes.
  // `liveMode` is the CMS select with values "none" | "mux" — only "mux"
  // means this event actually streams. Free or members-only, whichever comes
  // first (client, 2026-10-16); the chip says which kind it is.
  const nextLive = useNextWeeklyTalk();
  const addToCalendar = calendarHref(nextLive, {
    url: `${env.SITE_URL}/weekly-talks`,
  });

  // The standing free talk: an "open" (no-charge) event wired to Mux Live.
  // Whichever one the CMS publishes is embedded directly in the hero — no
  // extra "evergreen" flag needed, "open" + liveMode already says "anyone
  // can watch". Picks the event already in progress first; otherwise the
  // soonest one, so the hero shows whichever free talk is most relevant.
  const freeEvents = splitByTime(
    useCollection("events").filter(
      (event) =>
        event.liveMode === "mux" && text(event, "registrationType", "open") === "open",
    ),
  );
  const freeEvent = freeEvents.upcoming[0] ?? freeEvents.past[0];
  const { session: freeSession } = useLiveTalkSession(
    freeEvent ? String(freeEvent.id) : "",
    undefined,
    Boolean(freeEvent),
  );
  const freeTalkIsLive = freeSession?.mode === "live" && Boolean(freeSession.playbackId && freeSession.tokens);

  // The next talk's own live state, polled the same way, so the "Live Now"
  // badge appears the instant the broadcast actually starts rather than just
  // whenever the scheduled time has passed. When the next talk is the free
  // one already playing in the hero, its poll is reused instead of a second.
  const nextLiveIsGated = Boolean(nextLive) && text(nextLive, "registrationType", "open") !== "open";
  const nextLiveIsHeroTalk =
    Boolean(nextLive) && !nextLiveIsGated && Boolean(freeEvent) && String(freeEvent?.id) === String(nextLive?.id);
  // Waits for authStatus to leave "loading": the access token lives in
  // memory only and is refreshed from the stored refresh token on mount, so
  // polling immediately would send an unauthenticated request — a
  // membership event returns 403, not 401, so authedFetch's retry-on-401
  // never recovers it, and a signed-in member would see the wrong state.
  const pollNextLive = Boolean(nextLive) && !nextLiveIsHeroTalk;
  const { session: nextLiveSession, error: nextLiveError } = useLiveTalkSession(
    nextLive && pollNextLive ? String(nextLive.id) : "",
    nextLive && nextLiveIsGated ? readStoredMuxLiveToken(String(nextLive.id)) ?? undefined : undefined,
    pollNextLive && (!nextLiveIsGated || authStatus !== "loading"),
    true,
  );
  // A visitor without access still gets `error.mode` from the gate (see
  // publicMuxLiveHandler), so this status is useful before they enter the
  // gated room too. See weeklyTalkStatus for when "waiting" is shown.
  const nextLiveStatus = weeklyTalkStatus(
    nextLive,
    nextLiveIsHeroTalk ? freeSession?.mode : (nextLiveSession?.mode ?? nextLiveError?.mode),
    nextLiveIsHeroTalk ? freeSession?.status : nextLiveSession?.status,
  );

  const benefits = useCardList("weekly-talks-benefits", 1, ([title]) => ({ icon: "", title, body: "" })).cards;

  // Real membership plans (Stripe-backed), published for this site, cheapest
  // interval first — replaces the old hardcoded price/CTA page-contents rows.
  const plans = [...useCollection("membership-plans")].sort(
    (a, b) => number(a, "order") - number(b, "order"),
  );

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

  // The header's currency selector, same as physical products: plan prices
  // show converted, and checkout subscribes in that currency.
  const { selected: displayCurrency, convert } = useCurrency();

  const handleJoin = (planId: string, planCurrency: string) => {
    if (authStatus !== "authenticated") {
      signIn("/weekly-talks");
      return;
    }
    setCheckoutState((s) => ({ ...s, [planId]: "loading" }));
    const currency =
      displayCurrency && displayCurrency !== planCurrency.toLowerCase() ? displayCurrency : undefined;
    startMembershipCheckout(planId, "/weekly-talks", currency).catch(() => {
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
            {page.eyebrow ? <p className="eyebrow hero__eyebrow"><Marked text={page.eyebrow} /></p> : null}
            <h1 className="display-xl"><Marked text={page.title} /></h1>
            {/* The frame sets this line in the display face, a size down from
                the heading — a subtitle, not body copy. */}
            {page.subtitle ? (
              <p className="hero__subtitle">
                <Marked text={page.subtitle} />
              </p>
            ) : null}
            {page.lead ? <ReadMoreText className="hero__lead" text={page.lead} /> : null}
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

          {/* When a free talk is actually live, it plays right here instead
              of the picture — the box itself never changes size either way
              (sophia_hero_dimension), LiveTalkStage just fills it. */}
          <Reveal className="hero__aside" delay={120}>
            {freeTalkIsLive ? (
              <div className="hero__live-embed">
                <LiveTalkStage session={freeSession} error={null} compact />
              </div>
            ) : (
              <img
                className="live-shot"
                src="/images/weekly-talks-live-2026.webp"
                alt="Dr. Klinghardt live on a Weekly Talk"
                width={1004}
                height={704}
                decoding="async"
              />
            )}
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
              <span className="next-live__chip-dot" aria-hidden="true" />{" "}
              {nextLiveIsGated ? "Members live talk" : "Free live talk"}
            </span>
            <p className="next-live__when" aria-live="polite">
              {eventLongDate(nextLive)}
              {eventTimeLabel(nextLive) ? (
                <span className="next-live__time"> · {eventTimeLabel(nextLive)}</span>
              ) : null}
              {nextLiveStatus && nextLiveIsGated ? (
                <Link
                  className={`live-now-badge live-now-badge--${nextLiveStatus.tone}`}
                  to={`/weekly-talks/live/${nextLive.id}`}
                >
                  <span className="live-now-badge__dot" aria-hidden="true" />
                  {nextLiveStatus.label}
                </Link>
              ) : nextLiveStatus ? (
                // A free talk already plays in this page's hero: a status, not a link.
                <span className={`live-now-badge live-now-badge--${nextLiveStatus.tone}`}>
                  <span className="live-now-badge__dot" aria-hidden="true" />
                  {nextLiveStatus.label}
                </span>
              ) : null}
            </p>
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
          {pricing.eyebrow ? <p className="eyebrow"><Marked text={pricing.eyebrow} /></p> : null}
          <h2><Marked text={pricing.title} /></h2>
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
              const planCurrency = text(plan, "currency", "usd");
              const planPrice = number(plan, "price");
              const converted = convert(planPrice, planCurrency);
              return (
                <Reveal className="plan" delay={90 + index * 50} key={planId}>
                  <div className="plan__head">
                    <p className="eyebrow">{text(plan, "title")}</p>
                    <p className="plan__price">
                      {converted ? (
                        <span
                          className="plan__amount"
                          title={`Converted from ${formatPlanPrice(planPrice, planCurrency)} ${planCurrency.toUpperCase()}`}
                        >
                          ≈ {formatPlanPrice(Math.round(converted.cents / 100) * 100, converted.currency)}
                        </span>
                      ) : (
                        <span className="plan__amount">{formatPlanPrice(planPrice, planCurrency)}</span>
                      )}
                      <span className="plan__period">{interval === "year" ? "/ year" : "/ month"}</span>
                    </p>
                    <p className="plan__terms">{text(plan, "description")}</p>
                    <CurrencyNote currency={planCurrency} charge="selected" className="plan__currency-note" />
                  </div>

                  <div className="plan__body">
                    <ul className="tick-list plan__benefits">
                      {benefits.map((benefit, index) => (
                        <li key={`${index}-${benefit.title}`}><Marked text={benefit.title} /></li>
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
                        onClick={() => handleJoin(planId, planCurrency)}
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

      {/* Client (2026-10-22): the FAQ closes the page with the newsletter's own
          pinned amber→navy effect (this page has no newsletter): the section
          holds on screen while its background slides down to the footer's
          navy and its text turns white. See useFaqPin below. */}
      <div className="faq-pin" ref={faqPin}>
        <section className="faq-pin__card" id="faq" ref={faqCard}>
          <div className="section wrap">
            <Reveal className="section-heading section-heading--center">
              {faqHeading.eyebrow ? <p className="eyebrow"><Marked text={faqHeading.eyebrow} /></p> : null}
              <h2><Marked text={faqHeading.title} /></h2>
            </Reveal>
            <Accordion
              items={faqs.length ? faqs : FAQ_FALLBACK}
              className="accordion--flat accordion--narrow"
            />
          </div>
        </section>
        <div className="faq-pin__dwell" aria-hidden="true" />
      </div>
    </>
  );
}

/**
 * The FAQ's pin, same rig as NewsletterSection's: --faq-scroll is the card's
 * 0→1 progress through its dwell (the 100vh spacer after it), which
 * sections.css reads to slide the card's oversized background and blend its
 * text toward white. Unlike the newsletter the card's height changes (answers
 * open), so when it is taller than the screen it sticks by its bottom edge
 * (--faq-pin-top < 0) and no answer is ever cut off.
 */
function useFaqPin(
  wrapperRef: RefObject<HTMLDivElement | null>,
  cardRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    let frame: number;
    function raf() {
      const wrapper = wrapperRef.current;
      const card = cardRef.current;
      if (wrapper && card) {
        const cardHeight = card.offsetHeight;
        const top = Math.min(0, window.innerHeight - cardHeight);
        const dwell = wrapper.offsetHeight - cardHeight;
        const progress =
          dwell > 0 ? Math.min(1, Math.max(0, (top - wrapper.getBoundingClientRect().top) / dwell)) : 0;
        card.style.setProperty("--faq-pin-top", `${top}px`);
        card.style.setProperty("--faq-scroll", String(progress));
      }
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(frame);
  }, [wrapperRef, cardRef]);
}
