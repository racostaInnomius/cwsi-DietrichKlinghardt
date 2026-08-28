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
  question: string;
  answer: string;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  if (!items.length) return null;

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <Reveal key={item.id} delay={index * 60} shift={12}>
          <details className="accordion__item">
            <summary>
              <span>{item.question}</span>
              <span className="accordion__mark" aria-hidden="true" />
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
