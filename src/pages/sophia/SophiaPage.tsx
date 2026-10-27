import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useSection, SECTION } from "@/lib/sections";
import { Reveal } from "@/components/motion/Reveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Marked } from "@/components/Marked";
import { Emphasis } from "@/components/Emphasis";
import { CardIcon } from "@/components/CardIcon";
import { CtaBand } from "@/components/sections/CtaBand";
import { InViewVideo } from "@/components/sections/InViewVideo";
import { SOPHIA_WELCOME_VIDEO } from "@/data/media";
import { ButtonText } from "@/components/ButtonText";

/* Client (2026-09-12), via the designer: "para los numeros... podemos
   hacer un conteo" — each figure counts up. In the CMS a figure is written the
   way it reads ("25+", "10K", "100%", in the card's Label); this splits it
   into the target number + suffix/format AnimatedCounter needs. */
function figure(label: string): { to: number; suffix?: string; format?: "k" } | null {
  const match = /^\s*(\d+(?:[.,]\d+)?)\s*(k)?\s*(.*)$/i.exec(label);
  if (!match) return null;
  const value = Number(match[1].replace(",", "."));
  return match[2]
    ? { to: value * 1000, format: "k", suffix: match[3] || undefined }
    : { to: value, suffix: match[3] || undefined };
}

/** The alt text an uploaded image carries in the CMS, if any. */
function imageAlt(media: unknown): string {
  const alt = media && typeof media === "object" ? (media as { alt?: unknown }).alt : undefined;
  return typeof alt === "string" ? alt.trim() : "";
}

// Every block on this page is a Page Contents row (copy in src/data/blocks.ts
// until the row has it): sophia-home, -figures, -our-approach, -six-pillars,
// -cutting-edge-science, -naturopathic-care, -what-we-treat and the shared
// sophia-cta-stop-wondering. Cards are reordered by dragging them in the CMS.

/**
 * Sophia Health Institute — the clinic's own landing.
 *
 * Rebuilt from the Figma frame `0:6594`, which is a full landing page: who the
 * clinic is, the figures, six pillars, how care actually runs, the therapies,
 * what it treats, and the closing band. The previous version carried three
 * invented headings and none of this — it was the page furthest from the design
 * in the whole audit (D2).
 */
export function SophiaPage() {
  const page = useSection(SECTION.sophiaHome);
  const figures = useSection(SECTION.sophiaFigures);
  const approach = useSection(SECTION.sophiaOurApproach);
  const pillars = useSection(SECTION.sophiaSixPillars);
  const science = useSection(SECTION.sophiaCuttingEdgeScience);
  const care = useSection(SECTION.sophiaCare);
  const conditions = useSection(SECTION.sophiaWhatWeTreat);

  return (
    <>
      <Seo
        title={"Sophia Health Institute™ — Dr. Dietrich Klinghardt™"}
        description="A world-renowned healing centre for complex chronic illness: root-cause medicine, A.R.T. and the 5 Levels of Healing."
        path="/sophia"
      />

      {/* A brand lockup over the campus photo — the marketing headline lives
          in the section below instead, next to the same photo the design
          repeats there. */}
      <section className="sophia-hero">
        <img
          className="sophia-hero__photo"
          src="/images/sophia-welcome.webp"
          alt="Sophia Health Institute campus"
          width={1600}
          height={900}
          fetchPriority="high"
          decoding="async"
        />
        <div className="wrap sophia-hero__inner">
          <Reveal className="sophia-hero__content">
            <img
              className="sophia-hero__logo"
              src="/images/sophoa%20lockup_white.svg"
              alt="Sophia Health Institute by Dr. Klinghardt™"
              width={414}
              height={157}
            />
            <div className="sophia-hero__actions">
              <Link className="btn btn-light" to="/sophia/new-patients">
                <span className="btn-label"><ButtonText id="sophia-hero-new-patient" /></span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link className="btn btn-ghost" to="/sophia/accommodations">
                <span className="btn-label"><ButtonText id="sophia-hero-travel" /></span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Who we are — the campus photo, the claim and the copy. */}
      <section className="section wrap feature-row feature-row--right">
        <Reveal className="feature-row__media feature-row__media--match-copy">
          <InViewVideo {...SOPHIA_WELCOME_VIDEO} width={848} height={480} loop />
        </Reveal>

        <Reveal className="feature-row__body" delay={90}>
          {page.eyebrow ? <p className="eyebrow"><Marked text={page.eyebrow} /></p> : null}
          <h2 className="sophia-welcome-title"><Marked text={page.title} /></h2>
          {page.lead ? <p className="feature-row__copy">{page.lead}</p> : null}
          <Link className="btn btn-primary" to="/sophia/new-patients">
            <ButtonText id="sophia-new-patients" /> <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </section>

      {/* The figures on the left, the mission statement on the right. */}
      <section className="section wrap feature-row">
        {/* Figma comment (Noemi Cruz): "animar" — each tile now reveals on
            its own as you scroll to it, staggered, instead of the whole
            grid fading up as one flat block. */}
        <div className="feature-row__media stat-grid">
          {figures.cards.map((stat, index) => {
            const count = figure(stat.label ?? "");
            return (
              <Reveal as="div" key={`${index}-${stat.title}`} className="stat" delay={index * 80} shift={12}>
                <p className="stat__value">
                  {count ? (
                    <AnimatedCounter to={count.to} suffix={count.suffix} format={count.format} />
                  ) : (
                    stat.label
                  )}
                </p>
                <p className="stat__label">{stat.title}</p>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="feature-row__body" delay={90}>
          {approach.eyebrow ? <p className="eyebrow"><Marked text={approach.eyebrow} /></p> : null}
          <h2><Marked text={approach.title} /></h2>
          {approach.marked.map((paragraph) => (
            <p key={paragraph} className="feature-row__copy">
              <Emphasis text={paragraph} />
            </p>
          ))}
        </Reveal>
      </section>

      <section className="section wrap">
        <Reveal className="section-heading section-heading--center sophia-pillars-heading">
          {pillars.eyebrow ? <p className="eyebrow"><Marked text={pillars.eyebrow} /></p> : null}
          <h2><Marked text={pillars.title} /></h2>
        </Reveal>
        {/* Client (2026-10-21): the block's Hero image (Page Contents →
            sophia-six-pillars), when one is set, as a wide banner between
            the heading and the cards. */}
        {pillars.image ? (
          <Reveal className="sophia-pillars-photo" shift={16}>
            <img
              src={pillars.image}
              alt={imageAlt(pillars.raw?.heroImage) || "The reception at Sophia Health Institute"}
              loading="lazy"
              decoding="async"
            />
          </Reveal>
        ) : null}
        <ul className="card-grid card-grid--3 sophia-pillars-grid">
          {pillars.cards.map((pillar, index) => (
            <Reveal as="li" key={`${index}-${pillar.title}`} className="card" delay={index * 60} shift={12}>
              <div className="card__icon"><CardIcon name={pillar.icon} /></div>
              <h3><Marked text={pillar.title} /></h3>
              {pillar.body ? <p>{pillar.body}</p> : null}
            </Reveal>
          ))}
        </ul>
        <Reveal className="section-actions" delay={120}>
          <Link className="btn btn-primary" to="/sophia/new-patients">
            <ButtonText id="sophia-new-patients" /> <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </section>

      {/* How care runs: the prose on the left, the numbered steps on the
          right. Each step now reveals on its own as it scrolls into view,
          staggered — same fix as the stat tiles above, not the whole list
          fading up as one flat block. */}
      <section className="section wrap feature-row feature-row--right">
        <div className="feature-row__media steps">
          <ol>
            {science.cards.map((step, index) => (
              <Reveal as="li" key={`${index}-${step.title}`} className="step" delay={index * 90} shift={12}>
                <span className="step__n">{step.label || String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3><Marked text={step.title} /></h3>
                  {step.body ? <p>{step.body}</p> : null}
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal className="feature-row__body" delay={90}>
          {science.eyebrow ? <p className="eyebrow"><Marked text={science.eyebrow} /></p> : null}
          <h2><Marked text={science.title} /></h2>
          {science.marked.map((paragraph) => (
            <p key={paragraph} className="feature-row__copy">
              <Emphasis text={paragraph} />
            </p>
          ))}
        </Reveal>
      </section>

      <section className="section wrap" id="naturopathic-care">
        <Reveal className="section-heading section-heading--center sophia-therapies-heading">
          {care.eyebrow ? <p className="eyebrow"><Marked text={care.eyebrow} /></p> : null}
          <h2><Marked text={care.title} /></h2>
        </Reveal>
        <ul className="card-grid card-grid--4 sophia-therapies-grid">
          {care.cards.map((therapy, index) => (
            <Reveal as="li" key={`${index}-${therapy.title}`} className="card" delay={(index % 4) * 60} shift={12}>
              <div className="card__icon"><CardIcon name={therapy.icon} /></div>
              <h3><Marked text={therapy.title} /></h3>
              {therapy.body ? <p>{therapy.body}</p> : null}
            </Reveal>
          ))}
        </ul>
        <Reveal className="section-actions" delay={120}>
          <Link className="btn btn-primary" to="/sophia/new-patients">
            <ButtonText id="sophia-become-a-new-patient" /> <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </section>

      <section className="section wrap" id="chronic-illness">
        <Reveal className="section-heading section-heading--center sophia-conditions-heading">
          {conditions.eyebrow ? <p className="eyebrow"><Marked text={conditions.eyebrow} /></p> : null}
          <h2><Marked text={conditions.title} /></h2>
        </Reveal>
        <Reveal className="pill-list sophia-conditions-pills" delay={90}>
          {conditions.cards.map((condition, index) => (
            <span key={`${index}-${condition.title}`} className="pill">
              <Marked text={condition.title} />
            </span>
          ))}
        </Reveal>
      </section>

      <CtaBand className="cta-band--dark" slug={SECTION.sophiaCtaStopWondering}
      >
        <Link className="btn btn-light" to="/sophia/new-patients">
          <ButtonText id="sophia-become-a-new-patient" /> <span aria-hidden="true">→</span>
        </Link>
      </CtaBand>
    </>
  );
}
