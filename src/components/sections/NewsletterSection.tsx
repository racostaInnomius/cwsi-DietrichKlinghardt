import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { env } from "@/lib/env";
import { useSection, SECTION } from "@/lib/sections";
import { themeForPath } from "@/components/shell/navigation";
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
 * should read as visibly alive (2026-09-04, alongside the hero and Shop) —
 * `#newsletter`'s radial glow in sections.css is what actually delivers that;
 * `intensity` only ever did anything on the `card`/`card-warm` variants this
 * section doesn't use, so the old `intensity="strong"` here was dead.
 *
 * Client (2026-09-10, on the footer fade): "no se ve el mismo estilo y
 * efecto en el scroll... revisa a profundidad el home y aplicalo a la parte
 * baja de las paginas internas" — Home's fade isn't a static gradient, it's
 * HomePage.tsx pinning this section (position: sticky inside a 200vh
 * wrapper) and sliding its background from amber to navy as the pin plays
 * out, so it lands on the exact navy the footer opens on. Every internal DK
 * page renders this same component, so the pin lives HERE instead of being
 * wired into eight separate page files — Home keeps doing its own thing
 * (HomePage.tsx already wraps it in .home-newsletter-pin with its own
 * baby-blue-opening gradient tied to the hero's scroll rig), so this only
 * self-pins on every OTHER Dietrich Klinghardt page. Sophia is excluded too
 * — its own theme never asked for this, and the amber/navy journey is a DK
 * colour story.
 */
export function NewsletterSection() {
  const { pathname } = useLocation();
  const isPinned = pathname !== "/" && themeForPath(pathname) === "dk";

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

  // Same rig as HomePage.tsx's own hero/newsletter pins: --newsletter-scroll
  // is the pinned card's 0→1 progress through its dwell (wrapper height
  // minus the sticky card's own height), read by sections.css to slide the
  // card's oversized background and blend its text toward white. Global
  // querySelector, not a ref, for the same reason Home's own version uses
  // it — there is only ever one #newsletter section on screen.
  useEffect(() => {
    if (!isPinned) return;
    let frame: number;
    function raf() {
      const wrapper = document.querySelector<HTMLElement>(".newsletter-pin");
      const card = document.querySelector<HTMLElement>(".newsletter-pin .plain-section.newsletter");
      if (wrapper && card) {
        const dwell = wrapper.getBoundingClientRect().height - card.getBoundingClientRect().height;
        const progress = dwell > 0 ? Math.min(1, Math.max(0, -wrapper.getBoundingClientRect().top / dwell)) : 0;
        card.style.setProperty("--newsletter-scroll", String(progress));
      }
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(frame);
  }, [isPinned]);

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

  const content = (
    <AnimatedGradient
      id="newsletter"
      variant="plain"
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

  return isPinned ? <div className="newsletter-pin">{content}</div> : content;
}
