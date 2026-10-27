import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useSection } from "@/lib/sections";
import { videoEmbed } from "@/lib/cms";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Emphasis } from "@/components/Emphasis";
import { LineQuote } from "@/components/motion/LineQuote";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { VideoPlayer } from "@/components/sections/VideoPlayer";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { ButtonText } from "@/components/ButtonText";

/**
 * A.R.T. Klinghardt — what Autonomic Response Testing is, for the reader who
 * arrived from the navigation without knowing the term. The training path and
 * the practitioner directory are the two exits from this page.
 */
export function ArtPage() {
  const page = useSection("art");
  // The quote: one line per paragraph, Subtitle = who said it.
  const quote = useSection("art-quote");
  const next = useSection("art-next-steps");
  const video = videoEmbed(page.raw?.featuredVideo);

  return (
    <>
      <Seo
        title={"A.R.T. Klinghardt™ — Autonomic Response Testing"}
        description="Autonomic Response Testing: reading the body's own regulation to find what is driving illness, and in which order to treat it."
        path="/academy/art"
      />

      <AnimatedGradient variant="card" intensity="soft" className="page-hero academy-art-hero">
        <div className="wrap page-hero__inner">
          <Breadcrumbs
            items={[{ label: "Akademie", href: "/academy" }, { label: "A.R.T. Klinghardt" }]}
          />
          <Reveal>
            {page.eyebrow ? <p className="eyebrow"><Marked text={page.eyebrow} /></p> : null}
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
          {page.marked.slice(1).map((paragraph) => (
            <p key={paragraph}><Emphasis text={paragraph} /></p>
          ))}
        </Reveal>
      </section>

      <section className="section home-quote">
        <div className="wrap">
          <LineQuote lines={quote.paragraphs} cite={quote.subtitle} />
        </div>
      </section>

      <AnimatedGradient variant="plain" intensity="soft" className="home-art">
        <div className="wrap home-art__inner">
          <Reveal>
            {next.eyebrow ? <p className="eyebrow"><Marked text={next.eyebrow} /></p> : null}
            <h2><Marked text={next.title} /></h2>
            {next.marked.map((paragraph) => (
              <p key={paragraph} className="home-art__copy">
                <Emphasis text={paragraph} />
              </p>
            ))}
            <div className="home-art__actions">
              <Link className="btn btn-light" to="/courses">
                <ButtonText id="art-training-paths" />
              </Link>
              <Link className="btn btn-ghost" to="/academy/therapists">
                <ButtonText id="art-find-practitioner" />
              </Link>
            </div>
          </Reveal>
        </div>
      </AnimatedGradient>

      <NewsletterSection />
    </>
  );
}
