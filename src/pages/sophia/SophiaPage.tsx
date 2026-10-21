import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useSection, SECTION } from "@/lib/sections";
import { Reveal } from "@/components/motion/Reveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Marked } from "@/components/Marked";
import { CtaBand } from "@/components/sections/CtaBand";
import { InViewVideo } from "@/components/sections/InViewVideo";
import { SOPHIA_WELCOME_VIDEO } from "@/data/media";
import {
  ShieldIcon,
  TargetIcon,
  LayersIcon,
  SproutIcon,
  BoltIcon,
  HeartIcon,
  DropletIcon,
  LeafIcon,
  ClipboardCheckIcon,
  PulseIcon,
  FlaskIcon,
  UserCheckIcon,
  SparklesIcon,
  TeamIcon,
} from "@/components/Icons";

/* Client (2026-09-12), via the designer: "para los numeros... podemos
   hacer un conteo" — split into the numeric target + suffix/format
   AnimatedCounter needs, instead of the pre-formatted display strings
   ("25+", "10K") this carried before. */
const STATS: { to: number; suffix?: string; format?: "k"; label: string }[] = [
  { to: 25, suffix: "+", label: "Years of clinical experience" },
  { to: 10000, format: "k", label: "Patients treated worldwide" },
  { to: 5, label: "Levels of healing addressed" },
  { to: 100, suffix: "%", label: "Root-cause focused care" },
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

// Client copy, 2026-10-21: three texts rewritten, "Joint & Back Problems"
// replaced by "Treating Chronic Illness", four cards added (two rows of four;
// the first row is IV, Chronic Illness, Traditional and Treatments Unavailable
// Elsewhere, per the client's follow-up the same day).
const THERAPIES = [
  {
    icon: <DropletIcon />,
    title: "IV Therapies",
    body: "At SHI by Dr.Klinghardt, personalized care starts with understanding what you need, we’ll help you explore the right options. For those seeking ongoing care, we can guide tailored recommendations, track your response to treatment, and inform adjustments as your needs evolve.",
  },
  {
    icon: <PulseIcon />,
    title: "Treating Chronic Illness",
    body: "If you're dealing with chronic illness, you might be skeptical of new treatment methods. It's natural to wonder what makes Sophia Health Institute by Dr.Klinghardt better than other clinics and treatment methods you've tried.",
  },
  {
    icon: <LeafIcon />,
    title: "Traditional Therapies",
    body: "Our approach brings together a range of therapies, including homeopathy, neural therapy, liver flushes, castor oil packs, hot and cold baths, sauna, PhotonWave, pulsed electromagnetic field therapy, and microcurrent.",
  },
  {
    icon: <SparklesIcon />,
    title: "Treatments Unavailable Elsewhere",
    body: "You get access to different treatment methods that other clinics don’t offer. Depending on your treatment plan, you’ll get an opportunity to try different healing methods from our extensive list of treatment options.",
  },
  {
    icon: <ClipboardCheckIcon />,
    title: "Comprehensive Assessment",
    body: "You’ll get an in depth treatment plan that targets the root cause of your illness, not just your symptoms. Oftentimes, you don’t just have Lyme disease, mold illness, heavy metals, a root canal, or unhealed trauma. We look at your illness in the context of the whole system so we can uncover as much as possible to understand why you haven’t made progress in the past with other treatment methods. We will do this before prescribing a new treatment plan to you.",
  },
  {
    icon: <FlaskIcon />,
    title: "Research and Innovation",
    body: "Practitioners from around the world have traveled far and wide to learn directly from Dr. Klinghardt, for his research and innovation in finding new, effective methods for treating the root causes of chronic illness. Techniques and methods created by Dr. Klinghardt have revolutionized the way chronic illness is treated around the world.",
  },
  {
    icon: <UserCheckIcon />,
    title: "Personalized Care",
    body: "You’ll get personalized care, attention, and support from a team of specialists who understand how you feel and have experience treating your symptoms. Our team is specially trained in helping you in all aspects of your healing. All of our doctors are very closely connected with Dr. Klinghardt. Dr.Klinghardt personally trains each doctor in administering best assessment protocols so they can find the missing links in your treatment to give you the support you’ve been searching for.",
  },
  {
    icon: <TeamIcon />,
    title: "Work With A Warm, Loving & Caring Team",
    body: "We offer a warm, loving, and caring treatment facility full of people who will listen to you, empathize with you, and do everything their power to help you through this tough and trying experience.",
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
    title: "Founded by Dr. Dietrich Klinghardt™ Built for True Healing",
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
          src="/images/sophia-welcome.webp"
          alt="Sophia Health Institute campus"
          width={1600}
          height={900}
          fetchPriority="high"
          decoding="async"
        />
        <div className="wrap sophia-hero__inner">
          <Reveal className="sophia-hero__content">
            <img
              className="sophia-hero__logo"
              src="/images/sophoa%20lockup_white.svg"
              alt="Sophia Health Institute by Dr. Klinghardt™"
              width={414}
              height={157}
            />
            <div className="sophia-hero__actions">
              <Link className="btn btn-light" to="/sophia/new-patients">
                <span className="btn-label">Become a new patient</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link className="btn btn-ghost" to="/sophia/accommodations">
                <span className="btn-label">Travel & accommodation</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Who we are — the campus photo, the claim and the copy. */}
      <section className="section wrap feature-row feature-row--right">
        <Reveal className="feature-row__media feature-row__media--match-copy">
          <InViewVideo {...SOPHIA_WELCOME_VIDEO} width={848} height={480} loop />
        </Reveal>

        <Reveal className="feature-row__body" delay={90}>
          <p className="eyebrow">Sophia Health Institute by Dr. Klinghardt™</p>
          <h2 className="sophia-welcome-title"><Marked text={page.title} /></h2>
          {page.lead ? <p className="feature-row__copy">{page.lead}</p> : null}
          <Link className="btn btn-primary" to="/sophia/new-patients">
            New patients <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </section>

      {/* The figures on the left, the mission statement on the right. */}
      <section className="section wrap feature-row">
        {/* Figma comment (Noemi Cruz): "animar" — each tile now reveals on
            its own as you scroll to it, staggered, instead of the whole
            grid fading up as one flat block. */}
        <div className="feature-row__media stat-grid">
          {STATS.map((stat, index) => (
            <Reveal as="div" key={stat.label} className="stat" delay={index * 80} shift={12}>
              <p className="stat__value">
                <AnimatedCounter to={stat.to} suffix={stat.suffix} format={stat.format} />
              </p>
              <p className="stat__label">{stat.label}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="feature-row__body" delay={90}>
          <p className="eyebrow">Who we are</p>
          <h2>A Different Kind of Medicine, Built Around You</h2>
          <p className="feature-row__copy">
            At Sophia Health Institute®, we believe real healing goes deeper than
            managing symptoms. Our mission is simple: to provide comprehensive,
            compassionate care that supports each person's journey toward optimal
            physical, emotional, mental and spiritual well-being.
          </p>
          <p className="feature-row__copy">
            We are a centre for true healing, where advanced medicine meets deep,
            individualised support. People come to us from all over the world
            seeking answers to why they have been struggling, and we meet them
            with cutting-edge science, genuine care and a commitment to
            understanding the whole person.
          </p>
        </Reveal>
      </section>

      <section className="section wrap">
        <Reveal className="section-heading section-heading--center sophia-pillars-heading">
          <p className="eyebrow">What makes Sophia unique</p>
          <h2>Six Pillars of A Different Approach</h2>
        </Reveal>
        <ul className="card-grid card-grid--3 sophia-pillars-grid">
          {PILLARS.map((pillar, index) => (
            <Reveal as="li" key={pillar.title} className="card" delay={index * 60} shift={12}>
              <div className="card__icon">{pillar.icon}</div>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </Reveal>
          ))}
        </ul>
        <Reveal className="section-actions" delay={120}>
          <Link className="btn btn-primary" to="/sophia/new-patients">
            New patients <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </section>

      {/* How care runs: the prose on the left, the numbered steps on the
          right. Each step now reveals on its own as it scrolls into view,
          staggered — same fix as the stat tiles above, not the whole list
          fading up as one flat block. */}
      <section className="section wrap feature-row feature-row--right">
        <div className="feature-row__media steps">
          <ol>
            {STEPS.map((step, index) => (
              <Reveal as="li" key={step.n} className="step" delay={index * 90} shift={12}>
                <span className="step__n">{step.n}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal className="feature-row__body" delay={90}>
          <p className="eyebrow">Our approach</p>
          <h2>Cutting-edge Science Meets Heartfelt Care</h2>
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

      <section className="section wrap" id="naturopathic-care">
        <Reveal className="section-heading section-heading--center sophia-therapies-heading">
          <p className="eyebrow">Naturopathic care</p>
          <h2>Healing the Whole Person, Mind, Body, and Spirit</h2>
        </Reveal>
        <ul className="card-grid card-grid--4 sophia-therapies-grid">
          {THERAPIES.map((therapy, index) => (
            <Reveal as="li" key={therapy.title} className="card" delay={index * 60} shift={12}>
              <div className="card__icon">{therapy.icon}</div>
              <h3>{therapy.title}</h3>
              <p>{therapy.body}</p>
            </Reveal>
          ))}
        </ul>
        <Reveal className="section-actions" delay={120}>
          <Link className="btn btn-primary" to="/sophia/new-patients">
            Become a new patient <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </section>

      <section className="section wrap" id="chronic-illness">
        <Reveal className="section-heading section-heading--center sophia-conditions-heading">
          <p className="eyebrow">What we treat</p>
          <h2>Complex Conditions. Real Answers</h2>
        </Reveal>
        <Reveal className="pill-list sophia-conditions-pills" delay={90}>
          {CONDITIONS.map((condition) => (
            <span key={condition} className="pill">
              {condition}
            </span>
          ))}
        </Reveal>
      </section>

      <CtaBand
        className="cta-band--dark"
        title={
          <>
            Stop Wondering.
            <br />
            Start Finding Answers
          </>
        }
        body="The Sophia Health Institute by Dr. Klinghardt™ team is ready to help you. Before you become a patient, it is natural to have questions — our patient coordinator would be happy to answer them."
      >
        <Link className="btn btn-light" to="/sophia/new-patients">
          Become a new patient <span aria-hidden="true">→</span>
        </Link>
      </CtaBand>
    </>
  );
}
