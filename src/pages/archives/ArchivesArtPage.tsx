import { Seo } from "@/components/Seo";
import { useSection, SECTION } from "@/lib/sections";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";

/**
 * Archives: A.R.T. Klinghardt™, migrated from klinghardt-akademie.de
 * (client, 2026-09-18). No boxed hero on the source page — the title sits
 * directly on the plain page background in a two-column row with the
 * portrait, same as every row below it (see ArchivesPage.tsx for the
 * fuller note on this migration). The source has no "Seminartermine"
 * heading with actual content beneath it (confirmed empty on a full-page
 * screenshot — WordPress renders the block but nothing lands in it), so
 * it isn't reproduced here.
 */
export function ArchivesArtPage() {
  const page = useSection(SECTION.archivesArt, {
    title: "A.R.T. Klinghardt™",
    paragraphs: [
      "Die Autonomic Response Testing (A.R.T. Klinghardt™) Technik nach Dr. Dietrich Klinghardt™ nutzt als zentrales Arbeitsmittel den kinesiologischen Muskeltest. Die dabei beobachteten Reaktionen werden als Anhaltspunkte für die weitere Beschäftigung mit individuellen Themen und möglichen Belastungen interpretiert. Die Anwendung stellt keinen Ersatz für eine medizinische, heilpraktische oder psychotherapeutische Diagnose beziehungsweise Behandlung dar.",
      "Die Durchführung des Muskeltests verlangt Konzentration, Genauigkeit und praktische Erfahrung. Ein wesentlicher Teil der Ausbildung besteht deshalb darin, die einzelnen Testschritte einzuüben und körperliche Reaktionen aufmerksam zu beobachten.",
      "Dabei lernen die Teilnehmenden, ihre Wahrnehmungen nachvollziehbar festzuhalten und die Grenzen der Methode zu berücksichtigen. Die verantwortungsbewusste Anwendung des Autonomen Responsetests bildet die fachliche Grundlage für die weitere Arbeit innerhalb dieses Methodenkonzepts.",
      "Die Ausbildung verbindet theoretische Inhalte mit praktischen Übungen und persönlicher Selbsterfahrung. Die Teilnehmenden lernen die Anwendungen aus unterschiedlichen Perspektiven kennen: Sie führen Übungen selbst durch und erleben entsprechende Sitzungen auch in der Rolle der empfangenden Person.",
      "Dies betrifft sowohl A.R.T. als auch APN. Beobachtungen und Erfahrungen aus Seminaren, Workshops und weiteren Übungssituationen werden schriftlich dokumentiert. Die Aufzeichnungen sollen den jeweiligen Ablauf verständlich darstellen und eine spätere Reflexion der Anwendung ermöglichen.",
    ],
  });

  return (
    <div className="archives-page">
      <Seo
        title={"A.R.T. Klinghardt™ — Archives — Dr. Dietrich Klinghardt™"}
        description="Archiv: Die A.R.T. Klinghardt™-Ausbildung, migriert von klinghardt-akademie.de."
        path="/archives/art-klinghardt"
      />

      <section className="section wrap">
        <Breadcrumbs
          items={[{ label: "Archives", href: "/archives" }, { label: "A.R.T. Klinghardt™" }]}
        />
      </section>

      <section className="section wrap feature-row feature-row--right archives-row--tight-top archives-square-row">
        <Reveal className="feature-row__media">
          <img
            className="archives-square-row__media--portrait"
            src="/images/archives/klinghardt-profilbild.jpg"
            alt="Dr. Dietrich Klinghardt™"
            width={683}
            height={1024}
          />
        </Reveal>
        <Reveal className="feature-row__body">
          <h1><Marked text={page.title} /></h1>
          {page.paragraphs.slice(0, 3).map((paragraph) => (
            <p key={paragraph} className="feature-row__copy">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </section>

      <section className="section wrap feature-row archives-square-row">
        <Reveal className="feature-row__media">
          <img
            src="/images/archives/klinghardt-testing.jpg"
            alt="A.R.T. Klinghardt™ Muskeltest"
            width={1500}
            height={967}
          />
        </Reveal>
        <Reveal className="feature-row__body" delay={90}>
          <h2>Während der Ausbildung</h2>
          {page.paragraphs.slice(3).map((paragraph) => (
            <p key={paragraph} className="feature-row__copy">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </section>
    </div>
  );
}
