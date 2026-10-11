import { useEffect } from "react";
import { Seo } from "@/components/Seo";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useCart } from "@/lib/cart";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";

/**
 * "Thank you for your purchase" — where every purchase lands after Stripe:
 *   - /cart/return            cart checkout (the API's success_url),
 *   - /thank-you?kind=membership  membership checkout,
 *   - /thank-you?kind=event|product  single items: Payment Links (their
 *     after-completion redirect) and checkouts in another currency.
 *
 * Deliberately does NOT claim the payment succeeded. All this page has is a
 * session id in the URL, and a URL parameter is not evidence that money moved —
 * the tenant's webhook is what confirms the charge, sends the access email and
 * activates a membership. So the copy speaks about what the buyer will
 * receive, not about what definitely happened.
 *
 * The cart is emptied on a cart return: Stripe only sends the shopper there
 * after the session completes, and leaving a paid basket in place invites a
 * second purchase of the same thing.
 */

type Kind = "cart" | "membership" | "event" | "product";

const COPY: Record<Kind, { eyebrow: string; title: string; lead: string; back: { label: string; to: string } }> = {
  cart: {
    eyebrow: "Klinghardt Store",
    title: "Thank you for your order.",
    lead: "Your confirmation is on its way by email. Anything downloadable arrives with it; anything physical ships to the address you gave at checkout.",
    back: { label: "Back to the store", to: "/store" },
  },
  membership: {
    eyebrow: "Weekly Talks membership",
    title: "Thank you for joining.",
    lead: "Your membership activates as soon as the payment is confirmed — usually within a minute — and a confirmation is on its way by email. Sign in with the same account to watch the weekly talks live and explore the Archives.",
    back: { label: "Go to Weekly Talks", to: "/weekly-talks" },
  },
  event: {
    eyebrow: "Thank you",
    title: "Thank you for your purchase.",
    lead: "Your confirmation is on its way by email, with everything you need for the event.",
    back: { label: "See all events", to: "/events" },
  },
  product: {
    eyebrow: "Thank you",
    title: "Thank you for your purchase.",
    lead: "Your confirmation is on its way by email. Anything downloadable arrives with it.",
    back: { label: "Back to the store", to: "/store" },
  },
};

function kindOf(pathname: string, kind: string | null): Kind {
  if (pathname.startsWith("/cart/")) return "cart";
  return kind === "membership" || kind === "event" || kind === "product" || kind === "cart"
    ? kind
    : "product";
}

export function ThankYouPage() {
  const [params] = useSearchParams();
  const { pathname } = useLocation();
  // `checkout` is the Stripe session id; `session_id` is its old name (the
  // host's WAF answers 403 to that parameter without a Referer, so the API
  // no longer sends it).
  const sessionId = params.get("checkout") ?? params.get("session_id");
  const kind = kindOf(pathname, params.get("kind"));
  const copy = COPY[kind];
  const { clear, count } = useCart();

  useEffect(() => {
    if (kind === "cart" && sessionId && count) clear();
  }, [kind, sessionId, count, clear]);

  return (
    <>
      <Seo title={"Thank you — Dr. Dietrich Klinghardt™"} noindex />

      <AnimatedGradient variant="plain" intensity="soft" className="status-page">
        <div className="wrap status-page__inner">
          <Reveal>
            <span className="status-icon success" aria-hidden="true">
              ✓
            </span>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{sessionId ? copy.title : "Nothing to show here."}</h1>
            <p className="lead">
              {sessionId
                ? copy.lead
                : "This page is where you return after a purchase. There is no order to confirm."}
            </p>
            <div className="status-page__actions">
              <Link className="btn btn-primary" to={copy.back.to}>
                {copy.back.label}
              </Link>
              <Link className="btn btn-outline" to="/">
                Home
              </Link>
            </div>
          </Reveal>
        </div>
      </AnimatedGradient>
    </>
  );
}
