import { Link } from "react-router-dom";
import { useSection } from "@/lib/sections";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Emphasis } from "@/components/Emphasis";
import { sectionMedia, isPlayerVideo } from "@/components/sections/SectionMedia";
import { InViewVideo } from "@/components/sections/InViewVideo";
import { PYRAMID_VIDEO } from "@/data/media";

/**
 * The 5 Levels pyramid slot, on /academy and on /academy/five-levels.
 *
 * It used to be the bundled animation and nothing else, so the only way to
 * change what it says was a deploy (client, 2026-11-05, for Ana: "prefiero
 * que tenga autonomía, que lo pueda cambiar por un video o por texto con una
 * imagen o texto con un video"). Now it is the "five-levels-pyramid" Page
 * Contents block, and what the editor fills decides what it shows:
 *
 *   - "Video destacado"  → a film from a video host, in the site's player.
 *   - "Imagen principal" → the file she uploaded: a picture, or a clip, which
 *                          plays itself once the way the pyramid always has.
 *   - neither            → the bundled animation, exactly as before.
 *
 * Adding a title or a paragraph turns the section into the site's two-column
 * row (copy on one side, media on the other); with no words it stays the full
 * width band it is today. So the three shapes the client asked for are three
 * fields in the panel, with no layout for her to choose.
 *
 * Both pages read the same block on purpose: she edits once and the hub and
 * the page it leads to never disagree.
 */
export function PyramidSlot({ linkTo }: { linkTo?: string }) {
  const block = useSection("five-levels-pyramid");
  const hasCopy = Boolean(block.title || block.eyebrow || block.paragraphs.length);

  const media =
    sectionMedia(block, { poster: PYRAMID_VIDEO.poster, title: PYRAMID_VIDEO.title }) ?? (
      <InViewVideo {...PYRAMID_VIDEO} width={1920} height={1080} />
    );

  // The whole picture is the link to the page the hub points at, but only
  // while it is a picture: wrapping a player in a link would steal the click
  // that starts it.
  const linkedMedia =
    linkTo && !isPlayerVideo(block) ? (
      <Link className="academy-pyramid__link" to={linkTo} aria-label={block.title || "The 5 Levels of Healing"}>
        {media}
      </Link>
    ) : (
      media
    );

  if (!hasCopy) {
    return (
      <section className="section wrap academy-pyramid">
        <Reveal>{linkedMedia}</Reveal>
      </section>
    );
  }

  return (
    <section className="section wrap feature-row feature-row--right academy-pyramid academy-pyramid--with-copy">
      <Reveal className="feature-row__media">{linkedMedia}</Reveal>
      <Reveal className="feature-row__body" delay={90}>
        {block.eyebrow ? <p className="eyebrow"><Marked text={block.eyebrow} /></p> : null}
        {block.title ? <h2><Marked text={block.title} /></h2> : null}
        {block.subtitle ? <p className="accent"><Marked text={block.subtitle} /></p> : null}
        {block.marked.map((paragraph) => (
          <p key={paragraph} className="feature-row__copy"><Emphasis text={paragraph} /></p>
        ))}
      </Reveal>
    </section>
  );
}
