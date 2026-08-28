import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";
import { useSection, SECTION } from "@/lib/sections";
import { env } from "@/lib/env";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/**
 * Dr. Klinghardt Foundation.
 *
 * The donation flow itself is a later phase — it needs a Stripe Connect account
 * with charges enabled before it can take a cent. Rather than show a Donate
 * button that cannot charge, this page states what the foundation does and
 * routes people to contact; the donation page replaces this CTA when the
 * account is live.
 */
export function FoundationPage() {
  const page = useSection(SECTION.foundation, {
    title: "Preserving Knowledge. Advancing Education.",
    paragraphs: [
      "The Dr. Klinghardt Foundation exists to keep forty years of clinical work available to the practitioners who come next — teaching, translating and archiving what would otherwise be lost with a generation.",
      "It funds scholarships for practitioners training in A.R.T., supports research into chronic illness that no commercial sponsor will pay for, and maintains the archive of seminars, papers and case material.",
    ],
  });

  return (
    <>
      <Head>
        <title>Dr. Klinghardt Foundation™</title>
        <meta
          name="description"
          content="Teaching, research and the archive: what the Dr. Klinghardt Foundation supports."
        />
        <link rel="canonical" href={`${env.SITE_URL}/foundation`} />
      </Head>

      <AnimatedGradient variant="page" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <p className="eyebrow">Klinghardt Foundation™</p>
            <h1>{page.title}</h1>
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap">
        <Reveal className="prose">
          {page.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Reveal>
      </section>

      <AnimatedGradient variant="section" intensity="soft" className="home-art">
        <div className="wrap home-art__inner">
          <Reveal>
            <p className="eyebrow">Support the work</p>
            <h2>Help keep the teaching alive</h2>
            <p className="home-art__copy">
              Scholarships, research and the archive are funded by the people who
              have been helped by this work. Write to us and we will tell you
              exactly where a contribution goes.
            </p>
            <div className="home-art__actions">
              <Link className="btn btn-light" to="/contact">
                Get in touch
              </Link>
            </div>
          </Reveal>
        </div>
      </AnimatedGradient>

      <NewsletterSection />
    </>
  );
}
