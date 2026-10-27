import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { useSection, useCardList, SECTION } from "@/lib/sections";
import { CardIcon } from "@/components/CardIcon";
import { Emphasis } from "@/components/Emphasis";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { MailIcon, BriefcaseIcon, MicrophoneIcon, HeartIcon } from "@/components/Icons";
import { ButtonText } from "@/components/ButtonText";

/** Category badge icon per card — matched against the label text so CMS
 * rows (any wording) still fall back to a plain envelope. */
function cardIcon(label: string) {
  const key = label.toLowerCase();
  if (key.includes("media") || key.includes("press")) return BriefcaseIcon;
  if (key.includes("speak") || key.includes("event")) return MicrophoneIcon;
  if (key.includes("foundation")) return HeartIcon;
  return MailIcon;
}

/* The four cards are the "contact-cards" Page Contents block (copy in
   src/data/blocks.ts until the row has it): title, text, "Más datos" → Correo,
   and an icon (picked from the label when the card has none). Rows still
   written as "label | email | text" lines keep working. */

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
  const contact = useSection(SECTION.contact);
  const cards = useCardList(SECTION.contactCards, 3, ([title, email, body]) => ({
    icon: "",
    title,
    email,
    body,
  }));
  const note = useSection("contact-please-note");

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
      <AnimatedGradient variant="card" intensity="soft" className="page-hero page-hero--center contact-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            {contact.eyebrow ? <p className="eyebrow"><Marked text={contact.eyebrow} /></p> : null}
            <h1><Marked text={contact.title} /></h1>
            {contact.lead ? <p className="lead">{contact.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap section--tight-top contact-section">
        <ul className="contact-grid contact-grid--joined">
          {cards.cards.map(({ icon, title: label, email, body: description }, index) => (
            <Reveal as="li" key={`${index}-${label}`} className="contact-card" delay={index * 80}>
              <span className="contact-card__icon">
                <CardIcon name={icon} fallback={cardIcon(label)} />
              </span>
              <h2><Marked text={label} /></h2>
              {description ? <p>{description}</p> : null}
              {email ? (
                <a className="contact-card__email" href={`mailto:${email}`}>
                  <MailIcon /> {email}
                </a>
              ) : null}
            </Reveal>
          ))}
        </ul>

        {/* The frame carries this warning under the four cards, and it is the
            kind of line a medical site cannot quietly drop. */}
        <Reveal className="contact-note" delay={220}>
          {note.marked.map((paragraph) => (
            <p key={paragraph}>
              <Emphasis text={paragraph} />
            </p>
          ))}
          <Link className="btn btn-primary contact-note__cta" to="/sophia/accommodations">
            <ButtonText id="contact-health-institute" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
