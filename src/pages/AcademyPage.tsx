import type { ReactNode } from "react";
import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useSection } from "@/lib/sections";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

type Action = { label: string; to?: string; href?: string; ghost?: boolean };

type Branch = {
  eyebrow: string;
  title: string;
  /** Fraunces line under the heading, where the design has one. */
  accent?: string;
  body: string;
  actions: Action[];
  /** `media: "right"` puts the picture on the right, as the frame alternates. */
  media?: { src: string; alt: string; width: number; height: number };
  brandCard?: ReactNode;
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
    side: "left",
  },
  {
    eyebrow: "Signature method",
    title: "A.R.T Klinghardt™",
    body: "A.R.T Klinghardt™ (AUTONOMIC RESPONSE TESTING®) is a holistic method that works on an energetic level to support personal well-being. Using a kinesiological muscle test, it observes how the body responds to different stimuli to reveal possible energetic imbalances. It offers a complementary holistic assessment and is not a substitute for medical or psychotherapeutic care.",
    actions: [
      { label: "About the course", to: "/academy/art" },
      { label: "Course dates", to: "/courses", ghost: true },
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
    side: "left",
  },
  {
    eyebrow: "Research & books",
    title: "Publications and Educational Resources",
    body: "Throughout his career, Dr. Dietrich Klinghardt™ has written and contributed to books, articles, clinical papers, protocols, teaching manuals, interviews and educational presentations exploring biological and integrative medicine. This collection brings together selected works reflecting the evolution of his clinical thinking — from his early work in neural therapy and psycho-kinesiology to his later writing on neurobiology, environmental influences, chronic illness and The 5 Levels of Healing™.",
    actions: [{ label: "Learn more", to: "/academy/publications" }],
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
    // The frame shows a branded panel rather than a photograph, so it is drawn
    // rather than waiting on an asset that would only ever be a gradient and a
    // wordmark.
    brandCard: (
      <span className="brand-card brand-card--akademie">
        <span className="brand-card__name">Klinghardt</span>
        <span className="brand-card__sub">Akademie</span>
      </span>
    ),
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
    brandCard: (
      <span className="brand-card brand-card--foundation">
        <span className="brand-card__name">Klinghardt™</span>
        <span className="brand-card__sub">Foundation</span>
      </span>
    ),
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
          </Link>
        ) : (
          <a
            key={action.label}
            className={`btn ${action.ghost ? "btn-ghost" : "btn-light"}`}
            href={action.href}
          >
            {action.label}
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
  const page = useSection("academy", {
    title: "Dr. Klinghardt Akademie™",
    paragraphs: [
      "Everything taught under the Klinghardt name in one place: the method, the framework it sits inside, the training that certifies it, and the practitioners who work with it.",
    ],
  });

  return (
    <>
      <Seo
        title={"Dr. Klinghardt Akademie™"}
        description="A.R.T., the 5 Levels of Healing, certification training and the practitioner directory."
        path="/academy"
      />

      <AnimatedGradient variant="plain" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <p className="eyebrow">Learning centre</p>
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      {BRANCHES.map((branch) => (
        <section
          key={branch.title}
          className={`section wrap feature-row feature-row--${branch.side}`}
        >
          {branch.media || branch.brandCard ? (
            <Reveal className="feature-row__media">
              {branch.media ? (
                <img
                  src={branch.media.src}
                  alt={branch.media.alt}
                  width={branch.media.width}
                  height={branch.media.height}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                branch.brandCard
              )}
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
    </>
  );
}
