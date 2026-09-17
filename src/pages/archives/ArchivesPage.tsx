import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useSection, SECTION } from "@/lib/sections";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Archives — landing page for content migrated from klinghardt-akademie.de
 * (the password-protected legacy site — client, 2026-09-18: "trae todo el
 * contenido de las páginas adaptandolo a nuestros diseños", then, after a
 * closer side-by-side review: "quiero que dejes todo identico... compara...
 * cada mínimo detalle de textos, estructura, posición de textos e
 * imágenes"). Copy stays German on purpose. Structure/order/image
 * placement now follow the source page section-for-section (hero photo
 * right, then ART/APN/Donnerstalk teasers alternating image side exactly
 * as the source does) — only the site chrome (header/footer/nav, button
 * component classes) is ours instead of a literal visual clone. Kontakt
 * was not migrated — its one inbound link here points at this site's own
 * /contact instead. The source's own "Alle Seminartermine" heading is a
 * dead WordPress block with no visible content when there are no dates
 * (confirmed empty on a full-page screenshot) — not reproduced here.
 */
export function ArchivesPage() {
  const page = useSection(SECTION.archivesHome, {
    title: "Klinghardt Akademie",
    paragraphs: [
      "Die A.R.T. Klinghardt™-Ausbildung vermittelt einen ganzheitlichen Ansatz zur Testung und Regulation energetischer Prozesse im Körper, bei dem über kinesiologische Muskeltests individuelle Ungleichgewichte erkannt und darauf aufbauend therapeutische Maßnahmen abgeleitet werden.",
      "Applied Psycho-Neurobiology (APN) hatte Dr. Klinghardt schon angewendet, bevor er die Psycho-Kinesologie in seinen Büchern verwendet hat. Die APN verbindet gesprächsorientierte Reflexion mit körperbezogenen Wahrnehmungs- und Testverfahren, um die Selbstreflexion zu unterstützen und einen bewussteren Umgang mit belastenden Erfahrungen zu ermöglichen.",
      "Die regelmäßigen Webinare von Dr. med. Dietrich Klinghardt. In den Donnerstalks behandelt Dr. Klinghardt aktuelle Themen der Medizin, stellt neue Forschungsergebnisse vor und gibt praxisnahe Empfehlungen für Therapeuten und gesundheitsbewusste Menschen.",
    ],
  });

  return (
    <div className="archives-page">
      <Seo
        title={"Archives — Klinghardt Akademie — Dr. Dietrich Klinghardt™"}
        description="Archiv der Klinghardt Akademie: A.R.T. Klinghardt™, Applied Psycho-Neurobiology (APN) und die Donnerstalks, migriert von klinghardt-akademie.de."
        path="/archives"
      />

      <AnimatedGradient variant="plain" className="hero archives-hero">
        {/* Decorative: the heading already names the subject, so an alt
            text here would only repeat it to a screen reader — same
            reasoning as HomePage.tsx's own .hero__photo. */}
        <img
          className="hero__photo"
          src="/images/hero-klinghardt-transparent.webp"
          alt=""
          width={1920}
          height={1080}
        />
        <div className="wrap hero__inner">
          <Reveal>
            <p className="eyebrow hero__eyebrow">Willkommen bei der</p>
            <h1 className="display-xl archives-hero__title">
              <span>Klinghardt</span>
              <span>Akademie</span>
            </h1>
            <div className="hero__actions">
              <a className="btn btn-light" href="#donnerstalk">
                Zu den Donnerstalks
              </a>
              <Link className="btn btn-ghost" to="/contact">
                Kontakt
              </Link>
            </div>
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap feature-row archives-square-row" id="art-klinghardt">
        <Reveal className="feature-row__media">
          <img
            src="/images/archives/klinghardt-testing.jpg"
            alt="A.R.T. Klinghardt™ Muskeltest"
            width={1500}
            height={967}
          />
        </Reveal>
        <Reveal className="feature-row__body" delay={90}>
          <p className="eyebrow">Diagnostische Methode</p>
          <h2>A.R.T. Klinghardt™</h2>
          <p className="feature-row__copy">{page.paragraphs[0]}</p>
          <div className="feature-row__actions">
            <Link className="btn btn-primary" to="/archives/art-klinghardt">
              Mehr erfahren →
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="section wrap feature-row feature-row--right archives-square-row">
        <Reveal className="feature-row__media">
          <img
            src="/images/archives/klinghardt-buero.jpg"
            alt="Applied Psycho-Neurobiology (APN)"
            width={1535}
            height={1024}
          />
        </Reveal>
        <Reveal className="feature-row__body" delay={90}>
          <h2>Applied Psycho-Neurobiology (APN)</h2>
          <p className="feature-row__copy">{page.paragraphs[1]}</p>
          <div className="feature-row__actions">
            <Link className="btn btn-primary" to="/archives/apn-applied-psycho-neurobiology">
              Mehr erfahren →
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="section wrap feature-row archives-square-row" id="donnerstalk">
        <Reveal className="feature-row__media">
          <img
            src="/images/archives/donnerstalks.jpg"
            alt="Donnerstalk"
            width={1454}
            height={800}
          />
        </Reveal>
        <Reveal className="feature-row__body" delay={90}>
          <h2>Donnerstalk</h2>
          <p className="feature-row__copy">{page.paragraphs[2]}</p>
          <div className="feature-row__actions">
            <a
              className="btn btn-primary"
              href="https://donnerstalk.com/"
              target="_blank"
              rel="noreferrer"
            >
              Mehr erfahren →
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
