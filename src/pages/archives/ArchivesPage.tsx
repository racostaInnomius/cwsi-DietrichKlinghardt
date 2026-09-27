import { Seo } from "@/components/Seo";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Archives — content removed (client, 2026-09-27): everything previously
 * here was migrated from klinghardt-akademie.de, and the client had already
 * flagged it as wrong pending real content ("todo lo que contiene
 * /archives/* está incorrecto, estoy en espera de lo que verdaderamente
 * contendrá" — images, video, music and past Weekly Talk recordings).
 * Cleared to the same "not published yet" empty state other pages on this
 * site use for missing content (LegalPage.tsx, SophiaTeamPage.tsx,
 * MusicPage.tsx) rather than left showing the German placeholder copy.
 * Nothing else touched: the nav's Archives entry and its three /archives/*
 * routes (siblings in this folder) all still resolve, just to this same
 * empty state.
 */
export function ArchivesPage() {
  return (
    <>
      <Seo
        title={"Archives — Dr. Dietrich Klinghardt™"}
        description="The Archives are being rebuilt with new content."
        path="/archives"
        noindex
      />

      <AnimatedGradient variant="card" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <p className="eyebrow">Archives</p>
            <h1>Archives</h1>
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap">
        <p className="empty-note">
          The Archives are being rebuilt with new content. In the meantime,
          reach out via <a href="/contact">Contact</a> for anything you're
          looking for.
        </p>
      </section>
    </>
  );
}
