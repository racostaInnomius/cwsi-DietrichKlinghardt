import { useEffect, useRef, useState } from "react";
import { Seo } from "@/components/Seo";
import { useSection, useRecords, SECTION } from "@/lib/sections";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";

/** label | email | what this address is for */
/**
 * The four contact routes, transcribed from the Figma frame `0:5829`.
 *
 * The labels AND the addresses are the design's. Both had been invented here —
 * which matters more for the addresses than for the wording: mail sent to an
 * address nobody owns simply disappears.
 */
const CARDS_FALLBACK: string[][] = [
  ["General Inquiries", "hello@dietrich-klinghardt.com", "Questions about Dr. Klinghardt's work, website, publications, or educational resources."],
  ["Media & Press", "media@dietrich-klinghardt.com", "Interviews, press inquiries, podcasts, documentaries, and media opportunities."],
  ["Speaking & Events", "speaking@dietrich-klinghardt.com", "Conference invitations, lectures, professional seminars, and educational appearances."],
  ["Dr. Klinghardt Foundation", "foundation@dietrich-klinghardt.com", "Educational initiatives, archival projects, partnerships, and future programs."],
];

/**
 * Contact — four addressed cards. The designer's note: each of the four emails
 * "opens a popup to write to that address".
 *
 * The popup exists because a bare `mailto:` is a dead end for anyone reading on
 * a machine with no mail client configured: it either does nothing or opens
 * something they never use. The dialog shows the address in full and offers
 * both paths — open the mail app, or copy it.
 */
export function ContactPage() {
  const contact = useSection(SECTION.contact, {
    title: "Contact Us",
    paragraphs: [
      "Four ways in, depending on what you need. We answer every message, though seminar weeks can slow us down.",
    ],
  });
  const cards = useRecords(SECTION.contactCards, 3, CARDS_FALLBACK);
  const [active, setActive] = useState<string[] | null>(null);

  return (
    <>
      <Seo
        title={"Contact — Dr. Dietrich Klinghardt™"}
        description="How to reach the practice, the academy and the Sophia Health Institute."
        path="/contact"
      />

      <AnimatedGradient variant="plain" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <p className="eyebrow">Get in touch</p>
            <h1><Marked text={contact.title} /></h1>
            {contact.lead ? <p className="lead">{contact.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap">
        <ul className="contact-grid">
          {cards.map(([label, email, description], index) => (
            <Reveal as="li" key={email} className="contact-card" delay={index * 80}>
              <h2>{label}</h2>
              <p>{description}</p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setActive([label, email, description])}
              >
                Write to us
              </button>
            </Reveal>
          ))}
        </ul>

        {/* The frame carries this warning under the four cards, and it is the
            kind of line a medical site cannot quietly drop. */}
        <Reveal className="contact-note" delay={220}>
          <p>
            <strong>Please note:</strong> do not send private medical records,
            test results or urgent healthcare requests through these email
            addresses. This website does not provide individualised medical
            advice, and messages are not monitored for medical emergencies.
          </p>
        </Reveal>
      </section>

      {active ? <ContactDialog card={active} onClose={() => setActive(null)} /> : null}
    </>
  );
}

function ContactDialog({ card, onClose }: { card: string[]; onClose: () => void }) {
  const [label, email] = card;
  const closeButton = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard access can be refused (insecure context, permissions). The
      // address is on screen either way, so this is not worth an error state.
      setCopied(false);
    }
  }

  return (
    <div
      className="feedback-backdrop"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        className="feedback-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-dialog-title"
      >
        <button
          ref={closeButton}
          className="feedback-close"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <p className="eyebrow">{label}</p>
        <h2 id="contact-dialog-title">{email}</h2>
        <p>{card[2]}</p>
        <div className="contact-dialog__actions">
          <a className="btn btn-primary" href={`mailto:${email}`}>
            Open email app
          </a>
          <button className="btn btn-outline" type="button" onClick={copy}>
            {copied ? "Copied" : "Copy address"}
          </button>
        </div>
      </section>
    </div>
  );
}
