import { Seo } from "@/components/Seo";
import { useSection, SECTION } from "@/lib/sections";
import { videoEmbed } from "@/lib/cms";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { VideoPlayer } from "@/components/sections/VideoPlayer";
import { SelfHostedVideo } from "@/components/sections/SelfHostedVideo";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { Pyramid } from "@/components/Pyramid";
import { FIVE_LEVELS_VIDEO } from "@/data/media";
import { FIVE_LEVELS as LEVELS } from "@/data/fiveLevels";

/**
 * The 5 Levels of Healing.
 *
 * The pyramid is the page. It is built as a real ordered list — the top level
 * drawn as the apex and the four below it as bands that widen toward the base —
 * so the order survives with styles off, and each band is tied to its paragraph
 * by the level's own accent colour rather than by position alone.
 *
 * The two rotated words along the sides ("objective reality" climbing the left,
 * "subjective reality" the right) are decorative in the design's sense but not
 * in meaning: they name the axis the pyramid runs along, so they are real text,
 * marked aria-hidden only because the list already carries the order.
 */
export function FiveLevelsPage() {
  const page = useSection(SECTION.fiveLevels, {
    title: "The 5 Levels of Healing™",
    paragraphs: [
      "According to Dr. Dietrich Klinghardt™, humans exist in several dimensions at once: the physical body lives within a sphere of invisible bodies that surround and permeate it.",
      "Each higher level organises the ones below it, while the lower levels supply energy — so a problem can begin on any level and travel downward until it becomes visible.",
    ],
  });

  // A film uploaded to the CMS wins; otherwise the one we host ourselves.
  const embedded = videoEmbed(page.raw?.featuredVideo);

  return (
    <>
      <Seo
        title={"The 5 Levels of Healing — Dr. Dietrich Klinghardt™"}
        description="The framework that places physical findings inside the mental, emotional and spiritual layers around them."
        path="/academy/five-levels"
      />

      <AnimatedGradient variant="card" intensity="soft" className="page-hero page-hero--center">
        <div className="wrap page-hero__inner">
          <Breadcrumbs
            items={[{ label: "Akademie", href: "/academy" }, { label: "The 5 Levels of Healing" }]}
          />
          <Reveal>
            <p className="eyebrow">A framework for wholeness</p>
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap">
        <Reveal>
          {embedded ? (
            <VideoPlayer video={embedded} />
          ) : (
            <SelfHostedVideo {...FIVE_LEVELS_VIDEO} />
          )}
        </Reveal>
      </section>

      <section className="section wrap levels">
        <Pyramid />

        <div className="levels__legend">
          {LEVELS.map((level, index) => (
            <Reveal
              key={level.heading}
              className="levels__item"
              delay={index * 70}
              shift={12}
              style={{ "--accent": level.accent } as React.CSSProperties}
            >
              <h2>{level.heading}</h2>
              <p>{level.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section wrap">
        <Reveal as="blockquote" className="levels__quote">
          <p>
            “I have tried to establish some guidelines for therapists who aspire
            to a higher level in their work.{" "}
            <em>
              When improvements occur, both patient and physician should show
              gratitude and humility.
            </em>
            ”
          </p>
          <cite>— Dr. Dietrich Klinghardt™</cite>
        </Reveal>
      </section>

      <NewsletterSection />
    </>
  );
}
