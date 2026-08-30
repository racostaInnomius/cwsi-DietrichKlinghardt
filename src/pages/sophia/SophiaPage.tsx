import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useSection, SECTION } from "@/lib/sections";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/**
 * Sophia Health Institute landing.
 *
 * The teal palette is not set here — `themeForPath` gives every /sophia route
 * `data-theme="sophia"` on the shell, so this page uses exactly the same
 * markup and tokens as the DK pages and comes out in the other brand. The
 * designer's note: "same font and styles, the colour scheme changes."
 *
 * The two anchors below are linked from the header dropdown; they exist as real
 * sections rather than scroll targets on a wall of prose.
 */
export function SophiaPage() {
  const page = useSection(SECTION.sophiaHome, {
    title: "A Clinic Built Around the Question",
    paragraphs: [
      "Sophia Health Institute is where the method is practised. Patients arrive having usually tried everything: years of tests, diagnoses that explain some of it, treatments that hold only while they last.",
    ],
  });

  return (
    <>
      <Seo
        title={"Sophia Health Institute™ — Dr. Dietrich Klinghardt"}
        description="A healing centre for chronic illness, founded by Dr. Dietrich Klinghardt."
        path="/sophia"
      />

      <AnimatedGradient variant="card" intensity="strong" className="hero">
        <div className="wrap hero__inner">
          <Reveal>
            <p className="eyebrow hero__eyebrow">Sophia Health Institute™</p>
            <h1><Marked text={page.title} /></h1>
            <p className="hero__lead">{page.lead}</p>
            <div className="hero__actions">
              <Link className="btn btn-light" to="/sophia/new-patients">
                New patients
              </Link>
              <Link className="btn btn-ghost" to="/sophia/team">
                Meet the team
              </Link>
            </div>
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap" id="chronic-illness">
        <Reveal>
          <p className="eyebrow">Chronic illness</p>
          <h2 className="section-title">When the diagnosis is not the answer</h2>
        </Reveal>
        <Reveal className="prose" delay={90}>
          <p>
            Chronic infection, heavy-metal and mould toxicity, unresolved trauma
            and a nervous system stuck in defence rarely arrive one at a time.
            The clinic looks for the order they have to be addressed in, which
            is often not the order in which they appeared.
          </p>
          <p>
            Treatment is built around what the body's own regulation shows,
            re-tested as it changes, rather than around a fixed protocol.
          </p>
        </Reveal>
      </section>

      <AnimatedGradient variant="plain" intensity="soft" className="home-art">
        <div className="wrap home-art__inner" id="naturopathic-care">
          <Reveal className="home-art__media">
            <img
              src="/images/sophia-clinic.webp"
              alt="The Sophia Health Institute, seen from the garden"
              width={1024}
              height={683}
              loading="lazy"
              decoding="async"
            />
          </Reveal>
          <Reveal className="home-art__body">
            <p className="eyebrow">Naturopathic care</p>
            <h2>Medicine that treats the person</h2>
            <p className="home-art__copy">
              Physicians, naturopathic doctors and therapists work as one team on
              the same patient — biological medicine, neural therapy, detoxification
              and the psychological work that the physical findings keep pointing at.
            </p>
            <div className="home-art__actions">
              <Link className="btn btn-light" to="/sophia/new-patients">
                Start as a new patient
              </Link>
              <Link className="btn btn-ghost" to="/sophia/accommodations">
                Travel & accommodations
              </Link>
            </div>
          </Reveal>
        </div>
      </AnimatedGradient>

      <NewsletterSection />
    </>
  );
}
