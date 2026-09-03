import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { env } from "@/lib/env";
import { useSection, SECTION } from "@/lib/sections";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";

type Status = "idle" | "sending" | "done" | "error";

/**
 * "Join Our Newsletter" — the warm-gradient block that closes most pages of the
 * design, and the one piece of the retired landing that keeps its behaviour:
 * the same double opt-in against `POST /api/public/newsletter/subscribe`, whose
 * confirmation links still land on /newsletter/confirmed|error.
 *
 * The designer marks Newsletter as one of the two places where the background
 * gradient should move most, hence `intensity="strong"`.
 */
export function NewsletterSection() {
  const section = useSection(SECTION.newsletter, {
    title: "Join Our Newsletter",
    paragraphs: [
      "Receive insights, upcoming event announcements, and healing wisdom from Dr. Dietrich Klinghardt™ directly to your inbox.",
    ],
  });

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const closeButton = useRef<HTMLButtonElement>(null);

  const closeFeedback = () => {
    setStatus("idle");
    setMessage("");
  };

  useEffect(() => {
    if (status !== "done" && status !== "error") return;
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeFeedback();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);

    // Honeypot: bots fill every field, people never see this one.
    if (values.get("website")) {
      setStatus("done");
      return;
    }
    if (!env.TENANT_ID || !env.SITE_ID) {
      setMessage("The newsletter is not configured yet. Please try again later.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch(`${env.API_URL}/api/public/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: env.TENANT_ID,
          siteId: env.SITE_ID,
          firstName: String(values.get("firstName") ?? "").trim(),
          lastName: String(values.get("lastName") ?? "").trim(),
          email: String(values.get("email") ?? "").trim(),
        }),
      });
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          error?: { message?: string };
        } | null;
        throw new Error(
          result?.error?.message || "We could not complete your registration.",
        );
      }
      form.reset();
      setStatus("done");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not complete your registration. Please try again.",
      );
      setStatus("error");
    }
  }

  return (
    <AnimatedGradient
      id="newsletter"
      variant="plain"
      intensity="strong"
      className="newsletter"
    >
      <div className="wrap newsletter__inner">
        <Reveal>
          <p className="eyebrow">Stay connected</p>
          <h2>{section.title}</h2>
          {section.lead ? <p className="newsletter__lead">{section.lead}</p> : null}

          <form className="newsletter__form" onSubmit={submit}>
            <div className="newsletter__row">
              <label>
                <span className="sr-only">First name</span>
                <input name="firstName" autoComplete="given-name" placeholder="First Name" required />
              </label>
              <label>
                <span className="sr-only">Last name</span>
                <input name="lastName" autoComplete="family-name" placeholder="Last Name" required />
              </label>
            </div>
            <label>
              <span className="sr-only">Email address</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email Address"
                required
              />
            </label>
            <label className="newsletter__honeypot" aria-hidden="true">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <button className="btn btn-primary" disabled={status === "sending"}>
              {status === "sending" ? "Joining…" : "Join now"}
            </button>
            <p className="newsletter__note">No spam. Unsubscribe at any time.</p>
          </form>
        </Reveal>
      </div>

      {/* Portalled to <body>: <main> carries `isolation: isolate` for its
          gradient-drift underlay (shell.css), which traps this dialog's
          z-index inside main's own stacking context — the footer, painting
          right after main in DOM order, then rendered over the bottom of the
          backdrop instead of under it whenever the footer was in view. */}
      {(status === "done" || status === "error") &&
        createPortal(
          <div
            className="feedback-backdrop"
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) closeFeedback();
            }}
          >
            <section
              className={`feedback-dialog ${status}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="newsletter-feedback-title"
            >
              <button
                ref={closeButton}
                className="feedback-close"
                type="button"
                onClick={closeFeedback}
                aria-label="Close message"
              >
                ×
              </button>
              <span className="feedback-mark" aria-hidden="true">
                {status === "done" ? "✓" : "!"}
              </span>
              <p className="eyebrow">Klinghardt Newsletter</p>
              <h2 id="newsletter-feedback-title">
                {status === "done" ? "Registration received." : "Something went wrong."}
              </h2>
              <p>
                {status === "done"
                  ? "Thank you. Check your inbox and confirm your email to complete your subscription."
                  : message}
              </p>
              <button className="btn btn-primary" type="button" onClick={closeFeedback}>
                {status === "done" ? "Got it" : "Try again"}
              </button>
            </section>
          </div>,
          document.body,
        )}
    </AnimatedGradient>
  );
}
