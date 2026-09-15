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
  const page = useSection("donate", {
    title: "Support the Foundation",
    paragraphs: [
      "Every contribution goes to preserving the archive, funding scholarships, and keeping this body of work available to the practitioners who come next.",
    ],
  });
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
            <p className="eyebrow">Klinghardt Foundation™</p>
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap two-col">
        <Reveal className="prose">
          <h2>Where a contribution goes</h2>
          <p>
            The Foundation preserves decades of clinical observation, lectures,
            protocols and educational material, and makes them available to
            practitioners, researchers and students who would otherwise have no
            route to them.
          </p>
          <p>
            Contributions fund the archive itself, scholarships for practitioners
            in training, and research into questions raised by the clinical work.
          </p>
          <p className="donate-note">
            Donations are processed by Stripe. Card details never reach this site
            or the Foundation.
          </p>
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
  return (
    <>
      <p className="eyebrow">Not open yet</p>
      <h2>Donations open soon</h2>
      <p className="donate-panel__note">
        The Foundation is still being established and cannot accept
        contributions yet. If you would like to support it, write to us and we
        will come back to you as soon as it can.
      </p>
      <Link className="btn btn-primary donate-panel__cta" to="/contact">
        Get in touch
      </Link>
    </>
  );
}
