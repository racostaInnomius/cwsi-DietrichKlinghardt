import { Suspense, lazy } from "react";
import { Seo } from "@/components/Seo";

// Stripe Elements is a large dependency and only matters once the Foundation
// can accept a charge — split so no other page carries it.
const DonationForm = lazy(() => import("./DonationForm"));
import { Link } from "react-router-dom";
import { useDonationContext } from "@/lib/donations";
import { useSection } from "@/lib/sections";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";

/**
 * Support the Foundation.
 *
 * The whole page hinges on one question, answered at runtime: can the
 * Foundation actually accept a charge? Its Stripe onboarding state is not
 * known at build time and changes without a rebuild, so a statically baked
 * answer would eventually be wrong. Until the account is live the page says
 * so plainly rather than showing a form that would fail at the last step.
 */
export function DonatePage() {
  const page = useSection("donate");
  const where = useSection("donate-where-a-contribution-goes");
  const { status, context } = useDonationContext();

  return (
    <>
      <Seo
        title={"Support the Dr. Klinghardt Foundation™"}
        description="Support the archive, the scholarships and the research of the Dr. Klinghardt Foundation."
        path="/foundation/donate"
      />

      <AnimatedGradient variant="card" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Breadcrumbs
            items={[{ label: "Foundation", href: "/foundation" }, { label: "Support" }]}
          />
          <Reveal>
            {page.eyebrow ? <p className="eyebrow"><Marked text={page.eyebrow} /></p> : null}
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap two-col">
        <Reveal className="prose">
          <h2><Marked text={where.title} /></h2>
          {/* The last paragraph is the small payment note under the copy. */}
          {where.paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={index > 0 && index === where.paragraphs.length - 1 ? "donate-note" : undefined}
            >
              {paragraph}
            </p>
          ))}
        </Reveal>

        <Reveal as="aside" className="donate-panel" delay={120}>
          {status === "loading" ? (
            <p className="donate-panel__note">Checking donation availability…</p>
          ) : status === "ready" && context ? (
            <Suspense fallback={<p className="donate-panel__note">Loading the form…</p>}>
              <DonationForm context={context} />
            </Suspense>
          ) : (
            <ClosedNotice />
          )}
        </Reveal>
      </section>
    </>
  );
}

/**
 * Shown whenever the Foundation cannot take a charge — no Stripe account yet,
 * onboarding incomplete, or the API unreachable. Deliberately does not
 * distinguish between them: to a donor they are the same fact.
 */
function ClosedNotice() {
  const notice = useSection("donate-donations-open-soon");
  return (
    <>
      {notice.eyebrow ? <p className="eyebrow"><Marked text={notice.eyebrow} /></p> : null}
      <h2><Marked text={notice.title} /></h2>
      {notice.paragraphs.map((paragraph) => (
        <p key={paragraph} className="donate-panel__note">
          {paragraph}
        </p>
      ))}
      <Link className="btn btn-primary donate-panel__cta" to="/contact">
        Get in touch
      </Link>
    </>
  );
}
