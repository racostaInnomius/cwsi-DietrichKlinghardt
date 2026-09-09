import { useEffect, useState } from "react";
import Lenis from "lenis";
import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useCollection } from "@/lib/content";
import { useSection, SECTION } from "@/lib/sections";
import { splitByTime } from "@/lib/format";
import { featuredProducts, usedCategories, useStoreProducts } from "@/lib/store";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { RotatingWord } from "@/components/motion/RotatingWord";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { EventRow } from "@/components/sections/EventRow";
import { ProductCard } from "@/components/sections/ProductCard";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { SelfHostedVideo } from "@/components/sections/SelfHostedVideo";
import { FIVE_LEVELS_VIDEO } from "@/data/media";

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
  const intro = useSection(SECTION.homeIntro, {
    title: "Dr. Klinghardt Akademie™",
    paragraphs: [
      "Training programmes and certifications for practitioners who want to bring Autonomic Response Testing and the 5 Levels of Healing into their own practice — taught by Dr. Klinghardt and the team he has trained worldwide.",
    ],
  });
  const eventsCopy = useSection(SECTION.homeEvents, {
    title: "Learn Directly from Dr. Klinghardt",
    paragraphs: [
      "Workshops, seminars and live webinars — in person and online.",
    ],
  });
  const art = useSection(SECTION.homeArt, {
    // The frame's own heading. "Autonomic Response Testing" is the line the
    // design sets underneath it, in Fraunces — not the heading itself.
    title: "A.R.T. Klinghardt™",
    paragraphs: [
      "A.R.T. is a diagnostic method that reads the body's own regulation to find what is driving illness — infections, toxicity, unresolved trauma — and in which order it must be addressed.",
    ],
  });
  const shop = useSection(SECTION.homeShop, {
    title: "Explore the Shop",
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

  // The whole opening line (title + first paragraph) reveals as one
  // continuous letter cascade (2026-09-04: "quiero que animes todo el
  // párrafo") — staggerMs is derived from its combined length so a longer
  // CMS edit still finishes cascading in about a second, not several.
  const introTitleChars = intro.title.split(" ").join("").length;
  const introBodyChars = intro.paragraphs[0].split(" ").join("").length;
  const introStaggerMs = Math.max(
    4,
    Math.min(18, 1300 / (introTitleChars + introBodyChars)),
  );

  // Client: only these two phrases carry bold in the Academy quote, the rest
  // of the paragraph stays regular. Split around them (rather than hand-
  // authoring three separate strings) so the CMS's own paragraph text still
  // gets the same treatment as long as it contains these phrases verbatim.
  // Each segment keeps its own charOffset so the letter cascade still reads
  // as one continuous sweep across the whole line.
  const introBoldPhrases = [
    "Training programmes and certifications for practitioners",
    "taught by Dr. Klinghardt",
  ];
  const introBodySegments = (() => {
    const pattern = new RegExp(
      `(${introBoldPhrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    );
    let offset = introTitleChars;
    return intro.paragraphs[0]
      .split(pattern)
      .filter(Boolean)
      .map((text) => {
        const charOffset = offset;
        offset += text.split(" ").join("").length;
        return { text, bold: introBoldPhrases.includes(text), charOffset };
      });
  })();

  const { upcoming, past } = splitByTime(useCollection("events"));
  const [eventsTab, setEventsTab] = useState<"upcoming" | "past">("upcoming");
  const featured = (eventsTab === "upcoming" ? upcoming : past).slice(0, 3);

  // The shop strip shows the month's picks, the same ones the store leads with,
  // and falls back to the whole catalogue when nothing is ranked yet.
  const products = useStoreProducts();
  const categories = usedCategories(products);
  const picks = featuredProducts(products);
  const shopPicks = (picks.length ? picks : products).slice(0, 5);

  // Drives two things every frame, Home only:
  //  1. A 0→1 scroll-progress custom property on each pinned card's own
  //     element (--hero-scroll, --newsletter-scroll), which sections.css
  //     reads to slide that card's oversized background image — the
  //     gradient scrolling *inside* the still-rounded/still-pinned card.
  //     Computed from each .home-*-pin wrapper's own position, independent
  //     of Lenis, so it keeps working under reduced-motion (only the
  //     inertia is skipped there, never the pin effect itself).
  //  2. Lenis, giving the scroll real inertia — duration/easing measured
  //     directly off newgenre.studio (a single wheel tick there takes
  //     ~450ms to settle; this matches that curve). Skipped under
  //     reduced-motion.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const lenis = prefersReducedMotion
      ? null
      : new Lenis({
          duration: 0.75,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });

    const pins: Array<[wrapper: string, card: string, prop: string]> = [
      [".home-hero-pin", ".plain-section.hero", "--hero-scroll"],
      [".home-newsletter-pin", ".plain-section.newsletter", "--newsletter-scroll"],
    ];

    // Lerped wheel/touch multiplier — 1 is normal speed. The pinned hero
    // dwell holds the card still on screen for a long scroll distance,
    // which tempts people into scrolling harder than they realize; that
    // pent-up speed used to carry Academy's reveal straight past the
    // viewport before its own letters finished cascading in (2026-09-04:
    // "sale a toda velocidad"). Softened here rather than shortening the
    // dwell itself, which the gradient's own pacing still needs.
    let scrollEase = 1;
    const HERO_RELEASE_DAMP = 0.4;
    const HERO_RAMP_IN = 0.85; // hero-scroll progress where softening begins

    let frame: number;
    function raf(time: number) {
      lenis?.raf(time);

      let heroProgress = 0;
      let heroPastReleasePx = 0;

      for (const [wrapperSelector, cardSelector, prop] of pins) {
        const wrapper = document.querySelector<HTMLElement>(wrapperSelector);
        const card = document.querySelector<HTMLElement>(cardSelector);
        if (!wrapper || !card) continue;
        const rect = wrapper.getBoundingClientRect();
        // The card's own height, not window.innerHeight — CSS sticky's
        // real release point is wrapper height minus the sticky element's
        // OWN height, and the hero card is deliberately shorter than the
        // viewport (80vh) since 2026-09-04. Using the viewport height here
        // would release the card early and desync --hero-scroll from where
        // it actually unsticks.
        const dwell = rect.height - card.getBoundingClientRect().height;
        const progress = dwell > 0 ? Math.min(1, Math.max(0, -rect.top / dwell)) : 0;
        card.style.setProperty(prop, String(progress));
        if (wrapperSelector === ".home-hero-pin") {
          heroProgress = progress;
          heroPastReleasePx = dwell > 0 ? Math.max(0, -rect.top - dwell) : 0;
        }
      }

      if (lenis) {
        // Ramp the multiplier down approaching release, hold it soft for
        // just over half a screen height past release (enough for Academy's
        // reveal to trigger and finish), then ramp back to normal.
        const rampOutPx = window.innerHeight * 0.55;
        let targetEase = 1;
        if (heroPastReleasePx > 0) {
          targetEase =
            HERO_RELEASE_DAMP +
            (1 - HERO_RELEASE_DAMP) * Math.min(1, heroPastReleasePx / rampOutPx);
        } else if (heroProgress > HERO_RAMP_IN) {
          const into = (heroProgress - HERO_RAMP_IN) / (1 - HERO_RAMP_IN);
          targetEase = 1 - (1 - HERO_RELEASE_DAMP) * into;
        }
        scrollEase += (targetEase - scrollEase) * 0.12;
        lenis.options.wheelMultiplier = scrollEase;
        lenis.options.touchMultiplier = scrollEase;
      }

      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, []);

  return (
    <>
      <Seo
        title={"Dr. Dietrich Klinghardt™ — Healing Beyond Symptoms"}
        description="Physician, educator and innovator in biological medicine. Autonomic Response Testing, the 5 Levels of Healing, live weekly talks and upcoming events."
        path="/"
      />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="home-hero-pin">
        <AnimatedGradient variant="plain" className="hero">
          {/* Decorative: the headline already names the subject, so an alt text
              here would only repeat it to a screen reader. */}
          <img
            className="hero__photo"
            src="/images/hero-klinghardt-transparent.webp"
            alt=""
            width={1920}
            height={1080}
            fetchPriority="high"
            decoding="async"
          />
          <div className="wrap hero__inner">
            <Reveal>
              <p className="eyebrow hero__eyebrow">Dr. Dietrich Klinghardt™</p>
              <h1 className="display-xl">
                Healing Beyond{" "}
                <RotatingWord words={["Symptoms", "Diagnosis", "Labels"]} />
              </h1>
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
      </div>

      {/* ── Academy teaser ───────────────────────────────────────── */}
      <AnimatedGradient variant="plain" className="home-academy">
        <div className="home-academy__inner">
          <Reveal className="home-academy__block">
            {/* The title reads as the opening words of the paragraph, not a
                heading over it — an inline ARIA heading keeps it in the
                document outline without breaking the line before the copy.
                Both spans share one letter-index (charOffset) so the cascade
                reads as a single sweep across the whole line. */}
            <p className="home-academy__copy">
              <SplitReveal
                as="span"
                text={intro.title}
                className="home-academy__title"
                role="heading"
                aria-level={2}
                staggerMs={introStaggerMs}
              />
              {introBodySegments.map((segment, i) => (
                <SplitReveal
                  key={i}
                  as="span"
                  text={segment.text}
                  charOffset={segment.charOffset}
                  staggerMs={introStaggerMs}
                  className={segment.bold ? "home-academy__copy--bold" : undefined}
                />
              ))}
            </p>
            {intro.paragraphs.slice(1).map((paragraph) => (
              <p key={paragraph} className="home-academy__copy">
                {paragraph}
              </p>
            ))}
            <Link className="btn btn-ghost" to="/academy">
              Learn more
            </Link>
          </Reveal>
        </div>
      </AnimatedGradient>

      {/* ── Upcoming events ──────────────────────────────────────── */}
      {(upcoming.length > 0 || past.length > 0) && (
        <section className="section wrap home-events">
          <SectionHeading
            eyebrow="Events & webinars"
            title={eventsCopy.title}
            lead={eventsCopy.lead}
            link={{ label: "View all events", to: "/events" }}
          />

          <div className="tabs" role="tablist" aria-label="Event dates">
            <button
              type="button"
              role="tab"
              className="tab"
              aria-selected={eventsTab === "upcoming"}
              onClick={() => setEventsTab("upcoming")}
            >
              Upcoming <span>{upcoming.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              className="tab"
              aria-selected={eventsTab === "past"}
              onClick={() => setEventsTab("past")}
            >
              Past <span>{past.length}</span>
            </button>
          </div>

          {featured.length ? (
            <ul className="event-list">
              {featured.map((event, index) => (
                <EventRow
                  key={String(event.id ?? index)}
                  event={event}
                  delay={index * 90}
                  showPrice={false}
                />
              ))}
            </ul>
          ) : (
            <p className="empty-note">
              {eventsTab === "upcoming"
                ? "New dates are being confirmed. Join the newsletter below and you’ll hear first."
                : "No past events are archived yet."}
            </p>
          )}
        </section>
      )}

      {/* ── A.R.T. ───────────────────────────────────────────────── */}
      {/* Two columns with the media on the left, the way the design lays it
          out. D15's placeholder still is gone now that the film has a host —
          this reuses the same self-hosted video as /academy/five-levels
          (2026-09-05), in the still's own 558:457 box (sections.css). */}
      <AnimatedGradient variant="plain" intensity="soft" className="home-art">
        <div className="wrap home-art__inner">
          <Reveal className="home-art__media">
            <SelfHostedVideo {...FIVE_LEVELS_VIDEO} />
          </Reveal>
          <Reveal className="home-art__body">
            <p className="eyebrow">Diagnostic method</p>
            <h2>{art.title}</h2>
            <p className="accent home-art__accent">
              Autonomic Response Testing<sup className="tm">®</sup>
            </p>
            {art.paragraphs.map((paragraph) => (
              <p key={paragraph} className="home-art__copy">
                {paragraph}
              </p>
            ))}
            <div className="home-art__actions">
              <Link className="btn btn-outline" to="/academy/art">
                About the course
              </Link>
              <Link className="btn btn-primary" to="/academy/therapists">
                Find a therapist <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </AnimatedGradient>

      {/* ── The clinic ───────────────────────────────────────────── */}
      <section className="section wrap feature-row feature-row--right" id="our-clinic">
        <Reveal className="feature-row__media">
          <img
            src="/images/sophia-clinic.webp"
            alt="The Sophia Health Institute, seen from the garden"
            width={1024}
            height={683}
            loading="lazy"
            decoding="async"
          />
        </Reveal>
        <Reveal className="feature-row__body" delay={90}>
          <p className="eyebrow">Our clinic</p>
          <h2>Sophia Health Institute by Dr. Dietrich Klinghardt™</h2>
          <p className="feature-row__copy">
            A world-renowned healing centre offering a truly individualised,
            root-cause approach to complex chronic illness — one that looks
            beyond symptoms to the deeper origins of disease, supporting each
            person's journey toward optimal physical, emotional, mental and
            spiritual well-being.
          </p>
          <div className="feature-row__actions">
            <Link className="btn btn-ghost" to="/sophia">
              Learn more
            </Link>
            <Link className="btn btn-primary" to="/sophia/new-patients">
              New patients <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Weekly talks ─────────────────────────────────────────── */}
      <section className="section wrap">
        <AnimatedGradient variant="card-warm" intensity="soft" className="talks-band">
          <div className="talks-band__inner">
            {/* The heading spans the full width above both columns, as in the
                frame, where it is the largest type on the page. */}
            <h2 className="talks-band__title">{talks.title}</h2>

            <Reveal className="talks-band__media">
              <img
                src="/images/weekly-talks-live.webp"
                alt="A live Weekly Talk session with Dr. Klinghardt"
                width={388}
                height={277}
                loading="lazy"
                decoding="async"
              />
            </Reveal>

            <Reveal className="talks-band__body" delay={110}>
              <p className="eyebrow">Exclusive material</p>
              <h3 className="display-md">Join Now For Full Access</h3>
              <p>{talks.lead}</p>
              <Link className="btn btn-ghost" to="/weekly-talks">
                Join my talks
              </Link>
            </Reveal>
          </div>
        </AnimatedGradient>
      </section>

      {/* ── Shop ─────────────────────────────────────────────────── */}
      <section className="section wrap home-shop">
        <Reveal className="section-heading section-heading--center">
          <h2>{shop.title}</h2>
          <p className="lead">{shop.lead}</p>
        </Reveal>

        {categories.length > 0 && (
          <Reveal className="home-shop__filters" delay={80}>
            <ul className="pill-list">
              {/* Links rather than filters: the filtering itself lives on the
                  store page, and duplicating that state here would give the
                  same catalogue two places to disagree about what is selected. */}
              <li>
                <Link className="pill pill--active" to="/store">
                  All
                </Link>
              </li>
              {categories.map((item) => (
                <li key={item.key}>
                  <Link className="pill" to="/store">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link className="arrow-link" to="/store">
              Shop all <span aria-hidden="true">↗</span>
            </Link>
          </Reveal>
        )}

        {shopPicks.length > 0 ? (
          <ul className="product-strip">
            {shopPicks.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                delay={index * 60}
                featured={index === 0}
              />
            ))}
          </ul>
        ) : (
          <Reveal className="section-actions">
            <Link className="btn btn-light" to="/store">
              Visit the store
            </Link>
          </Reveal>
        )}
      </section>

      <div className="home-newsletter-pin">
        <NewsletterSection />
      </div>
    </>
  );
}
