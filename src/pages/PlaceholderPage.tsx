import { Seo } from "@/components/Seo";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Breadcrumbs, type Crumb } from "@/components/shell/Breadcrumbs";

/**
 * Scaffold page for routes whose content arrives in a later phase (F2–F7).
 *
 * It is not filler: it exercises the real shell, theme, breadcrumbs and motion
 * primitives, so the navigation is genuinely walkable and any layout problem in
 * the frame shows up now rather than after five pages are built on top of it.
 * `noindex` keeps unfinished routes out of search while the site is live.
 */
export function PlaceholderPage({
  title,
  eyebrow,
  intro,
  phase,
  crumbs,
}: {
  title: string;
  eyebrow?: string;
  intro?: string;
  /** Which plan phase delivers this page — shown to us, not to visitors. */
  phase: string;
  crumbs?: Crumb[];
}) {
  return (
    <>
      <Seo
        title={`${title} — Dr. Dietrich Klinghardt`}
        noindex
      />

      <AnimatedGradient variant="page" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          {crumbs?.length ? <Breadcrumbs items={crumbs} /> : null}
          <Reveal>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h1>{title}</h1>
            {intro ? <p className="lead">{intro}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap">
        <Reveal>
          <p className="placeholder-note">
            This page is scaffolded. Content and layout land in <b>{phase}</b> of
            the implementation plan.
          </p>
        </Reveal>
      </section>
    </>
  );
}
