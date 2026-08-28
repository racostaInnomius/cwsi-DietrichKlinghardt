import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Landing pages for the newsletter double opt-in links.
 *
 * These two URLs are load-bearing: confirmation emails already delivered point
 * at /newsletter/confirmed and /newsletter/error, so the routes survive every
 * redesign. Only the styling moved into the new shell.
 */
export function SubscriptionStatusPage({ success }: { success: boolean }) {
  return (
    <>
      <Seo
        title={success
            ? "You’re subscribed — Dr. Dietrich Klinghardt™"
            : "Link no longer valid — Dr. Dietrich Klinghardt™"}
        noindex
      />

      <AnimatedGradient variant="page" intensity="soft" className="status-page">
        <div className="wrap status-page__inner">
          <Reveal>
            <span
              className={`status-icon ${success ? "success" : "error"}`}
              aria-hidden="true"
            >
              {success ? "✓" : "!"}
            </span>
            <p className="eyebrow">Klinghardt Newsletter</p>
            <h1>{success ? "You’re subscribed." : "This link is no longer valid."}</h1>
            <p className="lead">
              {success
                ? "Thank you for confirming your email. You’ll now receive our latest events, research updates and webinar invitations."
                : "The confirmation link may have expired or already been used. You can return to the signup form and request a new one."}
            </p>
            <Link className="btn btn-primary" to={success ? "/" : "/#newsletter"}>
              {success ? "Return home" : "Try again"}
            </Link>
          </Reveal>
        </div>
      </AnimatedGradient>
    </>
  );
}
