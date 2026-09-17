import { Seo } from "@/components/Seo";
import { useSection, SECTION } from "@/lib/sections";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";

/**
 * Archives: Applied Psycho-Neurobiology (APN), migrated from
 * klinghardt-akademie.de (client, 2026-09-18). Same "no boxed hero, plain
 * alternating rows" structure as ArchivesArtPage.tsx — see that file and
 * ArchivesPage.tsx for the fuller note. Three rows here, image side
 * alternating right/left/right exactly as the source does.
 */
export function ArchivesApnPage() {
  const page = useSection(SECTION.archivesApn, {
    title: "Applied Psycho-Neurobiology (APN)",
    paragraphs: [
      "Applied Psycho-Neurobiology verbindet gesprächsorientierte Reflexion mit körperbezogenen Wahrnehmungs- und Testverfahren.",
      "Im Rahmen einer Sitzung können persönliche Erfahrungen, wiederkehrende emotionale Reaktionen und gegenwärtige Belastungssituationen betrachtet werden. Ergänzend kommt ein kinesiologischer Muskeltest zum Einsatz. Die beobachteten Muskelreaktionen werden innerhalb der Methode als Anregungen für das weitere Gespräch verstanden.",
      "Ziel der Anwendung ist es, die persönliche Selbstreflexion zu unterstützen und einen bewussteren Umgang mit belastenden Erfahrungen anzuregen. APN ersetzt weder eine ärztliche Behandlung noch eine Psychotherapie. Bei körperlichen oder psychischen Beschwerden ist eine entsprechende Fachperson hinzuzuziehen.",
      "Die Ausbildung umfasst praktische Übungsphasen, in denen die Teilnehmenden unterschiedliche Rollen kennenlernen. Sie führen Anwendungen selbst durch und erleben Sitzungen aus der Perspektive der empfangenden Person. Dabei kommen sowohl A.R.T. als auch APN zum Einsatz. Die eigenen Beobachtungen werden während der Ausbildung schriftlich festgehalten. Dokumentiert werden insbesondere die Ausgangssituation, der Verlauf der jeweiligen Sitzung und die anschließend wahrgenommenen Veränderungen. Die Aufzeichnungen dienen der fachlichen Reflexion und dem Nachweis der praktischen Ausbildungsanteile.",
      "Die APN nach Dr. Klinghardt geht davon aus, dass frühere Erfahrungen und emotional prägende Situationen das gegenwärtige Erleben beeinflussen können.",
      "In einer Anwendung können Klientinnen und Klienten dazu eingeladen werden, persönliche Reaktionsmuster zu reflektieren und eigene Zusammenhänge zu betrachten. Im Mittelpunkt stehen dabei das subjektive Erleben und die Frage, welche hilfreichen Möglichkeiten im Umgang mit einer gegenwärtigen Belastung entwickelt werden können.",
    ],
  });

  return (
    <div className="archives-page">
      <Seo
        title={"Applied Psycho-Neurobiology (APN) — Archives — Dr. Dietrich Klinghardt™"}
        description="Archiv: Applied Psycho-Neurobiology (APN), migriert von klinghardt-akademie.de."
        path="/archives/apn-applied-psycho-neurobiology"
      />

      <section className="section wrap">
        <Breadcrumbs
          items={[
            { label: "Archives", href: "/archives" },
            { label: "Applied Psycho-Neurobiology (APN)" },
          ]}
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
            alt="APN Sitzung"
            width={1500}
            height={967}
          />
        </Reveal>
        <Reveal className="feature-row__body" delay={90}>
          <h2>Während der Ausbildung</h2>
          <p className="feature-row__copy">{page.paragraphs[3]}</p>
        </Reveal>
      </section>

      <section className="section wrap feature-row feature-row--right archives-square-row">
        <Reveal className="feature-row__media">
          <img
            src="/images/archives/klinghardt-art.jpg"
            alt="Über APN"
            width={1000}
            height={667}
          />
        </Reveal>
        <Reveal className="feature-row__body" delay={90}>
          <h2>Über APN</h2>
          {page.paragraphs.slice(4).map((paragraph) => (
            <p key={paragraph} className="feature-row__copy">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </section>
    </div>
  );
}
