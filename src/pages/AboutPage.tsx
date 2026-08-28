import { Head } from "vite-react-ssg";
import { useSection, useRecords, SECTION } from "@/lib/sections";
import { env } from "@/lib/env";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { LineQuote } from "@/components/motion/LineQuote";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

const TIMELINE_FALLBACK: string[][] = [
  ["1978", "Medical school, Freiburg", "Trained in anesthesiology and began asking why patients with the same diagnosis respond so differently."],
  ["1980s", "India", "Work in rural clinics turned toward the autonomic nervous system as the body's own diagnostic voice."],
  ["1990s", "Autonomic Response Testing", "A.R.T. takes shape as a repeatable clinical method and starts being taught to other physicians."],
  ["2000s", "The 5 Levels of Healing", "The framework that places physical findings inside the mental, emotional and energetic layers around them."],
  ["2010s", "Sophia Health Institute", "A clinic built to practise the method: chronic illness treated on every level at once."],
  ["Today", "Teaching worldwide", "Practitioners in more than thirty countries work with A.R.T., and the seminars continue."],
];

/**
 * About — biography plus the milestone timeline the designer asked to "animate,
 * so it feels interactive as you scroll". Each milestone reveals in turn.
 */
export function AboutPage() {
  const about = useSection(SECTION.about, {
    title: "An Innovator in Medicine",
    paragraphs: [
      "Dr. Dietrich Klinghardt is a physician, teacher and researcher whose work sits at the meeting point of neurobiology, toxicology and the psychology of illness.",
      "Trained in Germany and shaped by years of clinical work in India, he built a practice around a single question: not what disease a patient has, but why they became ill — and in what order the answer has to be addressed.",
      "That question became Autonomic Response Testing and the 5 Levels of Healing, taught today to practitioners in more than thirty countries and practised at the Sophia Health Institute.",
    ],
  });
  const milestones = useRecords(SECTION.aboutTimeline, 3, TIMELINE_FALLBACK);

  return (
    <>
      <Head>
        <title>About Dr. Dietrich Klinghardt™</title>
        <meta
          name="description"
          content="Physician, teacher and researcher. The story behind Autonomic Response Testing and the 5 Levels of Healing."
        />
        <link rel="canonical" href={`${env.SITE_URL}/about`} />
      </Head>

      <AnimatedGradient variant="page" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <p className="eyebrow">About</p>
            <h1>{about.title}</h1>
          </Reveal>
        </div>
      </AnimatedGradient>

      {/* Two columns only when there is a portrait — an empty half of the grid
          reads as a missing image rather than as space. */}
      <section
        className={`section wrap about-bio${about.image ? " about-bio--portrait" : ""}`}
      >
        {about.image ? (
          <Reveal>
            <img className="about-bio__portrait" src={about.image} alt="Dr. Dietrich Klinghardt" />
          </Reveal>
        ) : null}
        <Reveal className="prose" delay={about.image ? 120 : 0}>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Reveal>
      </section>

      <section className="section wrap">
        <Reveal>
          <p className="eyebrow">A working life</p>
          <h2 className="section-title">Four decades of asking why</h2>
        </Reveal>

        <ol className="timeline">
          {milestones.map(([year, title, body], index) => (
            <Reveal as="li" key={`${year}-${title}`} className="timeline__item" delay={index * 90}>
              <span className="timeline__year">{year}</span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="section home-quote">
        <div className="wrap">
          <LineQuote
            lines={["Symptoms are not the illness.", "They are how the body", "asks for something."]}
            cite="— Dr. Dietrich Klinghardt™"
          />
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
