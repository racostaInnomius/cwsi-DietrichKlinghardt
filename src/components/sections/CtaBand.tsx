import type { ReactNode } from "react";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";

/**
 * The closing band the design repeats across the Sophia pages — an inset
 * gradient card with an eyebrow, a large two-line heading and either the
 * contact form or a single button.
 *
 * It is one component rather than three copies because the frames differ only
 * in their words: "Ready to / Take The Next Step" on Accommodations and New
 * Patients, "Stop Wondering. / Start Finding Answers." on the Sophia home.
 * Repeating the markup would have meant repeating the eventual fixes too.
 */
export function CtaBand({
  eyebrow = "Ready to begin",
  title,
  body,
  subject,
  children,
}: {
  eyebrow?: string;
  /** Rendered as given — the design breaks these headings over two lines. */
  title: ReactNode;
  body: string;
  /** When set, the band carries the contact form and this labels the enquiry. */
  subject?: string;
  /** A button, for the frames that close with one instead of the form. */
  children?: ReactNode;
}) {
  return (
    <section className="section wrap">
      <AnimatedGradient variant="card" intensity="soft" className="cta-band">
        <div className="cta-band__inner">
          <Reveal>
            <p className="eyebrow cta-band__eyebrow">{eyebrow}</p>
            <h2 className="display-lg cta-band__title">{title}</h2>
            <p className="cta-band__body">{body}</p>
          </Reveal>

          {subject ? (
            <Reveal className="cta-band__form" delay={110}>
              <ContactForm subject={subject} />
            </Reveal>
          ) : null}

          {children ? (
            <Reveal className="cta-band__actions" delay={110}>
              {children}
            </Reveal>
          ) : null}
        </div>
      </AnimatedGradient>
    </section>
  );
}
