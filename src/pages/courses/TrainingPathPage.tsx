import { Seo } from "@/components/Seo";
import { Link, useParams } from "react-router-dom";
import { useTrainingPath } from "@/lib/trainingPaths";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/**
 * A training path in full: what the certification involves, in what order, and
 * what is required to sit the examination.
 *
 * Every section renders only when the path actually has that content. A.R.T. is
 * the one fully written up in the design; the other four show what they have
 * and grow as the CMS rows are filled, rather than displaying empty headings.
 */
export function TrainingPathPage() {
  const { slug } = useParams();
  const path = useTrainingPath(slug);

  if (!path) {
    return (
      <>
        <Seo
        title={"Training path not found — Dr. Dietrich Klinghardt™"}
        noindex
      />
        <section className="section wrap">
          <h1>This training path is no longer listed.</h1>
          <p className="lead">Browse the current methods instead.</p>
          <Link className="btn btn-primary" to="/courses">
            All courses
          </Link>
        </section>
      </>
    );
  }

  const datesHref = `/courses/${path.slug}/dates`;

  return (
    <>
      <Seo
        title={`${path.abbreviation} Training Path — Dr. Dietrich Klinghardt™`}
        description={path.shortDescription}
        path={`/courses/${path.slug}`}
      />

      <AnimatedGradient variant="plain" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Breadcrumbs
            items={[{ label: "Online courses", href: "/courses" }, { label: path.abbreviation }]}
          />
          <Reveal>
            <p className="eyebrow">Training path</p>
            <h1><Marked text={path.title} /></h1>
            <p className="lead">{path.shortDescription}</p>
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap two-col">
        <div className="path-body">
          {path.about.length ? (
            <Reveal className="prose">
              <p className="eyebrow">About the course</p>
              {path.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <Link className="btn btn-primary" to={datesHref}>
                To the online course dates
              </Link>
            </Reveal>
          ) : null}

          {path.duringTraining.length ? (
            <Reveal className="prose">
              <h2>During training</h2>
              {path.duringTraining.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>
          ) : null}

          {path.curriculum.length ? (
            <div>
              <Reveal>
                <h2 className="section-title">
                  Course of training to become a{" "}
                  <Marked text={path.abbreviation} /> therapist
                </h2>
              </Reveal>
              <ol className="curriculum">
                {path.curriculum.map((step, index) => (
                  <Reveal
                    as="li"
                    key={step.label}
                    className="curriculum__step"
                    delay={index * 50}
                    shift={10}
                  >
                    <span className="curriculum__number" aria-hidden="true">
                      {index + 1}
                    </span>
                    <div>
                      <b>
                        <Marked text={step.label} />
                      </b>
                      {step.note ? <p>{step.note}</p> : null}
                    </div>
                  </Reveal>
                ))}
              </ol>
              {path.finalStep ? (
                <Reveal className="curriculum__final">
                  <b>
                    <Marked text={path.finalStep} />
                  </b>
                </Reveal>
              ) : null}
              {path.footnotes.length ? (
                <div className="footnotes">
                  {path.footnotes.map((note) => (
                    <p key={note}>
                      <Marked text={note} />
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {path.examRequirements.length ? (
            <Reveal>
              <h2 className="section-title">
                Requirements for the <Marked text={path.abbreviation} /> examination
              </h2>
              <ul className="chips chips--lg">
                {path.examRequirements.map((item) => (
                  <li key={item} className="chip">
                    <Marked text={item} />
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}

          {path.recommendedSeminars.length || path.recommendedNote ? (
            <Reveal>
              <h2 className="section-title">Recommended additional seminars</h2>
              {path.recommendedNote ? <p className="prose">{path.recommendedNote}</p> : null}
              <ul className="chips chips--lg">
                {path.recommendedSeminars.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}

          {path.seminars.length ? (
            <div>
              <Reveal>
                <h2 className="section-title">
                  Course content &amp; seminar dates
                </h2>
              </Reveal>
              <ul className="seminar-list">
                {path.seminars.map((seminar, index) => (
                  <Reveal
                    as="li"
                    key={seminar}
                    className="seminar"
                    delay={index * 50}
                    shift={10}
                  >
                    <Marked text={seminar} />
                  </Reveal>
                ))}
              </ul>
              <Reveal>
                <Link className="btn btn-primary" to={datesHref}>
                  To the online course dates
                </Link>
              </Reveal>
            </div>
          ) : null}
        </div>

        <Reveal as="aside" className="path-panel" delay={120}>
          <p className="eyebrow">Training path</p>
          <p className="path-panel__mark">
            <Marked text={path.abbreviation} />
          </p>
          <p className="path-panel__subtitle">
            <Marked text={path.subtitle} />
          </p>

          {path.targetGroup.length ? (
            <>
              <h3>Target group</h3>
              <ul>
                {path.targetGroup.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}

          {path.languages.length ? (
            <>
              <h3>Language</h3>
              <ul>
                {path.languages.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}

          {path.diploma ? (
            <>
              <h3>Diploma</h3>
              <p>
                <Marked text={path.diploma} />
              </p>
            </>
          ) : null}

          <Link className="btn btn-primary path-panel__cta" to={datesHref}>
            Course dates
          </Link>
        </Reveal>
      </section>

      <NewsletterSection />
    </>
  );
}
