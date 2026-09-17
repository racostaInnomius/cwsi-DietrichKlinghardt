import { Seo } from "@/components/Seo";
import { useSection, useRecords, SECTION } from "@/lib/sections";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";

/**
 * Archives: 5 Levels of Healing™ nach Dr. Klinghardt, migrated from
 * klinghardt-akademie.de (client, 2026-09-18). The source runs this very
 * differently from /academy/five-levels (English): no side-by-side
 * pyramid+legend grid — a small pyramid graphic sits beside the intro at
 * the top, then each of the 5 levels is its own full-width block, stacked
 * and alternating left/right across the page (a "zigzag" reading path,
 * confirmed against a full-page screenshot of the source). Reproduced
 * here as .archives-level / .archives-level--right rather than reusing
 * .levels (that component's own side-by-side shape doesn't match).
 */
const FIVE_LEVELS_FALLBACK: string[][] = [
  [
    "1. Körper und messbare Vorgänge",
    "Die erste Perspektive richtet den Blick auf den materiellen Körper. Dazu zählen anatomische Strukturen ebenso wie biochemische, mechanische und physiologische Abläufe. Körperliche Reize und Veränderungen nehmen wir insbesondere über unsere Sinnesorgane wahr.\n\nDieser Ebene ordnet das Modell vor allem Verfahren zu, die unmittelbar auf den Körper einwirken. Hierzu gehören beispielsweise ärztliche und zahnmedizinische Behandlungen, Operationen, Arzneimittel sowie physiotherapeutische, osteopathische und andere manuelle Anwendungen. Auch der medizinisch begleitete Einsatz von Nährstoffen, Hormonen oder pflanzlichen Präparaten wird in diesem Zusammenhang genannt.",
  ],
  [
    "2. Regulation und energetische Prozesse",
    "Die zweite Perspektive beschäftigt sich mit Regulations- und Austauschprozessen zwischen körperlichem Erleben, Gefühlen und innerer Informationsverarbeitung: Dem Energiekörper.\n\nIn diesem Bereich werden unter anderem Akupunktur, Akupressur, Atemarbeit und bestimmte osteopathische Vorgehensweisen genutzt. Hinzu kommen Anwendungen, die mit Licht, Schall, elektrischen Impulsen oder Magnetfeldern arbeiten.\n\nAuch die Neuraltherapie wird innerhalb des Modells zugerechnet. Dabei werden örtliche Betäubungsmittel beispielsweise im Bereich von Narben oder vermuteten Störfeldern eingesetzt.\n\nGefühle erscheinen in diesem Zusammenhang als Erfahrungen, an denen sowohl körperliche Reaktionen als auch psychische Verarbeitungsprozesse beteiligt sind.",
  ],
  [
    "3. Denken, Erinnern und Überzeugungen",
    "Die dritte Perspektive umfasst mentale und psychische Vorgänge. Dazu gehören Erinnerungen, Gedanken, Überzeugungen und die persönliche Deutung von Erfahrungen. Dieser Bereich beeinflusst, wie Menschen sich selbst und ihre Umwelt wahrnehmen. Auf dieser Ebene setzt das Modell unterschiedliche psychotherapeutische und traumatherapeutische Verfahren an wie kognitive Ansätze, Gestalttherapie, EMDR, Mentalfeld-Techniken und Applied Psycho-Neurobiology (ANP).",
  ],
  [
    "4. Familiäre, kulturelle und intuitive Einflüsse",
    "Die vierte Perspektive richtet sich auf Erfahrungen, die sich nicht vollständig durch bewusstes und rationales Denken erklären lassen. Dazu können familiäre Prägungen, generationenübergreifende Erfahrungen sowie kulturelle, gesellschaftliche oder religiöse Einflüsse gehören.\n\nAuch Symbole, Archetypen, meditative Erfahrungen und intuitive Wahrnehmungen sind Teil davon.\n\nAls mögliche Zugänge dient unter anderem die tiefenpsychologische Arbeit in der Tradition C. G. Jungs, Kunsttherapie sowie symbol- und ritualorientierte Methoden. Auch Familienaufstellungen können in diesem Zusammenhang verwendet werden.",
  ],
  [
    "5. Sinn, Spiritualität und Verbundenheit",
    "Die fünfte Perspektive befasst sich mit Fragen nach Sinn, innerer Orientierung und spiritueller Verbundenheit. Im Mittelpunkt steht die persönliche Auseinandersetzung mit Werten, Lebensaufgaben und Erfahrungen, die über die eigene Person hinausweisen können.\n\nZugänge zu diesem Bereich können sehr individuell sein. Meditation, Gebet, stille Reflexion oder bewusst gewählte Zeiten des Alleinseins können Menschen dabei unterstützen, sich mit existenziellen und spirituellen Fragen zu beschäftigen.",
  ],
];

export function ArchivesFiveLevelsPage() {
  const page = useSection(SECTION.archivesFiveLevels, {
    title: "5 Levels of Healing™ nach Dr. Klinghardt",
    paragraphs: [
      "Eine Einführung in das Modell von Dr. med. Dietrich Klinghardt",
      "Das von Dr. med. Dietrich Klinghardt vertretene Modell betrachtet den Menschen aus fünf unterschiedlichen Perspektiven. Körperliche Vorgänge, regulative Prozesse, Gedanken, überpersönliche Einflüsse und spirituelle Erfahrungen werden darin als miteinander verbunden verstanden.",
    ],
  });
  const levels = useRecords(SECTION.archivesFiveLevelsList, 2, FIVE_LEVELS_FALLBACK);

  return (
    <div className="archives-page">
      <Seo
        title={"5 Levels of Healing™ — Archives — Dr. Dietrich Klinghardt™"}
        description="Archiv: Das 5-Levels-of-Healing-Modell nach Dr. Klinghardt, migriert von klinghardt-akademie.de."
        path="/archives/five-levels-of-healing"
      />

      <section className="section wrap">
        <Breadcrumbs
          items={[{ label: "Archives", href: "/archives" }, { label: "5 Levels of Healing™" }]}
        />
      </section>

      <section className="section wrap feature-row feature-row--right archives-row--tight-top archives-levels-intro">
        <Reveal className="feature-row__media">
          <img
            src="/images/5_levels_.png"
            alt="5 Levels of Healing: 1st Physical Body, 2nd Energy Body, 3rd Mental, 4th Intuitive, 5th Spiritual"
            width={556}
            height={458}
          />
        </Reveal>
        <Reveal className="feature-row__body">
          <h1><Marked text={page.title} /></h1>
          <p className="archives-levels-intro__subtitle">{page.paragraphs[0]}</p>
          <p className="feature-row__copy">{page.paragraphs[1]}</p>
        </Reveal>
      </section>

      <section className="section wrap archives-levels">
        {levels.map(([heading, body], index) => (
          <Reveal
            key={heading}
            className={`archives-level${index % 2 === 1 ? " archives-level--right" : ""}`}
            delay={index * 70}
          >
            <h2>{heading}</h2>
            {body.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
        ))}
      </section>
    </div>
  );
}
