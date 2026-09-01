import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useSection, SECTION } from "@/lib/sections";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { CtaBand } from "@/components/sections/CtaBand";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import {
  ShieldIcon,
  TargetIcon,
  LayersIcon,
  SproutIcon,
  BoltIcon,
  HeartIcon,
  DropletIcon,
  JointIcon,
  LeafIcon,
  ClipboardCheckIcon,
} from "@/components/Icons";

/** The four figures the frame sets in Fraunces at 62px. */
const STATS = [
  { value: "25+", label: "Years of clinical experience" },
  { value: "10K", label: "Patients treated worldwide" },
  { value: "5", label: "Levels of healing addressed" },
  { value: "100%", label: "Root-cause focused care" },
];

const PILLARS = [
  {
    icon: <ShieldIcon />,
    title: "World-Class Leadership",
    body: "Care led by Dr. Dietrich Klinghardt, a globally recognised pioneer in the treatment of chronic illness, chronic infections, environmental toxicity and unresolved trauma.",
  },
  {
    icon: <TargetIcon />,
    title: "Precision Diagnostics — A.R.T Klinghardt™",
    body: "Autonomic Response Testing uncovers the hidden causes of illness. Every practitioner on our team is certified in A.R.T Klinghardt™.",
  },
  {
    icon: <LayersIcon />,
    title: "The 5 Levels of Healing™",
    body: "Dr. Klinghardt's signature framework addresses the physical, energetic, emotional, mental and spiritual dimensions of health, treating the whole person.",
  },
  {
    icon: <SproutIcon />,
    title: "Root-Cause Resolution",
    body: "We look at your entire system to understand why you haven't made progress before — not just managing Lyme, mould, heavy metals or trauma in isolation.",
  },
  {
    icon: <BoltIcon />,
    title: "A Hub of Research & Innovation",
    body: "Practitioners travel from around the world to learn from Dr. Klinghardt, and techniques created here have revolutionised how chronic illness is treated globally.",
  },
  {
    icon: <HeartIcon />,
    title: "Warm, Personalised Care",
    body: "Every case of chronic illness is unique. You'll receive dedicated attention from a team that listens, empathises and understands how you feel.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Intake & History Review",
    body: "Deep-dive into your complete health history, environment and prior treatments.",
  },
  {
    n: "02",
    title: "A.R.T Klinghardt™ Assessment",
    body: "Bioenergetic testing to identify hidden root causes and organ-level dysfunction.",
  },
  {
    n: "03",
    title: "Individualized Protocol",
    body: "A unique treatment plan addressing all relevant levels of illness.",
  },
  {
    n: "04",
    title: "Ongoing Support",
    body: "Regular follow-up, protocol adjustments and access to the SHI team.",
  },
];

const THERAPIES = [
  {
    icon: <DropletIcon />,
    title: "IV Therapies",
    body: "Biological intravenous therapies including ozone, intravascular laser therapy and intravenous nutrition.",
  },
  {
    icon: <JointIcon />,
    title: "Joint & Back Problems",
    body: "A unique approach, without opiates or other addictive substances.",
  },
  {
    icon: <LeafIcon />,
    title: "Traditional Therapies",
    body: "Homeopathy, neural therapy, liver flushes, castor oil packs, hot and cold baths, sauna, pulsed magnetic fields and microcurrent.",
  },
  {
    icon: <ClipboardCheckIcon />,
    title: "Comprehensive Assessment",
    body: "Physical, nutritional, hormonal and biodental evaluation at every visit, with individualised interpretation of your labs, history and imaging.",
  },
];

const CONDITIONS = [
  "Lyme disease",
  "Chronic fatigue",
  "Sleep & digestive disorders",
  "Chronic pain",
  "Mold illness",
  "Heavy metal toxicity",
  "Hormone imbalances",
  "Premature aging",
];

/**
 * Sophia Health Institute — the clinic's own landing.
 *
 * Rebuilt from the Figma frame `0:6594`, which is a full landing page: who the
 * clinic is, the figures, six pillars, how care actually runs, the therapies,
 * what it treats, and the closing band. The previous version carried three
 * invented headings and none of this — it was the page furthest from the design
 * in the whole audit (D2).
 */
export function SophiaPage() {
  const page = useSection(SECTION.sophiaHome, {
    title: "Founded by Dr. Dietrich Klinghardt™ Built for True Healing.",
    paragraphs: [
      "Sophia Health Institute by Dr. Klinghardt™ is a world-renowned healing centre dedicated to restoring health on every level — physical, emotional, mental and spiritual. We provide a truly individualised, root-cause approach to complex chronic illness.",
    ],
  });

  return (
    <>
      <Seo
        title={"Sophia Health Institute™ — Dr. Dietrich Klinghardt™"}
        description="A world-renowned healing centre for complex chronic illness: root-cause medicine, A.R.T. and the 5 Levels of Healing."
        path="/sophia"
      />

      {/* A brand lockup over the campus photo — the marketing headline lives
          in the section below instead, next to the same photo the design
          repeats there. */}
      <section className="sophia-hero">
        <img
          className="sophia-hero__photo"
          src="/images/sophia-clinic.webp"
          alt="Sophia Health Institute campus"
          width={1024}
          height={683}
          fetchPriority="high"
          decoding="async"
        />
        <div className="wrap sophia-hero__inner">
          <Reveal className="sophia-hero__content">
            <p className="sophia-hero__title">
              <span className="sophia-hero__title-main">Sophia</span>
              <span className="sophia-hero__title-sub">Health Institute</span>
            </p>
            <p className="sophia-hero__subtitle">by Dr. Klinghardt™</p>
            <div className="sophia-hero__actions">
              <Link className="btn btn-light" to="/sophia/new-patients">
                Become a new patient
              </Link>
              <Link className="btn btn-ghost" to="/sophia/accommodations">
                Travel & accommodation
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Who we are — the campus photo again, the claim and the copy. */}
      <section className="section wrap feature-row feature-row--right" id="chronic-illness">
        <Reveal className="feature-row__media">
          <img
            src="/images/sophia-clinic.webp"
            alt="Sophia Health Institute campus"
            width={1024}
            height={683}
            loading="lazy"
            decoding="async"
          />
        </Reveal>

        <Reveal className="feature-row__body" delay={90}>
          <p className="eyebrow">Sophia Health Institute by Dr. Klinghardt™</p>
          <h2><Marked text={page.title} /></h2>
          {page.lead ? <p className="feature-row__copy">{page.lead}</p> : null}
          <p className="feature-row__copy">
            We are a centre for true healing, where advanced medicine meets deep,
            individualised support. People come to us from all over the world
            seeking answers to why they have been struggling, and we meet them
            with cutting-edge science, genuine care and a commitment to
            understanding the whole person.
          </p>
          <Link className="btn btn-light" to="/sophia/new-patients">
            New patients <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </section>

      <Reveal className="section wrap stat-grid stat-grid--row">
        {STATS.map((stat) => (
          <div key={stat.value} className="stat">
            <p className="stat__value">{stat.value}</p>
            <p className="stat__label">{stat.label}</p>
          </div>
        ))}
      </Reveal>

      <section className="section wrap">
        <Reveal className="section-heading section-heading--center">
          <p className="eyebrow">What makes Sophia unique</p>
          <h2>Six Pillars of A Different Approach.</h2>
        </Reveal>
        <ul className="card-grid card-grid--3">
          {PILLARS.map((pillar, index) => (
            <Reveal as="li" key={pillar.title} className="card" delay={index * 60} shift={12}>
              <div className="card__icon">{pillar.icon}</div>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </Reveal>
          ))}
        </ul>
        <Reveal className="section-actions" delay={120}>
          <Link className="btn btn-light" to="/sophia/new-patients">
            New patients
          </Link>
        </Reveal>
      </section>

      {/* How care runs: the prose on the left, the numbered steps on the right. */}
      <section className="section wrap feature-row feature-row--right" id="naturopathic-care">
        <Reveal className="feature-row__media steps">
          <ol>
            {STEPS.map((step) => (
              <li key={step.n} className="step">
                <span className="step__n">{step.n}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="feature-row__body" delay={90}>
          <p className="eyebrow">Our approach</p>
          <h2>Cutting-edge Science Meets Heartfelt Care.</h2>
          <p className="feature-row__copy">
            At Sophia Health Institute by Dr. Klinghardt™, we don't just look at
            your symptoms. We look at your entire health history and current
            health profile — chronic infections, environmental toxicity, dental
            history, epigenetics, diet, lifestyle, your family system and more —
            to find and treat the root causes of why you are ill.
          </p>
          <p className="feature-row__copy">
            Beyond the science, it is our compassionate approach that makes the
            difference: a space where every patient feels safe, heard and
            genuinely supported.
          </p>
        </Reveal>
      </section>

      <section className="section wrap">
        <Reveal className="section-heading section-heading--center">
          <p className="eyebrow">Naturopathic care</p>
          <h2>Healing the Whole Person, Mind, Body, and Spirit.</h2>
        </Reveal>
        <ul className="card-grid card-grid--4">
          {THERAPIES.map((therapy, index) => (
            <Reveal as="li" key={therapy.title} className="card" delay={index * 60} shift={12}>
              <div className="card__icon">{therapy.icon}</div>
              <h3>{therapy.title}</h3>
              <p>{therapy.body}</p>
            </Reveal>
          ))}
        </ul>
        <Reveal className="section-actions" delay={120}>
          <Link className="btn btn-light" to="/sophia/new-patients">
            Become a new patient
          </Link>
        </Reveal>
      </section>

      <section className="section wrap">
        <Reveal className="section-heading section-heading--center">
          <p className="eyebrow">What we treat</p>
          <h2>Complex Conditions. Real Answers.</h2>
        </Reveal>
        <Reveal className="pill-list" delay={90}>
          {CONDITIONS.map((condition) => (
            <span key={condition} className="pill">
              {condition}
            </span>
          ))}
        </Reveal>
      </section>

      <CtaBand
        title={
          <>
            Stop Wondering.
            <br />
            Start Finding Answers.
          </>
        }
        body="The Sophia Health Institute by Dr. Klinghardt™ team is ready to help you. Before you become a patient, it is natural to have questions — our patient coordinator would be happy to answer them."
      >
        <Link className="btn btn-light" to="/sophia/new-patients">
          Become a new patient
        </Link>
      </CtaBand>

      <NewsletterSection />
    </>
  );
}
