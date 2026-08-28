import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";
import { useSection } from "@/lib/sections";
import { env } from "@/lib/env";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

const BRANCHES = [
  {
    to: "/academy/art",
    eyebrow: "Signature method",
    title: "A.R.T. Klinghardt™",
    body: "Autonomic Response Testing: reading the body's own regulation to find what is driving illness, and in which order to address it.",
  },
  {
    to: "/academy/five-levels",
    eyebrow: "The framework",
    title: "The 5 Levels of Healing",
    body: "Physical, electric, mental, intuitive, spiritual — the levels illness lives on, and why treating the wrong one rarely holds.",
  },
  {
    to: "/courses",
    eyebrow: "Training",
    title: "Online Courses",
    body: "The certification paths, their curricula and the dates on which each seminar runs.",
  },
  {
    to: "/academy/therapists",
    eyebrow: "Directory",
    title: "Find an A.R.T. Therapist",
    body: "Practitioners trained in the method, by city and qualification.",
  },
  {
    to: "/academy/publications",
    eyebrow: "Reading",
    title: "Publications",
    body: "Papers, books and educational material from four decades of clinical work.",
  },
  {
    to: "/foundation",
    eyebrow: "Support",
    title: "Dr. Klinghardt Foundation™",
    body: "Scholarships, research and the archive that keeps the teaching available.",
  },
];

/**
 * Academy hub — the crossroads between the method, the framework, the training
 * and the practitioners. It holds no content of its own beyond its lead, which
 * is why the branches are a constant here rather than CMS rows: they are the
 * site's own structure, and an editor deleting one would break the navigation.
 */
export function AcademyPage() {
  const page = useSection("academy", {
    title: "Dr. Klinghardt Academy™",
    paragraphs: [
      "Everything taught under the Klinghardt name in one place: the method, the framework it sits inside, the training that certifies it, and the practitioners who work with it.",
    ],
  });

  return (
    <>
      <Head>
        <title>Dr. Klinghardt Academy™</title>
        <meta
          name="description"
          content="A.R.T., the 5 Levels of Healing, certification training and the practitioner directory."
        />
        <link rel="canonical" href={`${env.SITE_URL}/academy`} />
      </Head>

      <AnimatedGradient variant="page" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <p className="eyebrow">Learning centre</p>
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap">
        <ul className="branch-grid">
          {BRANCHES.map((branch, index) => (
            <Reveal as="li" key={branch.to} className="branch" delay={index * 70} shift={14}>
              <Link to={branch.to}>
                <p className="eyebrow">{branch.eyebrow}</p>
                <h2><Marked text={branch.title} /></h2>
                <p>{branch.body}</p>
                <span className="arrow-link">
                  Open <span aria-hidden="true">↗</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <NewsletterSection />
    </>
  );
}
