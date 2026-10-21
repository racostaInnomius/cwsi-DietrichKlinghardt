import { Seo } from "@/components/Seo";
import { Emphasis } from "@/components/Emphasis";
import { useSection, SECTION } from "@/lib/sections";
import { videoEmbed } from "@/lib/cms";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { VideoPlayer } from "@/components/sections/VideoPlayer";
import { SelfHostedVideo } from "@/components/sections/SelfHostedVideo";
import { InViewVideo } from "@/components/sections/InViewVideo";
import { FIVE_LEVELS_VIDEO, PYRAMID_VIDEO } from "@/data/media";

/**
 * The 5 Levels of Healing.
 *
 * The pyramid used to be a static image (`/images/5_levels.png`, client
 * request 2026-09-16) beside a text legend (heading + body per level, from
 * `FIVE_LEVELS`), before that the `<Pyramid />` component this page's
 * /academy hub card slot still uses (`<Pyramid compact />`, untouched). Now
 * (client, 2026-09-22) it's a short animation that plays once, `InViewVideo`
 * + `PYRAMID_VIDEO` — the legend is gone entirely, and the video is sized to
 * match `.five-levels-video` above it (same 80%-of-.wrap cap) rather than
 * filling the section edge to edge. `5_levels.png` stays on as the video's
 * poster frame.
 */
export function FiveLevelsPage() {
  const page = useSection(SECTION.fiveLevels);
  // Italic runs in the CMS text (or *…* in blocks.ts) stay italic.
  const quote = useSection("five-levels-quote");

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
          {page.eyebrow ? <p className="eyebrow"><Marked text={page.eyebrow} /></p> : null}
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
        <InViewVideo
          className="levels__pyramid-image"
          {...PYRAMID_VIDEO}
          width={1920}
          height={1080}
        />
      </section>

      <section className="section wrap">
        <Reveal as="blockquote" className="levels__quote">
          {quote.marked.map((paragraph) => (
            <p key={paragraph}>
              <Emphasis text={paragraph} />
            </p>
          ))}
          {quote.subtitle ? <cite><Marked text={quote.subtitle} /></cite> : null}
        </Reveal>
      </section>
    </>
  );
}
