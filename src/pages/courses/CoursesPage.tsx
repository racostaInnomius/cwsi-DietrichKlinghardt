import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useSection } from "@/lib/sections";
import { useTrainingPaths } from "@/lib/trainingPaths";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { CoursesHeroPhotos } from "@/components/sections/CoursesHeroPhotos";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/**
 * Online Courses — the grid of the five training methods.
 *
 * Each card carries the method's description and its level chips, and the two
 * exits the design gives it: the training path (what the certification
 * involves) and the dates (what you can actually book).
 */
export function CoursesPage() {
  const page = useSection("courses", {
    title: "Learn the Klinghardt Method",
    paragraphs: [
      "Five training paths, taught by Dr. Klinghardt and the practitioners he has certified. Each one can be taken level by level, and each level is bookable on its own.",
    ],
  });
  const paths = useTrainingPaths();

  return (
    <>
      <Seo
        title={"Online Courses — Dr. Dietrich Klinghardt™"}
        description="A.R.T., MFT, PK, SRT and the Master of ANK: the five training paths of the Klinghardt Method."
        path="/courses"
      />

      <AnimatedGradient variant="card" intensity="normal" className="courses-hero">
        <div className="wrap courses-hero__inner">
          <Reveal>
            <p className="eyebrow">Online courses</p>
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
          </Reveal>
          <CoursesHeroPhotos />
        </div>
      </AnimatedGradient>

      <section className="section wrap">
        <ul className="course-path-grid">
          {paths.map((path, index) => (
            <Reveal
              as="li"
              key={path.slug}
              className={`course-path-card${path.slug === "ank" ? " course-path-card--ank" : ""}`}
              delay={index * 70}
              shift={16}
            >
              <div className="course-path-card__header">
                <span className="course-path-card__badge">{path.slug.toUpperCase()}</span>
                <h2>
                  <Marked text={path.title} />
                </h2>
              </div>
              <div className="course-path-card__body">
                <p>{path.shortDescription}</p>
                {path.levels.length ? (
                  <ul className="chips">
                    {path.levels.map((level) => (
                      <li key={level} className="chip">
                        {level}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="course-path-card__footer">
                <Link
                  className="course-path-card__cta course-path-card__cta--primary"
                  to={`/courses/${path.slug}`}
                >
                  View training path <span aria-hidden="true">↗</span>
                </Link>
                <Link
                  className="course-path-card__cta course-path-card__cta--secondary"
                  to={`/courses/${path.slug}/dates`}
                >
                  Next courses <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <NewsletterSection />
    </>
  );
}
