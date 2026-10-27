import { Fragment } from "react";
import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useSection } from "@/lib/sections";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Emphasis } from "@/components/Emphasis";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { InViewVideo } from "@/components/sections/InViewVideo";
import { PYRAMID_VIDEO } from "@/data/media";

type Action = {
  label: string;
  to?: string;
  href?: string;
  ghost?: boolean;
  /** The arrow the Figma sets on this specific action, e.g. "Course dates →". */
  arrow?: boolean;
};

type Branch = {
  /**
   * The Page Contents block with the branch's words: eyebrow, title, subtitle
   * (the Fraunces line under the heading, where the design has one) and text.
   * Copy in src/data/blocks.ts until the row has it.
   */
  slug: string;
  actions: Action[];
  /** `media: "right"` puts the picture on the right, as the frame alternates. */
  media?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    /** Client (2026-09-14): the Akademie/Foundation logo panels are square
     *  (405×405), not the 558:457 photo aspect every other branch's media
     *  uses. */
    square?: boolean;
  };
  side: "left" | "right";
};

/**
 * The six branches, transcribed from the Figma frame `0:3213` — the picture,
 * the buttons and which side the picture sits on (the design alternates). Their
 * words are Page Contents blocks, one per branch (client, 2026-10-21).
 *
 * The rows themselves stay a constant: they are the site's own structure, and
 * an editor deleting one would break the navigation.
 */
const BRANCHES: Branch[] = [
  {
    slug: "academy-find-art-therapists",
    actions: [{ label: "Learn more", to: "/academy/therapists" }],
    // Client (2026-09-11): "el mapa interactivo seria solo una imagen no un
    // mapa interactivo... puedes tomar este mapa" — the client's own asset,
    // not a live/interactive map.
    media: {
      src: "/images/art-therapists-map.png",
      alt: "Map of A.R.T. practitioner locations across Europe",
      width: 509,
      height: 411,
    },
    side: "left",
  },
  {
    slug: "academy-art-klinghardt",
    // Client (2026-09-11, against the Figma): "el boton de Course dates...
    // son 2 botones y asi deben de quedar" — reversed from the first pass:
    // "About the course" is the outline one, "Course dates" is filled with
    // an arrow.
    // Client (2026-10-27): "About the course" → "More information",
    // "Course dates" → "Seminar dates".
    actions: [
      { label: "More information", to: "/academy/art", ghost: true },
      { label: "Seminar dates", to: "/courses", arrow: true },
    ],
    media: {
      src: "/images/art-klinghardt.webp",
      alt: "Dr. Klinghardt with a patient during an A.R.T. session",
      width: 558,
      height: 457,
    },
    side: "right",
  },
  {
    slug: "academy-publications",
    // Client (2026-09-11, against the Figma): "el boton de Research & books
    // debe quedar identico" — outline here, unlike the filled "Learn more"
    // the other branches use.
    actions: [{ label: "Learn more", to: "/academy/publications", ghost: true }],
    media: {
      src: "/images/publications.webp",
      alt: "Books and teaching manuals by Dr. Klinghardt",
      width: 558,
      height: 457,
    },
    side: "right",
  },
  {
    slug: "academy-klinghardt-akademie",
    actions: [{ label: "Go to site", to: "/academy/akademie" }],
    // Client (2026-09-14): real exported panel, replacing the drawn
    // gradient + wordmark this branch opened with — same media slot every
    // other branch's photo uses, not the special brandCard one.
    media: {
      src: "/images/Klinghardt_Akademie.png",
      alt: "Klinghardt Akademie",
      width: 405,
      height: 405,
      square: true,
    },
    side: "left",
  },
  {
    slug: "academy-klinghardt-foundation",
    actions: [
      { label: "Learn more", to: "/foundation" },
      { label: "Donate now", to: "/foundation/donate", ghost: true },
    ],
    // Client (2026-09-14): real exported panel, replacing the drawn
    // gradient + wordmark this branch opened with.
    media: {
      src: "/images/Klinghardt_Foundation.png",
      alt: "Klinghardt Foundation",
      width: 405,
      height: 405,
      square: true,
    },
    side: "right",
  },
];

function Actions({ actions }: { actions: Action[] }) {
  return (
    <div className="feature-row__actions">
      {actions.map((action) =>
        action.to ? (
          <Link
            key={action.label}
            className={`btn ${action.ghost ? "btn-ghost" : "btn-light"}`}
            to={action.to}
          >
            {action.label}
            {action.arrow ? <span aria-hidden="true">→</span> : null}
          </Link>
        ) : (
          <a
            key={action.label}
            className={`btn ${action.ghost ? "btn-ghost" : "btn-light"}`}
            href={action.href}
          >
            {action.label}
            {action.arrow ? <span aria-hidden="true">→</span> : null}
          </a>
        ),
      )}
    </div>
  );
}

/**
 * Academy hub — the crossroads between the method, the framework, the training
 * and the practitioners.
 *
 * Laid out as the design does it: six full-width rows that alternate a picture
 * and a column of copy, not the grid of small cards this page used to be. The
 * grid lost the hierarchy the frame gives each branch, and left no room for the
 * copy the client actually wrote.
 */
export function AcademyPage() {
  // Client (2026-09-10): "en la frase con texto falso, usar la misma frase
  // del homepage que esta abajo de la foto del hero" — same fallback copy
  // as SECTION.homeIntro (HomePage.tsx), word for word, rather than this
  // page's own placeholder.
  const page = useSection("academy");

  // Client (2026-09-11, against the Figma): the reference bolds one clause
  // mid-paragraph ("ut labore et dolore magna" in its own lorem ipsum) —
  // the same treatment Home's own academy teaser gives this exact copy
  // (HomePage.tsx's introBoldPhrases), applied here since the hero now
  // carries that same paragraph word for word.
  const heroBoldPhrases = [
    "Training programmes and certifications for practitioners",
    "taught by Dr. Klinghardt",
  ];
  const heroLeadParts = page.lead
    ? page.lead.split(
        new RegExp(
          `(${heroBoldPhrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
        ),
      )
    : [];

  return (
    // Client (2026-09-10): "los botones tienen que ser navy blue, no
    // beige... #023866" — scoped to this page (sections.css) rather than
    // .btn-light itself, which stays cream everywhere else it's used
    // (Home, Sophia, ...) with no matching complaint there.
    <div className="academy-page">
      <Seo
        title={"Dr. Klinghardt Akademie™"}
        description="A.R.T., the 5 Levels of Healing, certification training and the practitioner directory."
        path="/academy"
      />

      {/* Client (2026-09-10): "falta el diseno y el logo en el hero,
          agregar por fa" — the frame gives this hero its own rounded
          gradient panel and wordmark, not the flat text-only band every
          other internal page uses; .academy-hero (sections.css) carries
          that, reusing the same navy-to-amber card gradient as the home
          hero and weekly-talks band.

          Client (2026-09-11, against the Figma): the reference's own
          heading isn't the plain page title — it's the same two-part
          "Klinghardt" / "AKADEMIE" wordmark treatment used further down
          this page (no separate eyebrow above it, no small logo mark), so
          this now matches that instead of page.title. (2026-09-14: those
          panels further down are now real exported images, not drawn
          CSS/text — this hero's own wordmark is unaffected, still hand-set
          here.) */}
      <AnimatedGradient variant="card-warm" intensity="soft" className="page-hero academy-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <h1 className="academy-hero__wordmark">
              <img
                className="academy-hero__logo"
                src="/images/akademie_logo.svg"
                alt="Dr. Klinghardt Akademie"
                width={252}
                height={77}
              />
            </h1>
            {page.lead ? (
              <p className="lead">
                {heroLeadParts.map((part, index) =>
                  heroBoldPhrases.includes(part) ? (
                    <strong key={index}>{part}</strong>
                  ) : (
                    <Fragment key={index}>{part}</Fragment>
                  ),
                )}
              </p>
            ) : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      {BRANCHES.map((branch) => (
        <Fragment key={branch.slug}>
          <BranchRow branch={branch} />
          {/* Client (2026-10-27): the 5-Levels row that used to sit here
              (picture + copy + "Learn more") is gone; in its place, just the
              pyramid animation, the whole of it a link to the page that row
              pointed at. Keyed off the branch above it so the order stays
              declared in BRANCHES, where every other row's order lives. */}
          {branch.slug === "academy-art-klinghardt" ? <PyramidRow /> : null}
        </Fragment>
      ))}

      <NewsletterSection />
    </div>
  );
}

/**
 * The pyramid, standing alone where the 5-Levels branch row used to be
 * (client, 2026-10-27: "quita ... y pon el video de la piramide ... al darle
 * click que nos lleve a /academy/five-levels").
 *
 * The same clip and the same play-once-when-it-scrolls-into-view treatment
 * /academy/five-levels itself uses, so the hub shows exactly what the page it
 * leads to shows. `5_levels.png` stays on as the poster frame, which is also
 * what anyone with `prefers-reduced-motion` is left looking at.
 */
function PyramidRow() {
  return (
    <section className="section wrap academy-pyramid">
      <Reveal>
        <Link
          className="academy-pyramid__link"
          to="/academy/five-levels"
          aria-label="The 5 Levels of Healing"
        >
          <InViewVideo {...PYRAMID_VIDEO} width={1920} height={1080} />
        </Link>
      </Reveal>
    </section>
  );
}

/**
 * One branch row. Its words come from the branch's Page Contents block, and
 * so does its picture: "Imagen principal" in that same block replaces the
 * bundled file, which stays as the fallback (client, 2026-10-27: "revisar que
 * ... la imagen esté relacionada al contenido y pueda ser cambiada
 * fácilmente"). The CSS gives the slot its own ratio and crops to it, so an
 * upload of any size lands in the layout the design draws.
 */
function BranchRow({ branch }: { branch: Branch }) {
  const copy = useSection(branch.slug);
  return (
    <section
      className={`section wrap feature-row feature-row--${branch.side}`}
    >
      {branch.media ? (
        <Reveal className="feature-row__media">
          <img
            className={branch.media.square ? "feature-row__media-img--square" : undefined}
            src={copy.image ?? branch.media.src}
            /* A picture the editor uploaded no longer matches the bundled
               description: it is named by its own "Texto alternativo" in the
               media library, which the editor owns, and by the branch it
               illustrates only if that is empty. */
            alt={copy.image ? copy.imageAlt || copy.title || branch.media.alt : branch.media.alt}
            width={branch.media.width}
            height={branch.media.height}
            loading="lazy"
            decoding="async"
          />
        </Reveal>
      ) : null}

      <Reveal className="feature-row__body" delay={90}>
        {copy.eyebrow ? <p className="eyebrow"><Marked text={copy.eyebrow} /></p> : null}
        <h2><Marked text={copy.title} /></h2>
        {copy.subtitle ? <p className="accent"><Marked text={copy.subtitle} /></p> : null}
        {copy.marked.map((paragraph) => (
          <p key={paragraph} className="feature-row__copy"><Emphasis text={paragraph} /></p>
        ))}
        <Actions actions={branch.actions} />
      </Reveal>
    </section>
  );
}
