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
import { FIVE_LEVELS_VIDEO } from "@/data/media";

type Level = {
  ordinal: string;
  /** The label inside the pyramid, e.g. "Spiritual (5 SB)". */
  name: string;
  /** The heading of the description beside it, e.g. "05 — Spiritual dimension". */
  heading: string;
  body: string;
  /** The mark the design sets at the right edge of each band. */
  glyph: string;
  accent: string;
};

/**
 * The five levels, transcribed from the Figma frame `0:4703` — ordinals,
 * labels, description headings, copy, glyphs and the accent colour each level
 * carries. Those accents are the design's own values, and they are what ties
 * a band of the pyramid to its paragraph on the right.
 */
const LEVELS: Level[] = [
  {
    ordinal: "05th",
    name: "Spiritual (5 SB)",
    heading: "05 — Spiritual dimension",
    body: "The spiritual core through which the divine learns within us.",
    glyph: "✦",
    accent: "#6a9ec0",
  },
  {
    ordinal: "04th",
    name: "Intuitive (4IB)",
    heading: "04 — Intuitive body",
    body: "A reality sensed only intuitively, beyond language and analysis. Shaped by family history and transpersonal forces.",
    glyph: "◉",
    accent: "#5e9b74",
  },
  {
    ordinal: "03rd",
    name: "Mental (3MB)",
    heading: "03 — Mental body",
    body: "Our information carrier, like a computer that stores memories and interprets perceptions.",
    glyph: "◇",
    accent: "#b89b40",
  },
  {
    ordinal: "02nd",
    name: "Energy Body (2EB)",
    heading: "02 — Energy body",
    body: "The link between mind and body — the level of biophysics.",
    glyph: "◈",
    accent: "#c9935a",
  },
  {
    ordinal: "01st",
    name: "Physical Body (1PB)",
    heading: "01 — Physical body",
    body: "The densest level, governed by mechanics, chemistry, and physics.",
    glyph: "⊕",
    accent: "#d4756b",
  },
];

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

      <AnimatedGradient variant="plain" intensity="soft" className="page-hero page-hero--center">
        <div className="wrap page-hero__inner">
          <Breadcrumbs
            items={[{ label: "Akademy", href: "/academy" }, { label: "The 5 Levels of Healing" }]}
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
        <Reveal className="pyramid" as="div">
          <span className="pyramid__axis pyramid__axis--left" aria-hidden="true">
            Objective reality
          </span>
          <span className="pyramid__axis pyramid__axis--right" aria-hidden="true">
            Subjective reality
          </span>

          <ol className="pyramid__stack">
            {LEVELS.map((level, index) => (
              <li
                key={level.ordinal}
                className={`pyramid__level${index === 0 ? " pyramid__level--apex" : ""}`}
                style={
                  {
                    "--accent": level.accent,
                    // Each band is wider than the one above it, as in the frame
                    // (387 → 480 → 574 → 667 of a 1440 canvas).
                    "--band": `${58 + (index - 1) * 14}%`,
                  } as React.CSSProperties
                }
              >
                <span className="pyramid__ordinal">{level.ordinal}</span>
                <span className="pyramid__name">{level.name}</span>
                <span className="pyramid__glyph" aria-hidden="true">
                  {level.glyph}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>

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
