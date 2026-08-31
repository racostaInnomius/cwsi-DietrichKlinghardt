import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useCollection } from "@/lib/content";
import { useSection, SECTION } from "@/lib/sections";
import { splitByTime } from "@/lib/format";
import { featuredProducts, usedCategories, useStoreProducts } from "@/lib/store";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { LineQuote } from "@/components/motion/LineQuote";
import { RotatingWord } from "@/components/motion/RotatingWord";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { EventRow } from "@/components/sections/EventRow";
import { ProductCard } from "@/components/sections/ProductCard";
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

  const { upcoming } = splitByTime(useCollection("events"));
  const featured = upcoming.slice(0, 3);

  // The shop strip shows the month's picks, the same ones the store leads with,
  // and falls back to the whole catalogue when nothing is ranked yet.
  const products = useStoreProducts();
  const categories = usedCategories(products);
  const picks = featuredProducts(products);
  const shopPicks = (picks.length ? picks : products).slice(0, 5);

  return (
    <>
      <Seo
        title={"Dr. Dietrich Klinghardt™ — Healing Beyond Symptoms"}
        description="Physician, educator and innovator in biological medicine. Autonomic Response Testing, the 5 Levels of Healing, live weekly talks and upcoming events."
        path="/"
      />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <AnimatedGradient variant="card" intensity="strong" className="hero">
        {/* Decorative: the headline already names the subject, so an alt text
            here would only repeat it to a screen reader. */}
        <img
          className="hero__photo"
          src="/images/hero-klinghardt.webp"
          alt=""
          width={1300}
          height={600}
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
      {/* Two columns with the image on the left, the way the design lays it
          out. The design puts a video thumbnail here; until the film has a host
          (D15) this is the still — the same frame its play control sits on. */}
      <AnimatedGradient variant="plain" intensity="soft" className="home-art">
        <div className="wrap home-art__inner">
          <Reveal className="home-art__media">
            <img
              src="/images/art-klinghardt.webp"
              alt="Dr. Klinghardt with a patient during an A.R.T. session"
              width={558}
              height={457}
              loading="lazy"
              decoding="async"
            />
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
              <Link className="btn btn-light" to="/academy/art">
                About the course
              </Link>
              <Link className="btn btn-ghost" to="/academy/therapists">
                Find a therapist
              </Link>
            </div>
          </Reveal>
        </div>
      </AnimatedGradient>

      {/* ── The clinic ───────────────────────────────────────────── */}
      <section className="section wrap feature-row feature-row--right">
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
            <Link className="btn btn-light" to="/sophia">
              Learn more
            </Link>
            <Link className="btn btn-ghost" to="/sophia/new-patients">
              New patients
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
                <Link className="pill" to="/store">
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

      <NewsletterSection />
    </>
  );
}
