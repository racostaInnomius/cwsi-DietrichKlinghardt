import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useCollection } from "@/lib/content";
import { useSection, SECTION } from "@/lib/sections";
import { splitByTime } from "@/lib/format";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { LineQuote } from "@/components/motion/LineQuote";
import { RotatingWord } from "@/components/motion/RotatingWord";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { EventRow } from "@/components/sections/EventRow";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/**
 * Home — the frame the rest of the site is measured against.
 *
 * Every block reads its copy from a `page-contents` row (see `SECTION`) and
 * falls back to the design's own words, so the page is complete on day one and
 * becomes editable the moment the rows exist in the CMS. The events strip is
 * live data: the three nearest upcoming events, hidden entirely when there are
 * none rather than showing an empty shelf.
 */
export function HomePage() {
  const hero = useSection(SECTION.homeHero, {
    title: "Healing Beyond Symptoms",
    paragraphs: [
      "For over forty years, Dr. Dietrich Klinghardt has asked the question most medicine skips: not what disease you have, but why you became ill.",
    ],
  });
  const intro = useSection(SECTION.homeIntro, {
    title: "An Innovator in Medicine",
    paragraphs: [
      "Physician, teacher and researcher, Dr. Klinghardt has spent his career at the meeting point of neurobiology, toxicology and the psychology of illness — building a body of work that treats the person, not the diagnosis.",
      "His Autonomic Response Testing (A.R.T.) and the 5 Levels of Healing are taught today by practitioners in more than thirty countries.",
    ],
  });
  const eventsCopy = useSection(SECTION.homeEvents, {
    title: "Learn Directly from Dr. Klinghardt",
    paragraphs: [
      "Workshops, seminars and live webinars — in person and online.",
    ],
  });
  const art = useSection(SECTION.homeArt, {
    title: "Autonomic Response Testing",
    paragraphs: [
      "A.R.T. is a diagnostic method that reads the body's own regulation to find what is driving illness — infections, toxicity, unresolved trauma — and in which order it must be addressed.",
    ],
  });
  const shop = useSection(SECTION.homeShop, {
    title: "Explore the Klinghardt Store",
    paragraphs: [
      "Books, work materials, testing kits and professional resources, curated by Dr. Klinghardt.",
    ],
  });
  const talks = useSection(SECTION.homeTalks, {
    title: "Join My Weekly Talks",
    paragraphs: [
      "Every week, a live session with Dr. Klinghardt: a short teaching, then open questions from the community.",
    ],
  });

  const { upcoming } = splitByTime(useCollection("events"));
  const featured = upcoming.slice(0, 3);

  return (
    <>
      <Seo
        title={"Dr. Dietrich Klinghardt™ — Healing Beyond Symptoms"}
        description="Physician, educator and innovator in biological medicine. Autonomic Response Testing, the 5 Levels of Healing, live weekly talks and upcoming events."
        path="/"
      />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <AnimatedGradient variant="hero" intensity="strong" className="hero">
        <div className="wrap hero__inner">
          <Reveal>
            <p className="eyebrow hero__eyebrow">Dr. Dietrich Klinghardt™</p>
            <h1 className="display-xl">
              Healing Beyond{" "}
              <RotatingWord words={["Symptoms", "Diagnosis", "Labels"]} />
            </h1>
            <p className="hero__lead">{hero.lead}</p>
            <div className="hero__actions">
              <Link className="btn btn-light" to="/about">
                Learn more
              </Link>
              <Link className="btn btn-ghost" to="/events">
                Upcoming events
              </Link>
            </div>
          </Reveal>
        </div>
      </AnimatedGradient>

      {/* ── Intro ────────────────────────────────────────────────── */}
      <section className="section wrap home-intro">
        <Reveal className="home-intro__grid">
          <div>
            <p className="eyebrow">About</p>
            <h2>{intro.title}</h2>
          </div>
          <div className="prose">
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link className="arrow-link" to="/about">
              Read his story <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Quote ────────────────────────────────────────────────── */}
      <section className="section home-quote">
        <div className="wrap">
          <LineQuote
            lines={[
              "The question is never",
              "what disease you have,",
              "but why you became ill.",
            ]}
            cite="— Dr. Dietrich Klinghardt™"
          />
        </div>
      </section>

      {/* ── Upcoming events ──────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="section wrap home-events">
          <SectionHeading
            eyebrow="Events & webinars"
            title={eventsCopy.title}
            lead={eventsCopy.lead}
            link={{ label: "All events", to: "/events" }}
          />
          <ul className="event-list">
            {featured.map((event, index) => (
              <EventRow
                key={String(event.id ?? index)}
                event={event}
                delay={index * 90}
              />
            ))}
          </ul>
        </section>
      )}

      {/* ── A.R.T. ───────────────────────────────────────────────── */}
      <AnimatedGradient variant="section" intensity="soft" className="home-art">
        <div className="wrap home-art__inner">
          <Reveal>
            <p className="eyebrow">A.R.T. Klinghardt™</p>
            <h2>{art.title}</h2>
            {art.paragraphs.map((paragraph) => (
              <p key={paragraph} className="home-art__copy">
                {paragraph}
              </p>
            ))}
            <div className="home-art__actions">
              <Link className="btn btn-light" to="/academy/art">
                Discover A.R.T.
              </Link>
              <Link className="btn btn-ghost" to="/academy/therapists">
                Find a therapist
              </Link>
            </div>
          </Reveal>
        </div>
      </AnimatedGradient>

      {/* ── Store + Weekly talks ─────────────────────────────────── */}
      <section className="section wrap home-teasers">
        <Reveal as="article" className="teaser">
          <p className="eyebrow">Shop</p>
          <h3>{shop.title}</h3>
          <p>{shop.lead}</p>
          <Link className="arrow-link" to="/store">
            Visit the store <span aria-hidden="true">↗</span>
          </Link>
        </Reveal>

        <Reveal as="article" className="teaser teaser--brand" delay={120}>
          <p className="eyebrow">Weekly talks</p>
          <h3>{talks.title}</h3>
          <p>{talks.lead}</p>
          <Link className="arrow-link" to="/weekly-talks">
            Join the next session <span aria-hidden="true">↗</span>
          </Link>
        </Reveal>
      </section>

      <NewsletterSection />
    </>
  );
}
