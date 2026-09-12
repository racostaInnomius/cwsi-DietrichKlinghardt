import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { useSection, useRecords, SECTION } from "@/lib/sections";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { MailIcon, BriefcaseIcon, MicrophoneIcon, HeartIcon } from "@/components/Icons";

/** Category badge icon per card — matched against the label text so CMS
 * rows (any wording) still fall back to a plain envelope. */
function cardIcon(label: string) {
  const key = label.toLowerCase();
  if (key.includes("media") || key.includes("press")) return BriefcaseIcon;
  if (key.includes("speak") || key.includes("event")) return MicrophoneIcon;
  if (key.includes("foundation")) return HeartIcon;
  return MailIcon;
}

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
 * Contact — four addressed cards.
 *
 * Client (2026-09-11, against a closer Figma reference than the frame this
 * originally shipped from): each card shows a category icon and the plain
 * mailto address directly — no "write to us" button, no popup. Simpler than
 * the original design note ("opens a popup to write to that address"), and
 * the more recent reference wins per the client's own priority order
 * (Figma over an older written note once the two disagree).
 */
export function ContactPage() {
  const contact = useSection(SECTION.contact, {
    title: "Contact Us",
    paragraphs: [
      "Four ways in, depending on what you need. We answer every message, though seminar weeks can slow us down.",
    ],
  });
  const cards = useRecords(SECTION.contactCards, 3, CARDS_FALLBACK);

  return (
    <>
      <Seo
        title={"Contact — Dr. Dietrich Klinghardt™"}
        description="How to reach the practice, the academy and the Sophia Health Institute."
        path="/contact"
      />

      {/* Client (2026-09-11): "pegar el parrafo de texto al titulo, y las
          tarjetas tambien acercarlas, se ven muy separadas" —
          .contact-hero (sections.css) scopes both fixes to this page. */}
      <AnimatedGradient variant="plain" intensity="soft" className="page-hero page-hero--center contact-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <p className="eyebrow">Get in touch</p>
            <h1><Marked text={contact.title} /></h1>
            {contact.lead ? <p className="lead">{contact.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap section--tight-top contact-section">
        <ul className="contact-grid contact-grid--joined">
          {cards.map(([label, email, description], index) => {
            const Icon = cardIcon(label);
            return (
              <Reveal as="li" key={email} className="contact-card" delay={index * 80}>
                <span className="contact-card__icon">
                  <Icon />
                </span>
                <h2>{label}</h2>
                <p>{description}</p>
                <a className="contact-card__email" href={`mailto:${email}`}>
                  <MailIcon /> {email}
                </a>
              </Reveal>
            );
          })}
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
          <Link className="btn btn-primary contact-note__cta" to="/sophia/accommodations">
            Contact for Dietrich Klinghardt Health Institute™
          </Link>
        </Reveal>
      </section>
    </>
  );
}
