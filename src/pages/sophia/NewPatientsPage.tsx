import { Seo } from "@/components/Seo";
import { useSection, SECTION } from "@/lib/sections";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Emphasis } from "@/components/Emphasis";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { Accordion } from "@/components/sections/Accordion";
import { CtaBand } from "@/components/sections/CtaBand";

/* The questions, the approach and the first steps are cards of their own
   Page Contents blocks (copy in src/data/blocks.ts until the rows have it).
   The design draws the questions closed with no answers written; a question
   whose card has no text yet says the clinic is preparing it. */
const PENDING_ANSWER =
  "The clinic is preparing this answer. In the meantime the team will answer it directly — write to us through the form below.";

/**
 * New Patient Information.
 *
 * Rebuilt from the Figma frame `0:7475`. The page used to be a lead paragraph
 * and a form; the frame is a full page — the welcome, the five questions, the
 * four things that make the approach different, the three first steps, and the
 * closing band. It was the second-furthest page from the design (D3).
 */
export function NewPatientsPage() {
  const page = useSection(SECTION.newPatients);
  const welcome = useSection(SECTION.newPatientsWelcome);
  const wondering = useSection(SECTION.newPatientsWondering);
  const different = useSection(SECTION.newPatientsDifferent);
  const expect = useSection(SECTION.newPatientsExpect);

  return (
    <>
      <Seo
        title={"New Patient Information — Sophia Health Institute™"}
        description="How to become a patient at the Sophia Health Institute: what to expect, what makes the approach different, and how to reach the team."
        path="/sophia/new-patients"
      />

      <AnimatedGradient variant="plain" intensity="soft" className="page-hero sophia-plain-hero">
        <div className="wrap page-hero__inner">
          <Breadcrumbs
            items={[{ label: "Sophia", href: "/sophia" }, { label: "New patients" }]}
          />
          <Reveal>
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
            <div className="page-hero__actions page-hero__actions--center">
              <a className="btn btn-primary" href="#contact">
                Become a Patient <span aria-hidden="true">→</span>
              </a>
            </div>
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap feature-row feature-row--right feature-row--tight-top">
        <Reveal className="feature-row__media">
          <img
            src="/images/sophia-treatment.webp"
            alt="The Sophia Health Institute in Woodinville"
            width={1024}
            height={683}
            loading="lazy"
            decoding="async"
          />
        </Reveal>
        <Reveal className="feature-row__body" delay={90}>
          {welcome.eyebrow ? <p className="eyebrow"><Marked text={welcome.eyebrow} /></p> : null}
          <h2><Marked text={welcome.title} /></h2>
          {welcome.marked.map((paragraph) => (
            <p key={paragraph} className="feature-row__copy">
              <Emphasis text={paragraph} />
            </p>
          ))}
        </Reveal>
      </section>

      <section className="section wrap" id="faq">
        <Reveal>
          {wondering.eyebrow ? <p className="eyebrow"><Marked text={wondering.eyebrow} /></p> : null}
          <h2 className="section-title"><Marked text={wondering.title} /></h2>
          {wondering.lead ? <p className="lead">{wondering.lead}</p> : null}
        </Reveal>
        <Accordion
          items={wondering.cards.map((question, index) => ({
            id: `${index}-${question.title}`,
            number: String(index + 1).padStart(2, "0"),
            question: question.title,
            answer: question.body || PENDING_ANSWER,
          }))}
        />
      </section>

      <section className="section wrap">
        <Reveal className="section-heading section-heading--center">
          {different.eyebrow ? <p className="eyebrow"><Marked text={different.eyebrow} /></p> : null}
          <h2><Marked text={different.title} /></h2>
          {different.lead ? <p className="lead">{different.lead}</p> : null}
        </Reveal>
        <ul className="card-grid card-grid--2 card-grid--compact">
          {different.cards.map((item, index) => (
            <Reveal as="li" key={`${index}-${item.title}`} className="card" delay={index * 60} shift={12}>
              <h3><Marked text={item.title} /></h3>
              {item.body ? <p>{item.body}</p> : null}
            </Reveal>
          ))}
        </ul>
        <div className="section-actions">
          <a className="btn btn-primary" href="#contact">
            Become a Patient <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className="section wrap">
        <Reveal>
          {expect.eyebrow ? <p className="eyebrow"><Marked text={expect.eyebrow} /></p> : null}
          <h2 className="section-title"><Marked text={expect.title} /></h2>
        </Reveal>
        <ul className="card-grid card-grid--3 card-grid--compact card-grid--joined">
          {expect.cards.map((step, index) => (
            <Reveal as="li" key={`${index}-${step.title}`} className="card" delay={index * 70} shift={12}>
              <h3><Marked text={step.title} /></h3>
              {step.body ? <p>{step.body}</p> : null}
            </Reveal>
          ))}
        </ul>
      </section>

      <div id="contact">
        <CtaBand
          slug={SECTION.sophiaCtaNextStep}
          subject="New patient enquiry"
        />
      </div>
    </>
  );
}
