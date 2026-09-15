import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useCollection, text, number } from "@/lib/content";
import { useSection, SECTION } from "@/lib/sections";
import { mediaUrl } from "@/lib/cms";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";

/**
 * Meet Our Team, from the `board-members` collection — the CMS's people
 * collection, reused here for clinicians. Ordered by the collection's own
 * `order` field so the clinic controls who leads the grid.
 */
export function SophiaTeamPage() {
  const page = useSection(SECTION.sophiaTeam, {
    title: "Meet Our Team",
    paragraphs: [
      "Physicians, naturopathic doctors and therapists who work together on the same patient.",
    ],
  });

  const team = [...useCollection("board-members")].sort(
    (a, b) => number(a, "order") - number(b, "order"),
  );

  return (
    <>
      <Seo
        title={"Meet Our Team — Sophia Health Institute™"}
        description="The clinicians of the Sophia Health Institute."
        path="/sophia/team"
      />

      <AnimatedGradient variant="card" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Breadcrumbs items={[{ label: "Sophia", href: "/sophia" }, { label: "Our team" }]} />
          <Reveal>
            <p className="eyebrow">Sophia Health Institute™</p>
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap">
        {team.length ? (
          <ul className="team-grid">
            {team.map((person, index) => {
              const photo = mediaUrl(person.photo);
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
                  <h2>{text(person, "name")}</h2>
                  <p className="team-card__role">{text(person, "role")}</p>
                  {text(person, "title") ? (
                    <p className="team-card__title">{text(person, "title")}</p>
                  ) : null}
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

      <CtaBand
        title={
          <>
            Stop Wondering.
            <br />
            Start Finding Answers.
          </>
        }
        body="The Sophia Health Institute by Dr. Klinghardt™ team is ready to help you. Before you become a patient, it is natural to have questions — our patient coordinator would be happy to answer them."
      >
        <Link className="btn btn-light" to="/sophia/new-patients">
          Become a new patient
        </Link>
      </CtaBand>
    </>
  );
}
