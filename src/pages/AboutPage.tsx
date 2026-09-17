import { Seo } from "@/components/Seo";
import { useSection, useRecords, SECTION } from "@/lib/sections";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/**
 * The four labelled blocks the frame sets beside the biography: a short label on
 * the left, the paragraph on the right. `label | body`.
 */
const CHAPTERS_FALLBACK: string[][] = [
  [
    "Background",
    "Dr. Dietrich Klinghardt™ studied medicine and psychology in Freiburg, Germany, where his doctoral research explored the relationship between the autonomic nervous system and the body's regulatory systems. After moving to the United States he worked in emergency medicine and later became Medical Director of the Santa Fe Pain Centre.",
  ],
  [
    "Frameworks",
    "Over the course of his career, Dr. Klinghardt developed several influential clinical and educational frameworks, including Autonomic Response Testing® and The 5 Levels of Healing™. His work brings together conventional medical knowledge, neurobiology, environmental medicine, psychology and selected traditions of biological medicine.",
  ],
  [
    "Teaching",
    "Dr. Klinghardt has trained practitioners and presented lectures, seminars and workshops internationally. His teaching emphasises careful observation, individualised care, professional curiosity, and the importance of considering the physical, energetic, emotional, mental and spiritual dimensions of human experience.",
  ],
  [
    "Mission",
    "Through his clinical work, publications, lectures and educational programmes, Dr. Klinghardt continues to encourage practitioners and patients to ask deeper questions, explore overlooked influences on health, and approach healing with both scientific curiosity and compassion.",
  ],
];

/**
 * The timeline, transcribed from the frame. Four fields per entry, because the
 * design gives each one an era, a context line and a title before the body —
 * `era | context | title | body`.
 */
const TIMELINE_FALLBACK: string[][] = [
  [
    "Early Years",
    "Freiburg, Germany",
    "Medical & Psychological Studies",
    "Dr. Klinghardt studied medicine and psychology in Freiburg, Germany, where his doctoral research explored the relationship between the autonomic nervous system and the body's regulatory systems.",
  ],
  [
    "1980s",
    "United States",
    "Emergency Medicine & Santa Fe Pain Centre",
    "After moving to the United States he worked in emergency medicine and later became Medical Director of the Santa Fe Pain Centre. These early experiences shaped his commitment to looking beyond isolated symptoms and understanding the whole person.",
  ],
  [
    "1990s",
    "Clinical Development",
    "Autonomic Response Testing® (A.R.T.®)",
    "Dr. Klinghardt developed Autonomic Response Testing® — a clinically refined bioenergetic assessment system that uncovers hidden root causes of illness through the body's own regulatory responses.",
  ],
  [
    "2000s",
    "Framework & Teaching",
    "The 5 Levels of Healing™",
    "He formalised his signature framework addressing the physical, energetic, emotional, mental and spiritual dimensions of health, and began training practitioners and presenting lectures, seminars and workshops internationally.",
  ],
  [
    "2010s",
    "Sophia Health Institute",
    "Founding of Sophia Health Institute by Dr. Klinghardt™",
    "He co-founded Sophia Health Institute by Dr. Klinghardt™ in Woodinville, WA — a world-renowned centre bringing together conventional medical knowledge, neurobiology, environmental medicine, psychology and selected traditions of biological medicine.",
  ],
  [
    "Today",
    "Global Impact",
    "Continued Research & Education",
    "Through clinical work, publications, lectures and educational programmes, Dr. Klinghardt continues to encourage practitioners and patients to ask deeper questions, explore overlooked influences on health, and approach healing with both scientific curiosity and compassion.",
  ],
];

/**
 * About — rebuilt from the Figma frame `0:5539`.
 *
 * The page used to open on "An Innovator in Medicine" and close on a quote we
 * had written; the frame opens on his name, states the biography in four
 * labelled chapters, and gives the timeline four fields per entry rather than
 * two. The designer asked for the timeline to animate as you scroll, which is
 * why each entry still reveals in turn.
 */
export function AboutPage() {
  const about = useSection(SECTION.about, {
    title: "Dr. Dietrich Klinghardt™",
    paragraphs: [
      "Dietrich Klinghardt MD PhD™ is a physician, educator, author and internationally recognised voice in biological and integrative medicine. For more than four decades his clinical work has focused on understanding the complex relationships among the nervous system, immune system, environmental influences, chronic infections, unresolved trauma and human health.",
    ],
  });

  const chapters = useRecords(SECTION.aboutChapters, 2, CHAPTERS_FALLBACK);
  const milestones = useRecords(SECTION.aboutTimeline, 4, TIMELINE_FALLBACK);

  return (
    <>
      <Seo
        title={"About Dr. Dietrich Klinghardt™"}
        description="Physician, educator and author. The story behind Autonomic Response Testing and the 5 Levels of Healing."
        path="/about"
      />

      {/* Client (2026-09-18): "no debe tener un Hero" — no boxed/inset
          gradient card here; the design sits this title directly on the
          page's own ambient gradient (shell.css), the same plain-ground
          convention EventDetailPage uses. */}
      <section className="section wrap about-title">
        <Reveal>
          <p className="eyebrow">About</p>
          <h1><Marked text={about.title} /></h1>
          {about.lead ? <p className="lead about__lead">{about.lead}</p> : null}
        </Reveal>
      </section>

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
        <div className="chapters">
          {chapters.map(([label, body], index) => (
            <Reveal
              as="div"
              key={label}
              className="chapter"
              delay={(about.image ? 120 : 0) + index * 90}
            >
              <h2 className="chapter__label">{label}</h2>
              <p>{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section wrap">
        <Reveal className="section-heading section-heading--center">
          <p className="eyebrow">Timeline</p>
          <h2 className="section-title">A Life Dedicated to Healing</h2>
        </Reveal>

        <ol className="timeline">
          {milestones.map(([era, context, title, body], index) => (
            <Reveal as="li" key={`${era}-${title}`} className="timeline__item" delay={index * 90}>
              <div className="timeline__era">
                <span className="timeline__year">{era}</span>
                {context ? <span className="timeline__context">{context}</span> : null}
              </div>
              <div>
                <h3><Marked text={title} /></h3>
                <p>{body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <NewsletterSection />
    </>
  );
}
