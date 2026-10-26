import { Link } from "react-router-dom";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { useSection } from "@/lib/sections";

/**
 * What /store (and /cart) show while the store is switched off in the CMS
 * (Page Contents → Store block → "Tienda visible", client 2026-10-26). Its
 * words are the "store-coming-soon" block, so the editor can change them.
 */
export function StoreComingSoon() {
  const copy = useSection("store-coming-soon");

  return (
    <AnimatedGradient variant="card" intensity="soft" className="page-hero page-hero--center store-coming-soon">
      <div className="wrap page-hero__inner">
        <Reveal>
          {copy.eyebrow ? <p className="eyebrow"><Marked text={copy.eyebrow} /></p> : null}
          <h1><Marked text={copy.title} /></h1>
          {copy.lead ? <p className="lead">{copy.lead}</p> : null}
          <div className="store-coming-soon__actions">
            <Link className="btn btn-primary" to="/">
              Back to home
            </Link>
          </div>
        </Reveal>
      </div>
    </AnimatedGradient>
  );
}
