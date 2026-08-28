import { useEffect } from "react";
import { Head } from "vite-react-ssg";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "@/lib/cart";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Where Stripe Checkout returns after a cart purchase.
 *
 * Deliberately does NOT claim the payment succeeded. All this page has is a
 * session id in the URL, and a URL parameter is not evidence that money moved —
 * the tenant's webhook is what confirms the charge and sends the access email.
 * So the copy speaks about what the shopper will receive, not about what
 * definitely happened.
 *
 * The cart is emptied on arrival: Stripe only sends the shopper here after the
 * session completes, and leaving a paid basket in place invites a second
 * purchase of the same thing.
 */
export function CartReturnPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const { clear, count } = useCart();

  useEffect(() => {
    if (sessionId && count) clear();
  }, [sessionId, count, clear]);

  return (
    <>
      <Head>
        <title>Thank you — Dr. Dietrich Klinghardt™</title>
        <meta name="robots" content="noindex" />
      </Head>

      <AnimatedGradient variant="page" intensity="soft" className="status-page">
        <div className="wrap status-page__inner">
          <Reveal>
            <span className="status-icon success" aria-hidden="true">
              ✓
            </span>
            <p className="eyebrow">Klinghardt Store</p>
            <h1>{sessionId ? "Thank you for your order." : "Nothing to show here."}</h1>
            <p className="lead">
              {sessionId
                ? "Your confirmation is on its way by email. Anything downloadable arrives with it; anything physical ships to the address you gave Stripe."
                : "This page is where Stripe returns you after a purchase. There is no order to confirm."}
            </p>
            <div className="status-page__actions">
              <Link className="btn btn-primary" to="/store">
                Back to the store
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
