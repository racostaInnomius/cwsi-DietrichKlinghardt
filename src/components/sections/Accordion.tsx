import { Reveal } from "@/components/motion/Reveal";

/**
 * FAQ accordion, built on `<details>` rather than React state.
 *
 * The answers are in the static HTML and openable before hydration, which
 * matters on the two pages that use it: Weekly Talks (what the membership
 * includes) and New Patients (what to bring, how billing works).
 */
export interface AccordionItem {
  id: string;
  /** Shown ahead of the question in its own muted column, e.g. "01". */
  number?: string;
  question: string;
  answer: string;
}

export function Accordion({
  items,
  className,
}: {
  items: AccordionItem[];
  /** Extra class on the outer list — lets a page opt into a different look
   * (e.g. Weekly Talks' flat divided rows vs. New Patients' stacked cards)
   * without forking the component. */
  className?: string;
}) {
  if (!items.length) return null;

  return (
    <div className={`accordion${className ? ` ${className}` : ""}`}>
      {items.map((item, index) => (
        <Reveal key={item.id} delay={index * 60} shift={12}>
          <details className="accordion__item">
            <summary>
              <span className="accordion__question">
                {item.number ? (
                  <span className="accordion__number">{item.number}</span>
                ) : null}
                <span>{item.question}</span>
              </span>
              <span className="accordion__mark" aria-hidden="true">
                {/* Only shown by .accordion--flat (CSS hides it otherwise) —
                    the plus/minus mark stays the default. */}
                <svg className="accordion__chevron" viewBox="0 0 12 8" aria-hidden="true">
                  <path d="M1 1.5 6 6.5l5-5" />
                </svg>
              </span>
            </summary>
            <div className="accordion__answer">
              {item.answer.split("\n").filter(Boolean).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
