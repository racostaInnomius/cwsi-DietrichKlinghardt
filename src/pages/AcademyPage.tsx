import { Fragment } from "react";
import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useSection } from "@/lib/sections";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

type Action = {
  label: string;
  to?: string;
  href?: string;
  ghost?: boolean;
  /** The arrow the Figma sets on this specific action, e.g. "Course dates →". */
  arrow?: boolean;
};

type Branch = {
  eyebrow: string;
  title: string;
  /** Fraunces line under the heading, where the design has one. */
  accent?: string;
  body: string;
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
 * The six branches, transcribed from the Figma frame `0:3213` — eyebrow,
 * heading, the Fraunces line where there is one, the body copy and the button
 * labels. The design alternates which side the picture sits on, and that
 * alternation is what `side` carries.
 *
 * These stay a constant rather than CMS rows: they are the site's own
 * structure, and an editor deleting one would break the navigation. The copy is
 * the client's and can move to the CMS later without touching the layout.
 */
const BRANCHES: Branch[] = [
  {
    eyebrow: "Global network",
    title: "Find A.R.T.® Therapists",
    accent: "Browse our directory to find practitioners near you.",
    body: "Looking for a certified A.R.T.® therapist or consultant near you? Our therapist directory helps you find qualified practitioners and clinics in your area, ready to support you on your journey toward health and wellbeing. Each listing links to the therapist's own website, where you can read about their approach, specialities and the services they offer.",
    actions: [{ label: "Learn more", to: "/academy/therapists" }],
    // Client (2026-09-11): "el mapa interactivo seria solo una imagen no un
    // mapa interactivo... puedes tomar este mapa" — the client's own asset,
    // not a live/interactive map.
    media: {
      src: "/images/art-therapists-map.png",
      alt: "Map of A.R.T. therapist locations across Europe",
      width: 509,
      height: 411,
    },
    side: "left",
  },
  {
    eyebrow: "Signature method",
    title: "A.R.T Klinghardt™",
    body: "A.R.T Klinghardt™ (AUTONOMIC RESPONSE TESTING®) is a holistic method that works on an energetic level to support personal well-being. Using a kinesiological muscle test, it observes how the body responds to different stimuli to reveal possible energetic imbalances. It offers a complementary holistic assessment and is not a substitute for medical or psychotherapeutic care.",
    // Client (2026-09-11, against the Figma): "el boton de Course dates...
    // son 2 botones y asi deben de quedar" — reversed from the first pass:
    // "About the course" is the outline one, "Course dates" is filled with
    // an arrow.
    actions: [
      { label: "About the course", to: "/academy/art", ghost: true },
      { label: "Course dates", to: "/courses", arrow: true },
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
    eyebrow: "Five levels",
    title: "The 5 Levels of Healing™",
    accent: "Autonomic Response Testing®",
    body: "According to Dr. Dietrich Klinghardt™, humans exist in several dimensions at once: the physical body lives within a sphere of invisible bodies that surround and permeate it. Each higher level organises the ones below it, while the lower levels supply energy — so a problem can begin on any level and travel downward until it becomes visible.",
    actions: [{ label: "Learn more", to: "/academy/five-levels" }],
    // Client (2026-09-10): "5 levels of healing falta el grafico" — the
    // Figma shows the same pyramid /academy/five-levels already builds in
    // full. Client (2026-09-11, follow-up, exact reference): "identico" —
    // the condensed version this first tried (name only, no ordinals, no
    // axis labels) wasn't close enough; <Pyramid compact /> matched pixel-
    // for-pixel. Client (2026-09-14): swapped the live component for a
    // static export of that same render — same media slot every other
    // branch's photo uses.
    media: {
      src: "/images/5_levels.png",
      alt: "The 5 Levels of Healing pyramid",
      width: 556,
      height: 458,
    },
    side: "left",
  },
  {
    eyebrow: "Research & books",
    title: "Publications and Educational Resources",
    body: "Throughout his career, Dr. Dietrich Klinghardt™ has written and contributed to books, articles, clinical papers, protocols, teaching manuals, interviews and educational presentations exploring biological and integrative medicine. This collection brings together selected works reflecting the evolution of his clinical thinking — from his early work in neural therapy and psycho-kinesiology to his later writing on neurobiology, environmental influences, chronic illness and The 5 Levels of Healing™.",
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
    eyebrow: "Learning center",
    title: "Klinghardt Akademie",
    accent: "Dr. Klinghardt's academy in Europe",
    body: "Based in Europe, the Klinghardt Akademie is Dr. Klinghardt's European training centre. It carries his diagnostic and therapeutic methods forward as a living system, continuously shaped by his clinical practice, research and decades of experience. Here, therapists and health-minded individuals can train directly in his core methods — A.R.T Klinghardt™ and Psycho-Kinesiology — grounded in The 5 Levels of Healing™. Seminars and materials are offered primarily in Europe.",
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
    eyebrow: "Research & impact",
    title: "Dr. Klinghardt Foundation™",
    body: "The Dietrich Klinghardt Foundation™ is dedicated to helping people understand the deeper forces that shape human health and the capacity for healing. Continuing Dr. Klinghardt's life's work, the Foundation supports a more conscious approach to medicine — one that honours the whole person and helps people live with greater health and purpose.",
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
  const page = useSection("academy", {
    title: "Dr. Klinghardt Akademie™",
    paragraphs: [
      "Training programmes and certifications for practitioners who want to bring Autonomic Response Testing and the 5 Levels of Healing into their own practice — taught by Dr. Klinghardt and the team he has trained worldwide.",
    ],
  });

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
      <AnimatedGradient variant="card" intensity="soft" className="page-hero academy-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <h1 className="academy-hero__wordmark">
              <span className="academy-hero__name">Klinghardt</span>
              <span className="academy-hero__sub">Akademie</span>
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
        <section
          key={branch.title}
          className={`section wrap feature-row feature-row--${branch.side}`}
        >
          {branch.media ? (
            <Reveal className="feature-row__media">
              <img
                className={branch.media.square ? "feature-row__media-img--square" : undefined}
                src={branch.media.src}
                alt={branch.media.alt}
                width={branch.media.width}
                height={branch.media.height}
                loading="lazy"
                decoding="async"
              />
            </Reveal>
          ) : null}

          <Reveal className="feature-row__body" delay={90}>
            <p className="eyebrow">{branch.eyebrow}</p>
            <h2><Marked text={branch.title} /></h2>
            {branch.accent ? <p className="accent">{branch.accent}</p> : null}
            <p className="feature-row__copy">{branch.body}</p>
            <Actions actions={branch.actions} />
          </Reveal>
        </section>
      ))}

      <NewsletterSection />
    </div>
  );
}
