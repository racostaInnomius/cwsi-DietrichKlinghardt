import { Seo } from "@/components/Seo";
import { useSection, SECTION } from "@/lib/sections";
import { mapEmbedUrl } from "@/lib/cms";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { EventMetaIcon } from "@/components/Icons";

/* The hotels are cards of the "sophia-accommodations-hotels" Page Contents
   block (client, 2026-10-21: editable and reorderable by the clinic): title =
   name, "Más datos" → subtitle = address, phone, link = site; text = the note.
   Their first content is in src/data/blocks.ts. */

/** "comfortinn.com" or a full URL → a link the browser can follow. */
function siteHref(site: string) {
  return /^https?:\/\//i.test(site) ? site : `https://${site}`;
}

/** The site as the reader should see it, without the scheme. */
function siteLabel(site: string) {
  return site.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

/** Digits only — what a phone link needs, from what a reader should see. */
function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/* Same query the old text-only fallback linked out to — Google's query-embed
   form (no API key required) so the CMS's own mapEmbedUrl can still take over
   the moment the clinic sets one, but the page shows an actual map either way. */
const FALLBACK_MAP_EMBED =
  "https://www.google.com/maps?q=Sophia+Health+Institute,+Woodinville,+WA&output=embed";

/**
 * Travel & Accommodations.
 *
 * Rebuilt from frame `0:7840`: how to find the clinic, the hotels with the
 * rates they hold for Sophia patients, and the closing band. The page
 * previously carried only the first heading (D8).
 */
export function AccommodationsPage() {
  const page = useSection(SECTION.accommodations);
  const hotels = useSection(SECTION.accommodationsHotels);

  const map = mapEmbedUrl(page.raw?.mapEmbedUrl) ?? FALLBACK_MAP_EMBED;

  return (
    <>
      <Seo
        title={"Travel & Accommodations — Sophia Health Institute™"}
        description="Finding the Sophia Health Institute in Woodinville, and the hotels nearby that hold a rate for patients."
        path="/sophia/accommodations"
      />

      <AnimatedGradient variant="plain" intensity="soft" className="page-hero sophia-plain-hero">
        <div className="wrap page-hero__inner">
          <Breadcrumbs
            items={[{ label: "Sophia", href: "/sophia" }, { label: "Travel & accommodations" }]}
          />
        </div>
      </AnimatedGradient>

      <section
        id="how-to-find-us"
        className="section wrap feature-row feature-row--right feature-row--tight-top"
      >
        <Reveal className="feature-row__media">
          <iframe
            className="map-embed"
            src={map}
            title="Sophia Health Institute on the map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>

        <Reveal className="feature-row__body" delay={90}>
          {page.eyebrow ? <p className="eyebrow"><Marked text={page.eyebrow} /></p> : null}
          <h1><Marked text={page.title} /></h1>
          {page.paragraphs.map((paragraph) => (
            <p key={paragraph} className="feature-row__copy">
              {paragraph}
            </p>
          ))}
          <div className="feature-row__actions">
            <a
              className="btn btn-brand"
              href="https://visitwoodinville.org"
              target="_blank"
              rel="noreferrer"
            >
              Learn more at visitwoodinville.org <span aria-hidden="true">→</span>
            </a>
          </div>
        </Reveal>
      </section>

      <section className="section wrap">
        <Reveal>
          <h2 className="section-title"><Marked text={hotels.title} /></h2>
          {hotels.lead ? <p className="lead">{hotels.lead}</p> : null}
        </Reveal>

        {hotels.eyebrow ? (
          <Reveal>
            <p className="eyebrow"><Marked text={hotels.eyebrow} /></p>
          </Reveal>
        ) : null}

        <ul className="card-grid card-grid--3 hotels">
          {hotels.cards.map((hotel, index) => (
            <Reveal as="li" key={`${index}-${hotel.title}`} className="card hotel" delay={index * 60} shift={12}>
              <div className="hotel__header">
                <span className="hotel__icon">
                  <EventMetaIcon kind="pin" />
                </span>
                <h3><Marked text={hotel.title} /></h3>
              </div>
              {hotel.subtitle ? <address>{hotel.subtitle}</address> : null}
              {hotel.phone ? (
                <p className="hotel__phone">
                  <a href={telHref(hotel.phone)}>{hotel.phone}</a>
                </p>
              ) : null}
              {hotel.link ? (
                <p className="hotel__site">
                  <a href={siteHref(hotel.link)} target="_blank" rel="noreferrer">
                    {siteLabel(hotel.link)} <span aria-hidden="true">↗</span>
                  </a>
                </p>
              ) : null}
              {hotel.body ? <p className="hotel__note">{hotel.body}</p> : null}
            </Reveal>
          ))}
        </ul>
      </section>

      <CtaBand
        className="cta-band--dark"
        slug={SECTION.sophiaCtaNextStep}
        subject="Travel and accommodation enquiry"
        formSplitName
      />
    </>
  );
}
