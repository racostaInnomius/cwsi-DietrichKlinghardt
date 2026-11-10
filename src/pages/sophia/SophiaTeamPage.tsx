import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useCollection, text, number } from "@/lib/content";
import { alignStyle, useSection, SECTION } from "@/lib/sections";
import { mediaUrl, richTextMarked } from "@/lib/cms";
import { slugifyName, teamBios } from "@/data/teamBios";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { ButtonText } from "@/components/ButtonText";

/**
 * Meet Our Team, from the `board-members` collection — the CMS's people
 * collection, reused here for clinicians. Ordered by the collection's own
 * `order` field so the clinic controls who leads the grid.
 */
export function SophiaTeamPage() {
  const page = useSection(SECTION.sophiaTeam);

  // The clinic sets this order by dragging the rows in the panel, which Payload
  // keeps in its own `_order` key (client, 2026-11-10). The numeric field is
  // still read for a row the panel has not touched since, and as the tiebreaker
  // while both carry the same key.
  const team = [...useCollection("board-members")].sort((a, b) => {
    const keyA = typeof a._order === "string" ? a._order : "";
    const keyB = typeof b._order === "string" ? b._order : "";
    if (keyA && keyB && keyA !== keyB) return keyA < keyB ? -1 : 1;
    return number(a, "order") - number(b, "order");
  });

  return (
    <>
      <Seo
        title={"Meet Our Team — Sophia Health Institute™"}
        description="The clinicians of the Sophia Health Institute."
        path="/sophia/team"
      />

      <AnimatedGradient
        variant="plain"
        intensity="soft"
        className="page-hero sophia-plain-hero page-hero--center sophia-team-hero"
      >
        <div className="wrap page-hero__inner">
          <Breadcrumbs items={[{ label: "Sophia", href: "/sophia" }, { label: "Our team" }]} />
          <Reveal>
            {page.eyebrow ? <p className="eyebrow"><Marked text={page.eyebrow} /></p> : null}
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead" style={alignStyle(page, 0)}>{page.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap sophia-team-grid-section">
        {team.length ? (
          <ul className="team-grid">
            {team.map((person, index) => {
              const photo = mediaUrl(person.photo);
              const slug = slugifyName(text(person, "name"));
              // A bio written in the panel counts the same as one bundled
              // with the site. Until 2026-11-10 only the bundled list did, so
              // a clinician the clinic added in the CMS got a "Learn more"
              // button that led nowhere (client, 2026-11-10).
              const hasBio =
                richTextMarked(person.bio).length > 0 || Boolean(teamBios[slug]);
              return (
                <Reveal
                  as="li"
                  key={String(person.id ?? index)}
                  className="team-card"
                  delay={index * 70}
                  shift={14}
                >
                  <div className="team-card__photo">
                    {photo ? (
                      <img src={photo} alt={text(person, "name")} loading="lazy" />
                    ) : null}
                  </div>
                  <div className="team-card__body">
                    <h2>{text(person, "name")}</h2>
                    <p className="team-card__role">{text(person, "role")}</p>
                    {text(person, "title") ? (
                      <p className="team-card__title">{text(person, "title")}</p>
                    ) : null}
                    {hasBio ? (
                      <Link
                        className="btn btn-primary team-card__cta"
                        to={`/sophia/team/${slug}`}
                      >
                        <ButtonText id="sophia-team-learn-more" /> <span aria-hidden="true">→</span>
                      </Link>
                    ) : (
                      <button type="button" className="btn btn-primary team-card__cta">
                        <ButtonText id="sophia-team-learn-more" /> <span aria-hidden="true">→</span>
                      </button>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </ul>
        ) : (
          <p className="empty-note">
            The team page is being prepared. In the meantime, new patient
            enquiries reach us through the New Patients page.
          </p>
        )}
      </section>

      <CtaBand slug={SECTION.sophiaCtaStopWondering}>
        <Link className="btn btn-light" to="/sophia/new-patients">
          <ButtonText id="sophia-become-a-new-patient" /> <span aria-hidden="true">→</span>
        </Link>
      </CtaBand>
    </>
  );
}
