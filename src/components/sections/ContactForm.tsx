import { useState, type FormEvent } from "react";
import { env } from "@/lib/env";

type Status = "idle" | "sending" | "done" | "error";

/**
 * Enquiry form for the Sophia pages, posting to the same
 * `POST /api/public/contact` the other Beytrax tenant sites use (tenant + site
 * scoped, rate limited by IP, stored and emailed to the operations address).
 *
 * `subject` carries which page the message came from, so the clinic can tell a
 * new-patient enquiry from a general one without reading the body first.
 */
export function ContactForm({ subject }: { subject: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);

    if (values.get("website")) {
      setStatus("done");
      return;
    }
    if (!env.TENANT_ID || !env.SITE_ID) {
      setMessage("The form is not configured yet. Please email us instead.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch(`${env.API_URL}/api/public/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: env.TENANT_ID,
          siteId: env.SITE_ID,
          subject,
          name: String(values.get("name") ?? "").trim(),
          email: String(values.get("email") ?? "").trim(),
          message: String(values.get("message") ?? "").trim(),
        }),
      });
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          error?: { message?: string };
        } | null;
        throw new Error(result?.error?.message || "We could not send your message.");
      }
      form.reset();
      setStatus("done");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not send your message. Please try again.",
      );
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="contact-form contact-form--done">
        <p className="eyebrow">Message sent</p>
        <p>
          Thank you — we have your message and will come back to you by email.
          Please allow a few days during seminar weeks.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        <span>Your name</span>
        <input name="name" autoComplete="name" required />
      </label>
      <label>
        <span>Email address</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        <span>How can we help?</span>
        <textarea name="message" rows={6} required />
      </label>
      <label className="newsletter__honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      {status === "error" ? <p className="contact-form__error">{message}</p> : null}
      <button className="btn btn-primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
