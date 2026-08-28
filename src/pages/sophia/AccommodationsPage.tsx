import { Seo } from "@/components/Seo";
import { useSection, useRecords, SECTION } from "@/lib/sections";
import { externalUrl, mapEmbedUrl } from "@/lib/cms";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/** name | distance or note | website */
const PLACES_FALLBACK: string[][] = [];

/**
 * Travel & Accommodations.
 *
 * Patients often travel a long way for a course of treatment, so the practical
 * list matters more than the prose. Hotels come from an `accommodations-list`
 * row (name | note | website per line); with no row and no fallback the list
 * simply does not render, rather than showing places nobody vouched for.
 */
export function AccommodationsPage() {
  const page = useSection(SECTION.accommodations, {
    title: "How to Find Us",
    paragraphs: [
      "The clinic is in Woodinville, Washington, about half an hour north-east of Seattle. Most patients fly into Seattle–Tacoma and drive out; treatment weeks usually mean staying nearby.",
    ],
  });
  const places = useRecords("accommodations-list", 3, PLACES_FALLBACK);
  const mapUrl = mapEmbedUrl(useRecords("accommodations-map", 1, [])[0]?.[0]);
  // The first paragraph is already the hero lead.
  const body = page.paragraphs.slice(1);

  return (
    <>
      <Seo
        title={"Travel & Accommodations — Sophia Health Institute™"}
        description="How to reach the Sophia Health Institute and where to stay during treatment."
        path="/sophia/accommodations"
      />

      <AnimatedGradient variant="page" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Breadcrumbs
            items={[
              { label: "Sophia", href: "/sophia" },
              { label: "Travel & accommodations" },
            ]}
          />
          <Reveal>
            <p className="eyebrow">Getting here</p>
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      {body.length || mapUrl ? (
        <section className={`section wrap${mapUrl && body.length ? " two-col" : ""}`}>
          {body.length ? (
            <Reveal className="prose">
              {body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>
          ) : null}

          {mapUrl ? (
            <Reveal delay={100}>
              <iframe
                className="map-frame"
                title="Sophia Health Institute on the map"
                src={mapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Reveal>
          ) : null}
        </section>
      ) : null}

      {places.length ? (
        <section className="section wrap">
          <Reveal>
            <p className="eyebrow">Where to stay</p>
            <h2 className="section-title">Nearby accommodation</h2>
          </Reveal>
          <ul className="place-list">
            {places.map(([name, note, url], index) => {
              const href = externalUrl(url);
              return (
                <Reveal as="li" key={name} className="place" delay={index * 70} shift={12}>
                  <div>
                    <h3>{name}</h3>
                    <p>{note}</p>
                  </div>
                  {href ? (
                    <a className="arrow-link" href={href} target="_blank" rel="noreferrer">
                      Visit <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </Reveal>
              );
            })}
          </ul>
        </section>
      ) : null}

      <NewsletterSection />
    </>
  );
}
