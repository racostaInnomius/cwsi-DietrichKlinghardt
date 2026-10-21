import { Seo } from "@/components/Seo";
import { useSection, useCardList, SECTION } from "@/lib/sections";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/* The four labelled chapters and the timeline are cards of the
   "about-chapters" and "about-timeline" Page Contents blocks, reordered by
   dragging (copy in src/data/blocks.ts until the rows have it). A timeline
   card: Label = era, Subtitle = context line, then title and text. Rows still
   written the old way, one "a | b | c" line per record, keep working. */

/**
 * About — rebuilt from the Figma frame `0:5539`.
 *
 * The page used to open on "An Innovator in Medicine" and close on a quote we
 * had written; the frame opens on his name, states the biography in four
 * labelled chapters, and gives the timeline four fields per entry rather than
 * two. The designer asked for the timeline to animate as you scroll, which is
 * why each entry still reveals in turn.
 */
export function AboutPage() {
  const about = useSection(SECTION.about);
  const chapters = useCardList(SECTION.aboutChapters, 2, ([title, body]) => ({
    icon: "",
    title,
    body,
  }));
  const timeline = useCardList(SECTION.aboutTimeline, 4, ([label, subtitle, title, body]) => ({
    icon: "",
    label,
    subtitle,
    title,
    body,
  }));

  return (
    <>
      <Seo
        title={"About Dr. Dietrich Klinghardt™"}
        description="Physician, educator and author. The story behind Autonomic Response Testing and the 5 Levels of Healing."
        path="/about"
      />

      {/* Client (2026-09-18): "no debe tener un Hero" — no boxed/inset
          gradient card here; the design sits this title directly on the
          page's own ambient gradient (shell.css), the same plain-ground
          convention EventDetailPage uses. */}
      <section className="section wrap about-title">
        <Reveal>
          {about.eyebrow ? <p className="eyebrow"><Marked text={about.eyebrow} /></p> : null}
          <h1><Marked text={about.title} /></h1>
          {about.lead ? <p className="lead about__lead">{about.lead}</p> : null}
        </Reveal>
      </section>

      {/* Two columns only when there is a portrait — an empty half of the grid
          reads as a missing image rather than as space. */}
      <section
        className={`section wrap about-bio${about.image ? " about-bio--portrait" : ""}`}
      >
        {about.image ? (
          <Reveal>
            <img className="about-bio__portrait" src={about.image} alt="Dr. Dietrich Klinghardt" />
          </Reveal>
        ) : null}
        <div className="chapters">
          {chapters.cards.map(({ title: label, body }, index) => (
            <Reveal
              as="div"
              key={`${index}-${label}`}
              className="chapter"
              delay={(about.image ? 120 : 0) + index * 90}
            >
              <h2 className="chapter__label"><Marked text={label} /></h2>
              <p>{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section wrap">
        <Reveal className="section-heading section-heading--center">
          {timeline.eyebrow ? <p className="eyebrow"><Marked text={timeline.eyebrow} /></p> : null}
          <h2 className="section-title"><Marked text={timeline.title} /></h2>
        </Reveal>

        <ol className="timeline">
          {timeline.cards.map(({ label: era, subtitle: context, title, body }, index) => (
            <Reveal as="li" key={`${index}-${title}`} className="timeline__item" delay={index * 90}>
              <div className="timeline__era">
                <span className="timeline__year">{era}</span>
                {context ? <span className="timeline__context">{context}</span> : null}
              </div>
              <div>
                <h3><Marked text={title} /></h3>
                <p>{body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <NewsletterSection />
    </>
  );
}
