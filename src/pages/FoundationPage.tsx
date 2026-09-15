import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useSection, useRecords, SECTION } from "@/lib/sections";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { ArchiveIcon, GraduationCapIcon, FlaskIcon, GlobeIcon } from "@/components/Icons";

/** title | description — the four commitments, from the design. */
const COMMITMENTS_FALLBACK: string[][] = [
  [
    "Preserving a Legacy",
    "Creating a carefully maintained archive of Dr. Klinghardt's publications, lectures, interviews, protocols, correspondence and historical educational materials.",
  ],
  [
    "Advancing Education",
    "Supporting responsible educational programs, scholarships, lectures and professional training inspired by Dr. Klinghardt's interdisciplinary approach to health and healing.",
  ],
  [
    "Encouraging Research",
    "Promoting thoughtful scientific inquiry into questions arising from Dr. Klinghardt's clinical work and encouraging meaningful collaboration among practitioners, researchers and institutions.",
  ],
  [
    "Expanding Access",
    "Helping make educational resources available to communities and practitioners who might otherwise be unable to access advanced training and information.",
  ],
];

/** One icon per commitment, in the same order as COMMITMENTS_FALLBACK/CMS records. */
const COMMITMENT_ICONS = [ArchiveIcon, GraduationCapIcon, FlaskIcon, GlobeIcon];

/**
 * Splits "Sentence one. Sentence two. Last sentence." into everything before
 * the final sentence and the final sentence itself, so the hero can style
 * the last line (an italic accent, per the client's Figma reference) without
 * the title having to arrive pre-split from the CMS.
 */
function splitLastSentence(title: string): { lead: string; accent: string | null } {
  const sentences = title.match(/[^.]+\.?/g)?.map((s) => s.trim()).filter(Boolean);
  if (!sentences || sentences.length < 2) return { lead: title, accent: null };
  return { lead: sentences.slice(0, -1).join(" "), accent: sentences.at(-1) ?? null };
}

/**
 * Dr. Klinghardt Foundation — copy transcribed from the Figma frame 0:5277.
 *
 * The design's own wording is careful that the Foundation "is being
 * established", which is also why the donate page below it may legitimately
 * not be able to take money yet. Both states are told the same way.
 *
 * Client (2026-09-14, against a fuller Figma export than the frame this
 * originally shipped from): "hay que rehacer esta pagina... ayudame a que
 * quede identica" — rebuilt hero, purpose section, commitments list and quote
 * against that reference. The doc's older note on commitments ("puedes dejar
 * esa seccion asi") is superseded here — the newer, more explicit visual
 * reference wins per the client's own priority order.
 */
export function FoundationPage() {
  const page = useSection(SECTION.foundation, {
    title: "Preserving Knowledge. Advancing Education. Supporting the Future of Healing.",
    paragraphs: [
      "The Dr. Klinghardt Foundation™ is being established to preserve and advance the life's work of Dietrich Klinghardt MD PhD™, while supporting education, thoughtful inquiry, and greater access to knowledge in biological and integrative medicine.",
    ],
  });
  const purpose = useSection("foundation-purpose", {
    title: "Preserving Knowledge for Future Generations",
    paragraphs: [
      "The Foundation's purpose is to ensure that decades of clinical observations, lectures, publications, protocols and educational materials are responsibly preserved and made accessible to future generations of practitioners, researchers, students and members of the public.",
    ],
  });
  const commitments = useRecords("foundation-commitments", 2, COMMITMENTS_FALLBACK);
  const { lead: titleLead, accent: titleAccent } = splitLastSentence(page.title);

  return (
    <>
      <Seo
        title={"Dr. Klinghardt Foundation™"}
        description="Preserving the archive, advancing education, encouraging research and expanding access to Dr. Klinghardt's work."
        path="/foundation"
      />

      {/* Client (2026-09-14, Figma): the hero opens with the Foundation
          wordmark itself, not a plain eyebrow line — "el logo arriba, el
          gradient abajo, las letras del titulo luego el subtitulo". Asset
          from the doc's "foundation logo.svg" attachment (a Drive link, not
          an inline doc image). Last sentence styled as an italic accent line
          per the reference; no hero CTA there — the design's only button in
          this half of the page lives in the Purpose section below. */}
      <AnimatedGradient variant="card" intensity="soft" className="page-hero page-hero--center foundation-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <img
              src="/images/foundation-logo.svg"
              alt="Klinghardt Foundation™"
              className="foundation-hero__logo"
            />
            <h1 className="foundation-title">
              <Marked text={titleLead} />
              {titleAccent ? (
                <>
                  {" "}
                  <em className="foundation-title__accent">
                    <Marked text={titleAccent} />
                  </em>
                </>
              ) : null}
            </h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      {/* Client (2026-09-14, Figma): purpose copy stacks in the left column
          (title, paragraph, CTA) instead of splitting title/paragraph across
          two columns; the right column now holds the Foundation wordmark on
          its own gradient card instead of sitting empty. */}
      <section className="section wrap foundation-purpose">
        <Reveal className="foundation-purpose__grid">
          <div className="foundation-purpose__copy">
            <p className="eyebrow">Our purpose</p>
            <h2>{purpose.title}</h2>
            <div className="prose">
              {purpose.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link className="btn btn-primary foundation-purpose__cta" to="/foundation/donate">
              Support the Foundation
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="foundation-purpose__card" aria-hidden="true">
            <img src="/images/foundation-logo.svg" alt="" className="foundation-purpose__card-logo" />
          </div>
        </Reveal>
      </section>

      {/* Client (2026-09-14, Figma): a vertical list with a category icon per
          row, replacing the four-card grid — the doc's earlier "puedes dejar
          esa seccion asi" predates this reference. */}
      <section className="section wrap">
        <Reveal>
          <p className="eyebrow">Four central commitments</p>
          <h2 className="section-title">
            Its Work Will Be Organized Around Four Central Commitments:
          </h2>
        </Reveal>
        <ul className="commitments">
          {commitments.map(([title, body], index) => {
            const Icon = COMMITMENT_ICONS[index % COMMITMENT_ICONS.length];
            return (
              <Reveal
                as="li"
                key={title}
                className="commitment"
                delay={index * 80}
                shift={14}
              >
                <span className="commitment__icon" aria-hidden="true">
                  <Icon />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* Client (2026-09-15): "elimina la sección class='plain-section
          home-art'" — the "Support the work" band that used to sit here,
          between Commitments and the quote, is gone. The quote is now the
          section right after Commitments. */}

      {/* Client (2026-09-14, Figma + doc): "el quote debe de estar hasta
          abajo de la pagina y parte del gradient naranja del background" —
          moved to be the page's last section (no more newsletter after it,
          see below) and its background is transparent on purpose so
          <main>'s own page-wide gradient shows through here, landing on the
          amber/orange tail exactly where the design has it. Plain paragraph
          instead of LineQuote: the reference wraps this as flowing text with
          one bold clause, not the short authored lines LineQuote animates. */}
      <section className="section foundation-quote">
        <div className="wrap">
          <Reveal className="foundation-quote__inner">
            <blockquote className="foundation-quote__text">
              <p>
                “The Foundation is intended to serve as a living bridge between{" "}
                <strong>
                  Dr. Klinghardt's lifetime of work and the future of integrative
                  healthcare
                </strong>
                —honoring what has been learned while encouraging new questions,
                responsible investigation, and compassionate service.”
              </p>
              <cite>— Dr. Dietrich Klinghardt™</cite>
            </blockquote>
            <Link className="btn btn-primary foundation-quote__cta" to="/foundation/donate">
              Support the Foundation
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Doc (2026-09-14): "Hay paginas que no llevan el newsletter como esta
          al final. Por fa quitalo, no es necesario en todas las paginas." —
          removed here; the footer's static amber→navy fade covers pages
          without a newsletter pin (see SiteShell/shell.css). */}
    </>
  );
}
