import type { ReactNode } from "react";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";
import { Marked } from "@/components/Marked";
import { useSection } from "@/lib/sections";

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
  slug,
  eyebrow: eyebrowProp,
  title: titleProp,
  body: bodyProp,
  subject,
  formSplitName,
  children,
  className,
}: {
  /**
   * Page Contents block the band's words come from (eyebrow, title + subtitle
   * as the heading's two lines, first paragraph as the body). Explicit props
   * win over it.
   */
  slug?: string;
  eyebrow?: string;
  /** Rendered as given — the design breaks these headings over two lines. */
  title?: ReactNode;
  body?: string;
  /** When set, the band carries the contact form and this labels the enquiry. */
  subject?: string;
  /** Accommodations' dark band splits the name field into first/last, per its
      own Figma frame — every other band keeps the single "Your name" field. */
  formSplitName?: boolean;
  /** A button, for the frames that close with one instead of the form. */
  children?: ReactNode;
  /** Extra modifier class, for one-off variants (e.g. Sophia home's dark band). */
  className?: string;
}) {
  const block = useSection(slug ?? "");
  const eyebrow = eyebrowProp ?? (block.eyebrow || "Ready to begin");
  const title = titleProp ?? <TwoLineTitle title={block.title} subtitle={block.subtitle} />;
  const body = bodyProp ?? block.lead;
  return (
    <section className="section wrap">
      <AnimatedGradient
        variant="card"
        intensity="soft"
        className={`cta-band${className ? ` ${className}` : ""}`}
      >
        <div className="cta-band__inner">
          <Reveal>
            <p className="eyebrow cta-band__eyebrow">{eyebrow}</p>
            <h2 className="display-lg cta-band__title">{title}</h2>
            <p className="cta-band__body">{body}</p>
          </Reveal>

          {subject ? (
            <Reveal className="cta-band__form" delay={110}>
              <ContactForm subject={subject} splitName={formSplitName} />
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

/** A heading the design sets on two lines: the block's title, then its subtitle. */
export function TwoLineTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <>
      <Marked text={title} />
      {subtitle ? (
        <>
          <br />
          <Marked text={subtitle} />
        </>
      ) : null}
    </>
  );
}
