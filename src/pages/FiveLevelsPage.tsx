import { useState } from "react";
import { Seo } from "@/components/Seo";
import { useSection, useRecords, SECTION } from "@/lib/sections";
import { videoEmbed } from "@/lib/cms";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { LineQuote } from "@/components/motion/LineQuote";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { VideoPlayer } from "@/components/sections/VideoPlayer";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/** name | short label | what this level covers */
const LEVELS_FALLBACK: string[][] = [
  ["Level 5", "The spiritual body", "Inherited and collective patterns — what was never ours to carry, and what resolves only when it is named."],
  ["Level 4", "The intuitive body", "Dreams, insight and the trauma held outside language; the level where healing is often unblocked."],
  ["Level 3", "The mental body", "Beliefs, unresolved conflict and the stories that keep a physiology braced."],
  ["Level 2", "The electric body", "The autonomic nervous system, fields and regulation — the level A.R.T. reads directly."],
  ["Level 1", "The physical body", "Anatomy, biochemistry, infections and toxicity: what conventional medicine sees first."],
];

/**
 * The 5 Levels of Healing.
 *
 * The pyramid is the page: the designer asked for hover states that "light up
 * or do something cool". Hovering or focusing a level raises it and shows its
 * description, and the levels are also a plain ordered list — the content is
 * complete for a reader who never hovers anything.
 */
export function FiveLevelsPage() {
  const page = useSection(SECTION.fiveLevels, {
    title: "The 5 Levels of Healing",
    paragraphs: [
      "Illness rarely lives on one level. The framework orders the levels so that treatment starts where the block actually is, rather than where the symptom shows.",
      "Each level rests on the one below it. Work at the physical level that ignores an unresolved level above it holds only as long as the treatment continues.",
    ],
  });
  const levels = useRecords(SECTION.fiveLevelsList, 3, LEVELS_FALLBACK);
  const video = videoEmbed(page.raw?.featuredVideo);
  const [open, setOpen] = useState(0);

  return (
    <>
      <Seo
        title={"The 5 Levels of Healing — Dr. Dietrich Klinghardt™"}
        description="The framework that places physical findings inside the mental, emotional and spiritual layers around them."
        path="/academy/five-levels"
      />

      <AnimatedGradient variant="plain" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Breadcrumbs
            items={[{ label: "Akademy", href: "/academy" }, { label: page.title }]}
          />
          <Reveal>
            <p className="eyebrow">A framework for wholeness</p>
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

      <section className="section wrap levels">
        {/* The first paragraph is already the hero lead. */}
        <Reveal className="levels__intro prose">
          {page.paragraphs.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Reveal>

        <ol className="pyramid">
          {levels.map(([name, label, description], index) => (
            <Reveal
              as="li"
              key={name}
              className={`pyramid__level${open === index ? " is-open" : ""}`}
              delay={index * 80}
              shift={12}
            >
              <button
                type="button"
                onMouseEnter={() => setOpen(index)}
                onFocus={() => setOpen(index)}
                onClick={() => setOpen(index)}
                aria-expanded={open === index}
              >
                <span className="pyramid__name">{name}</span>
                <span className="pyramid__label">{label}</span>
              </button>
              <p className="pyramid__body">{description}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="section home-quote">
        <div className="wrap">
          <LineQuote
            lines={["Treat the level", "where the block is,", "not the level", "where it hurts."]}
            cite="— Dr. Dietrich Klinghardt™"
          />
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
