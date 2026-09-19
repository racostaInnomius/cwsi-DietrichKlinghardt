import { Seo } from "@/components/Seo";
import { Link, useParams } from "react-router-dom";
import { useCollection, text } from "@/lib/content";
import { mediaUrl, richTextBlocks } from "@/lib/cms";
import { slugifyName, teamBios } from "@/data/teamBios";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";

/**
 * "Learn more" page for one Sophia team member. Photo/name/role/title/bio
 * all come from the same `board-members` CMS row (same rows /sophia/team
 * lists) — `bio` is a shared field on that collection now (2026-09-19,
 * added for Sistworld's own board bios, board-members being a CMS
 * collection shared across tenants), read here the same way name/role/
 * title already are, no separate fetch needed.
 * Falls back to the local `teamBios` data (client, 2026-09-18: "de ahí
 * toma su info", sourced from https://www.sophiahi.com/team) until a
 * row's `bio` field is actually filled in — matched by slugifying the
 * row's name, see slugifyName. This replaces the earlier `page-contents`-
 * at-`sophia-team-bio-<slug>` workaround (sections.ts's sophiaTeamBioSlug,
 * now removed) built before `board-members` had a bio field of its own.
 */
export function TeamMemberPage() {
  const { slug } = useParams();
  const person = useCollection("board-members").find(
    (row) => slugifyName(text(row, "name")) === slug,
  );
  const cmsParagraphs = person ? richTextBlocks(person.bio) : [];
  const paragraphs = cmsParagraphs.length
    ? cmsParagraphs
    : (slug ? teamBios[slug]?.paragraphs : undefined) ?? [];

  if (!person || !paragraphs.length) {
    return (
      <>
        <Seo title={"Team member not found — Sophia Health Institute™"} noindex />
        <section className="section wrap">
          <h1>This team member isn't listed anymore.</h1>
          <p className="lead">
            They may no longer be with Sophia Health Institute. See the current team instead.
          </p>
          <Link className="btn btn-primary" to="/sophia/team">
            Meet our team
          </Link>
        </section>
      </>
    );
  }

  const name = text(person, "name");
  const role = text(person, "role");
  const title = text(person, "title");
  const chips = title.split(",").map((chip) => chip.trim()).filter(Boolean);
  const photo = mediaUrl(person.photo);

  return (
    <>
      <Seo
        title={`${name} — Sophia Health Institute™`}
        description={paragraphs[0]}
        path={`/sophia/team/${slug}`}
      />

      <AnimatedGradient variant="plain" intensity="soft" className="page-hero sophia-plain-hero">
        <div className="wrap page-hero__inner">
          <Breadcrumbs
            items={[
              { label: "Sophia", href: "/sophia" },
              { label: "Our team", href: "/sophia/team" },
              { label: name },
            ]}
          />
          <Reveal className="team-member-header">
            <div className="team-member-header__photo">
              {photo ? <img src={photo} alt={name} loading="eager" /> : null}
            </div>
            <div className="team-member-header__info">
              <h1>{name}</h1>
              {role ? <p className="team-member-header__role">{role}</p> : null}
              {chips.length ? (
                <ul className="team-member-header__chips">
                  {chips.map((chip) => (
                    <li key={chip} className="pill">
                      {chip}
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="lead">{paragraphs[0]}</p>
              <Link className="btn btn-primary team-member-header__cta" to="/contact">
                Contact us <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap">
        <Reveal className="prose team-member-about">
          <p className="eyebrow">About</p>
          {paragraphs.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
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
