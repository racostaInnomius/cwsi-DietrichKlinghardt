import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useSection } from "@/lib/sections";
import { videoEmbed } from "@/lib/cms";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { LineQuote } from "@/components/motion/LineQuote";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { VideoPlayer } from "@/components/sections/VideoPlayer";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/**
 * A.R.T. Klinghardt — what Autonomic Response Testing is, for the reader who
 * arrived from the navigation without knowing the term. The training path and
 * the practitioner directory are the two exits from this page.
 */
export function ArtPage() {
  const page = useSection("art", {
    title: "Autonomic Response Testing",
    paragraphs: [
      "A.R.T. is a diagnostic method that reads the autonomic nervous system directly: the body signals which stressors it is reacting to, and which of them it is ready to deal with first.",
      "It is a way of asking the body questions rather than asking a lab. A practitioner tests the response to specific substances, sites and stressors, and builds the treatment order from what comes back — then re-tests as the picture changes.",
      "It does not replace laboratory work; it decides what is worth testing, in which order to treat what is found, and when something has actually resolved.",
    ],
  });
  const video = videoEmbed(page.raw?.featuredVideo);

  return (
    <>
      <Seo
        title={"A.R.T. Klinghardt™ — Autonomic Response Testing"}
        description="Autonomic Response Testing: reading the body's own regulation to find what is driving illness, and in which order to treat it."
        path="/academy/art"
      />

      <AnimatedGradient variant="plain" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Breadcrumbs
            items={[{ label: "Akademy", href: "/academy" }, { label: "A.R.T. Klinghardt" }]}
          />
          <Reveal>
            <p className="eyebrow">Signature method</p>
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      {video ? (
        <section className="section wrap">
          <Reveal>
            <VideoPlayer video={video} />
          </Reveal>
        </section>
      ) : null}

      <section className="section wrap">
        <Reveal className="prose">
          {page.paragraphs.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Reveal>
      </section>

      <section className="section home-quote">
        <div className="wrap">
          <LineQuote
            lines={["The body already knows.", "The method is only", "a way of listening."]}
            cite="— Dr. Dietrich Klinghardt™"
          />
        </div>
      </section>

      <AnimatedGradient variant="plain" intensity="soft" className="home-art">
        <div className="wrap home-art__inner">
          <Reveal>
            <p className="eyebrow">Next steps</p>
            <h2>Learn it, or find someone who has</h2>
            <p className="home-art__copy">
              Practitioners train through the certification path; patients can
              look for someone already working with the method nearby.
            </p>
            <div className="home-art__actions">
              <Link className="btn btn-light" to="/courses">
                Training paths
              </Link>
              <Link className="btn btn-ghost" to="/academy/therapists">
                Find a therapist
              </Link>
            </div>
          </Reveal>
        </div>
      </AnimatedGradient>

      <NewsletterSection />
    </>
  );
}
