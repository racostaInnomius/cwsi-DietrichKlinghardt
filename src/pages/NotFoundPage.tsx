import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The page an unknown address lands on.
 *
 * It is prerendered to `404.html` as well as being the router's catch-all, so
 * Apache can hand it back with a real 404 (see public/.htaccess) instead of
 * answering 200 with the home page, which is what used to happen: every typo
 * and every stale link showed the home page under its own address, and a
 * crawler read that as the site having the same page at countless URLs.
 *
 * `noindex` also keeps it out of the sitemap, which skips pages that opt out.
 */
export function NotFoundPage() {
  return (
    <>
      <Seo title={"Page not found — Dr. Dietrich Klinghardt™"} noindex />

      <AnimatedGradient variant="card" intensity="soft" className="page-hero page-hero--center">
        <div className="wrap page-hero__inner">
          <Reveal>
            <p className="eyebrow">404</p>
            <h1>This page could not be found</h1>
            <p className="lead">
              The address may have changed, or the link that brought you here may
              be out of date.
            </p>
            <p className="not-found__actions">
              <Link className="btn btn-primary" to="/">Go to the home page</Link>
              <Link className="btn btn-ghost" to="/events">See upcoming events</Link>
              <Link className="btn btn-ghost" to="/contact">Contact us</Link>
            </p>
          </Reveal>
        </div>
      </AnimatedGradient>
    </>
  );
}
