import { Seo } from "@/components/Seo";
import { useSection, SECTION } from "@/lib/sections";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { Accordion } from "@/components/sections/Accordion";
import { CtaBand } from "@/components/sections/CtaBand";

/**
 * The five questions the frame numbers 01–05.
 *
 * The design shows the questions closed, with no answers drawn — so the answers
 * are the client's to write (A2). Until they arrive each row says so rather
 * than opening onto nothing, which is why the copy below is a placeholder and
 * reads as one.
 */
const QUESTIONS = [
  "Will this work?",
  "I've seen many specialists. How will you be any different?",
  "Can I afford this treatment?",
  "What can I expect as a patient?",
  "What kind of results do you get for your patients?",
];

const APPROACH = [
  {
    title: "Root-Cause Medicine",
    body: "We go beyond symptom management to identify and address the underlying drivers of chronic illness — including infections, toxins, structural imbalances, emotional trauma and environmental exposures.",
  },
  {
    title: "Individualized Care",
    body: "No two patients are the same. Every care plan is designed specifically for you, based on your history, your biology and your goals. We do not apply one-size-fits-all protocols.",
  },
  {
    title: "Autonomic Response Testing®",
    body: "Dr. Dietrich Klinghardt's A.R.T.® method gives our practitioners a sophisticated clinical tool to assess the body's own regulatory responses and identify hidden contributors to illness.",
  },
  {
    title: "The 5 Levels of Healing™",
    body: "Our model of care addresses the physical body, the energy field, the mental-emotional dimension, the intuitive body and the spiritual dimension — recognising that lasting healing often requires attention on more than one level.",
  },
];

const FIRST_STEPS = [
  {
    title: "Reach Out",
    body: "Contact our team to introduce yourself, ask questions, and learn whether Sophia Health Institute® is the right fit for where you are in your health journey.",
  },
  {
    title: "Comprehensive Intake",
    body: "New patients complete an in-depth review of health history, prior testing and current concerns — so that your first appointment can begin with real depth and context.",
  },
  {
    title: "Individualized Care Plan",
    body: "Your practitioners design a care plan specifically for you — not a template, not a protocol applied to everyone. Your biology, your history, your goals.",
  },
];

/**
 * New Patient Information.
 *
 * Rebuilt from the Figma frame `0:7475`. The page used to be a lead paragraph
 * and a form; the frame is a full page — the welcome, the five questions, the
 * four things that make the approach different, the three first steps, and the
 * closing band. It was the second-furthest page from the design (D3).
 */
export function NewPatientsPage() {
  const page = useSection(SECTION.newPatients, {
    title: "New Patient Information",
    paragraphs: [
      "Thank you for your interest in becoming a patient. We are honoured you are exploring the option of having our team become your provider of treatment and healing.",
    ],
  });

  return (
    <>
      <Seo
        title={"New Patient Information — Sophia Health Institute™"}
        description="How to become a patient at the Sophia Health Institute: what to expect, what makes the approach different, and how to reach the team."
        path="/sophia/new-patients"
      />

      <AnimatedGradient variant="plain" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Breadcrumbs
            items={[{ label: "Sophia", href: "/sophia" }, { label: "New patients" }]}
          />
          <Reveal>
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
            <div className="page-hero__actions page-hero__actions--center">
              <a className="btn btn-light" href="#contact">
                Contact us
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
          <p className="eyebrow">Welcome</p>
          <h2>We Know You Have Been Through a Lot</h2>
          <p className="feature-row__copy">
            All of your questions are important, and it is our goal to answer them
            and give you as much information as possible toward making a decision
            that is right for you.
          </p>
          <p className="feature-row__copy">
            We are honoured you are exploring the option of having the team at
            Sophia Health Institute by Dr. Klinghardt™ become your provider of
            treatment and healing.
          </p>
          <p className="feature-row__copy">
            We understand that living with your illness has made your daily life a
            struggle. It is our goal to provide you with a caring, individualised
            approach — one that honours the complexity of your experience and the
            depth of your determination to heal.
          </p>
        </Reveal>
      </section>

      <section className="section wrap">
        <Reveal>
          <p className="eyebrow">Frequently asked</p>
          <h2 className="section-title">You May Be Wondering…</h2>
          <p className="lead">
            As you consider becoming a patient, you might have a lot of questions.
            Here are the ones we hear most often.
          </p>
        </Reveal>
        <Accordion
          items={QUESTIONS.map((question, index) => ({
            id: question,
            question: `${String(index + 1).padStart(2, "0")} — ${question}`,
            answer:
              "The clinic is preparing this answer. In the meantime the team will answer it directly — write to us through the form below.",
          }))}
        />
      </section>

      <section className="section wrap">
        <Reveal className="section-heading section-heading--center">
          <p className="eyebrow">Our approach</p>
          <h2>What Makes This Different</h2>
          <p className="lead">
            Four things shape every care plan we build.
          </p>
        </Reveal>
        <ul className="card-grid card-grid--2">
          {APPROACH.map((item, index) => (
            <Reveal as="li" key={item.title} className="card" delay={index * 60} shift={12}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="section wrap">
        <Reveal>
          <p className="eyebrow">Your first steps</p>
          <h2 className="section-title">What to Expect as a Patient</h2>
        </Reveal>
        <ul className="card-grid card-grid--3">
          {FIRST_STEPS.map((step, index) => (
            <Reveal as="li" key={step.title} className="card" delay={index * 70} shift={12}>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <div id="contact">
        <CtaBand
          title={
            <>
              Ready to
              <br />
              Take The Next Step
            </>
          }
          body="Our friendly team is here to help. Fill out the form and we will review your message and respond as soon as possible during our regular business hours."
          subject="New patient enquiry"
        />
      </div>
    </>
  );
}
