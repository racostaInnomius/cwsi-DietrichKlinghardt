import { Seo } from "@/components/Seo";
import { useCollection, text, number } from "@/lib/content";
import { useSection, SECTION } from "@/lib/sections";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { Accordion } from "@/components/sections/Accordion";
import { ContactForm } from "@/components/sections/ContactForm";

/**
 * New Patient Information — FAQ plus the enquiry form.
 *
 * The page copy is still with the client (Vic), so the fallback below says only
 * what is certainly true and does not invent clinical or billing claims. It is
 * written to be replaced wholesale by the `new-patients` CMS row.
 */
export function NewPatientsPage() {
  const page = useSection(SECTION.newPatients, {
    title: "New Patient Information",
    paragraphs: [
      "Becoming a patient starts with an enquiry, not a booking: we read what you send, and come back to you about whether the clinic is the right place for your situation and what a first visit would involve.",
    ],
  });

  // The first paragraph is already the hero lead.
  const body = page.paragraphs.slice(1);

  const faqs = [...useCollection("faqs")]
    .sort((a, b) => number(a, "order") - number(b, "order"))
    .map((row, index) => ({
      id: String(row.id ?? index),
      question: text(row, "question"),
      answer: text(row, "answer"),
    }))
    .filter((item) => item.question && item.answer);

  return (
    <>
      <Seo
        title={"New Patient Information — Sophia Health Institute™"}
        description="How to become a patient at the Sophia Health Institute: what to send, what to expect."
        path="/sophia/new-patients"
      />

      <AnimatedGradient variant="page" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Breadcrumbs
            items={[{ label: "Sophia", href: "/sophia" }, { label: "New patients" }]}
          />
          <Reveal>
            <p className="eyebrow">Sophia Health Institute™</p>
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      {/* The page copy is still with the client. Until it arrives there is
          nothing to put in the left column, so the form takes the whole width
          rather than sitting beside an empty half. */}
      <section
        className={`section wrap two-col${body.length || faqs.length ? "" : " two-col--panel"}`}
      >
        <div>
          <Reveal className="prose">
            {body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>

          {faqs.length ? (
            <div id="faq">
              <Reveal>
                <p className="eyebrow">Frequently asked</p>
                <h2 className="section-title">Before you write to us</h2>
              </Reveal>
              <Accordion items={faqs} />
            </div>
          ) : null}
        </div>

        <Reveal as="aside" className="form-panel" delay={120}>
          <p className="eyebrow">Patient enquiry</p>
          <h2>Tell us about your situation</h2>
          <p className="form-panel__note">
            Please don’t send medical records in this form — we’ll tell you where
            to send them once we’ve read your message.
          </p>
          <ContactForm subject="New patient enquiry" />
        </Reveal>
      </section>
    </>
  );
}
