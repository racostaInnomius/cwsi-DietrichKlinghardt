import { Link } from "react-router-dom";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The heading pattern every section of the design repeats: eyebrow,
 * display title, optional lead, and an optional "see all" link pushed to the
 * right on wide screens.
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
  lead?: string;
  link?: { label: string; to: string };
  align?: "start" | "center";
}) {
  return (
    <Reveal className={`section-heading section-heading--${align}`}>
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {lead ? <p className="lead">{lead}</p> : null}
      </div>
      {link ? (
        <Link className="arrow-link" to={link.to}>
          {link.label} <span aria-hidden="true">↗</span>
        </Link>
      ) : null}
    </Reveal>
  );
}
