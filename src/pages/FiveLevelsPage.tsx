import { Seo } from "@/components/Seo";
import { useSection, SECTION } from "@/lib/sections";
import { videoEmbed } from "@/lib/cms";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { VideoPlayer } from "@/components/sections/VideoPlayer";
import { SelfHostedVideo } from "@/components/sections/SelfHostedVideo";
import { LoopingVideo } from "@/components/sections/LoopingVideo";
import { FIVE_LEVELS_VIDEO, PYRAMID_VIDEO } from "@/data/media";

/**
 * The 5 Levels of Healing.
 *
 * The pyramid used to be a static image (`/images/5_levels.png`, client
 * request 2026-09-16) beside a text legend (heading + body per level, from
 * `FIVE_LEVELS`), before that the `<Pyramid />` component this page's
 * /academy hub card slot still uses (`<Pyramid compact />`, untouched). Now
 * (client, 2026-09-22) it's a short looping animation, `LoopingVideo` +
 * `PYRAMID_VIDEO` — and (same day, follow-up) the legend is gone entirely so
 * the video can fill the whole section instead of sharing it with text.
 * `5_levels.png` stays on as the video's poster frame.
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

      <section className="section wrap five-levels-hero">
        <Breadcrumbs
          items={[{ label: "Akademie", href: "/academy" }, { label: "The 5 Levels of Healing" }]}
        />
        <Reveal>
          <p className="eyebrow">A framework for wholeness</p>
          <h1><Marked text={page.title} /></h1>
          {page.lead ? <p className="lead">{page.lead}</p> : null}
        </Reveal>
      </section>

      <section className="section wrap five-levels-video">
        <Reveal>
          {embedded ? (
            <VideoPlayer video={embedded} />
          ) : (
            <SelfHostedVideo {...FIVE_LEVELS_VIDEO} />
          )}
        </Reveal>
      </section>

      <section className="section wrap levels">
        <LoopingVideo
          className="levels__pyramid-image"
          {...PYRAMID_VIDEO}
          width={1920}
          height={1080}
        />
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
    </>
  );
}
