import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useSection, useRecords, SECTION } from "@/lib/sections";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { LineQuote } from "@/components/motion/LineQuote";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/** title | description — the four commitments, from the design. */
const COMMITMENTS_FALLBACK: string[][] = [
  [
    "Preserving a Legacy",
    "Creating a carefully maintained archive of Dr. Klinghardt's publications, lectures, interviews, protocols, correspondence and historical educational materials.",
  ],
  [
    "Advancing Education",
    "Supporting responsible educational programs, scholarships, lectures and professional training inspired by Dr. Klinghardt's interdisciplinary approach to health and healing.",
  ],
  [
    "Encouraging Research",
    "Promoting thoughtful scientific inquiry into questions arising from Dr. Klinghardt's clinical work and encouraging meaningful collaboration among practitioners, researchers and institutions.",
  ],
  [
    "Expanding Access",
    "Helping make educational resources available to communities and practitioners who might otherwise be unable to access advanced training and information.",
  ],
];

/**
 * Dr. Klinghardt Foundation — copy transcribed from the Figma frame 0:5277.
 *
 * The design's own wording is careful that the Foundation "is being
 * established", which is also why the donate page below it may legitimately
 * not be able to take money yet. Both states are told the same way.
 */
export function FoundationPage() {
  const page = useSection(SECTION.foundation, {
    title: "Preserving Knowledge. Advancing Education. Supporting the Future of Healing.",
    paragraphs: [
      "The Dr. Klinghardt Foundation™ is being established to preserve and advance the life's work of Dietrich Klinghardt MD PhD™, while supporting education, thoughtful inquiry, and greater access to knowledge in biological and integrative medicine.",
    ],
  });
  const purpose = useSection("foundation-purpose", {
    title: "Preserving Knowledge for Future Generations",
    paragraphs: [
      "The Foundation's purpose is to ensure that decades of clinical observations, lectures, publications, protocols and educational materials are responsibly preserved and made accessible to future generations of practitioners, researchers, students and members of the public.",
    ],
  });
  const commitments = useRecords("foundation-commitments", 2, COMMITMENTS_FALLBACK);

  return (
    <>
      <Seo
        title={"Dr. Klinghardt Foundation™"}
        description="Preserving the archive, advancing education, encouraging research and expanding access to Dr. Klinghardt's work."
        path="/foundation"
      />

      <AnimatedGradient variant="page" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <p className="eyebrow">Klinghardt Foundation™</p>
            <h1 className="foundation-title">
              <Marked text={page.title} />
            </h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
            <div className="hero__actions foundation-actions">
              <Link className="btn btn-primary" to="/foundation/donate">
                Support the Foundation
              </Link>
            </div>
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap home-intro">
        <Reveal className="home-intro__grid">
          <div>
            <p className="eyebrow">Our purpose</p>
            <h2>{purpose.title}</h2>
          </div>
          <div className="prose">
            {purpose.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="section wrap">
        <Reveal>
          <p className="eyebrow">Four central commitments</p>
          <h2 className="section-title">
            Its work will be organized around four central commitments
          </h2>
        </Reveal>
        <ul className="commitments">
          {commitments.map(([title, body], index) => (
            <Reveal
              as="li"
              key={title}
              className="commitment"
              delay={index * 80}
              shift={14}
            >
              <span className="commitment__number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{title}</h3>
              <p>{body}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="section home-quote">
        <div className="wrap">
          <LineQuote
            lines={[
              "The Foundation is a living bridge",
              "between a lifetime of work",
              "and the future of",
              "integrative healthcare.",
            ]}
            cite="— Dr. Dietrich Klinghardt™"
          />
        </div>
      </section>

      <AnimatedGradient variant="section" intensity="soft" className="home-art">
        <div className="wrap home-art__inner">
          <Reveal>
            <p className="eyebrow">Support the work</p>
            <h2>Help keep the teaching alive</h2>
            <p className="home-art__copy">
              The archive, the scholarships and the research are funded by the
              people this work has helped.
            </p>
            <div className="home-art__actions">
              <Link className="btn btn-light" to="/foundation/donate">
                Support the Foundation
              </Link>
              <Link className="btn btn-ghost" to="/contact">
                Get in touch
              </Link>
            </div>
          </Reveal>
        </div>
      </AnimatedGradient>

      <NewsletterSection />
    </>
  );
}
