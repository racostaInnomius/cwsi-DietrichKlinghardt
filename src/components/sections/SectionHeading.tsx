import { Link } from "react-router-dom";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";

/**
 * The heading pattern every section of the design repeats: eyebrow,
 * display title, optional lead, and an optional "see all" link pushed to the
 * right on wide screens.
 *
 * `lead` takes a whole body: pass the block's paragraphs and each one gets
 * its own <p>, so a second paragraph written in the CMS reaches the page
 * instead of being dropped (client, 2026-10-26).
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  link,
  align = "start",
}: {
  eyebrow?: string;
  title: string;
  lead?: string | string[];
  link?: { label: string; to: string };
  align?: "start" | "center";
}) {
  return (
    <Reveal className={`section-heading section-heading--${align}`}>
      <div>
        {/* Through <Marked> like the rest of the site, so ™/® read small and
            raised here too (client, 2026-10-26). */}
        {eyebrow ? <p className="eyebrow"><Marked text={eyebrow} /></p> : null}
        <h2><Marked text={title} /></h2>
        {(Array.isArray(lead) ? lead : [lead])
          .filter((paragraph): paragraph is string => Boolean(paragraph?.trim()))
          .map((paragraph, index) => (
            <p key={index} className="lead">
              <Marked text={paragraph} />
            </p>
          ))}
      </div>
      {link ? (
        <Link className="arrow-link" to={link.to}>
          {link.label} <span aria-hidden="true">↗</span>
        </Link>
      ) : null}
    </Reveal>
  );
}
