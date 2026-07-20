import { useEffect, useRef, useState, type FormEvent } from "react";
import { env } from "@/lib/env";

type Status = "idle" | "sending" | "done" | "error";

interface NewsletterFormProps {
  consentLines: string[];
}

export function NewsletterForm({ consentLines }: NewsletterFormProps) {
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
        const result = await response.json().catch(() => null) as {
          error?: { message?: string };
        } | null;
        throw new Error(result?.error?.message || "We could not complete your registration.");
      }
      form.reset();
      setStatus("done");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We could not complete your registration. Please try again.");
      setStatus("error");
    }
  }

  return (
    <>
      <form className="newsletter-form" onSubmit={submit}>
        <div className="name-fields">
          <label><span className="sr-only">First Name</span><input name="firstName" autoComplete="given-name" placeholder="First Name" required /></label>
          <label><span className="sr-only">Last Name</span><input name="lastName" autoComplete="family-name" placeholder="Last Name" required /></label>
        </div>
        <label><span className="sr-only">Email Address</span><input name="email" type="email" autoComplete="email" placeholder="Email Address" required /></label>
        <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Subscribing…" : "Subscribe"}</button>
        <p className="consent">
          {consentLines.map((line, index) => (
            <span key={`${line}-${index}`}>{index > 0 && <br />}{line}</span>
          ))}
        </p>
      </form>

      {(status === "done" || status === "error") && (
        <div className="feedback-backdrop" onMouseDown={(event) => {
          if (event.currentTarget === event.target) closeFeedback();
        }}>
          <section
            className={`feedback-dialog ${status}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            aria-describedby="feedback-message"
          >
            <button ref={closeButton} className="feedback-close" type="button" onClick={closeFeedback} aria-label="Close message">×</button>
            <span className="feedback-mark" aria-hidden="true">{status === "done" ? "✓" : "!"}</span>
            <p className="eyebrow">Klinghardt Newsletter</p>
            <h2 id="feedback-title">{status === "done" ? "Registration received." : "Something went wrong."}</h2>
            <p id="feedback-message">
              {status === "done"
                ? "Thank you. Check your inbox and confirm your email to complete your subscription."
                : message}
            </p>
            <button className="feedback-action" type="button" onClick={closeFeedback}>
              {status === "done" ? "Got it" : "Try again"}
            </button>
          </section>
        </div>
      )}
    </>
  );
}
