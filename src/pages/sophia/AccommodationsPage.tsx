import { Seo } from "@/components/Seo";
import { useSection, SECTION } from "@/lib/sections";
import { mapEmbedUrl } from "@/lib/cms";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { EventMetaIcon } from "@/components/Icons";

type Hotel = {
  name: string;
  address: string;
  phone?: string;
  site?: string;
  note?: string;
};

/**
 * The six hotels, transcribed from the Figma frame `0:7840` with their
 * addresses, phone numbers, sites and the discount note each one carries.
 *
 * They are a constant rather than CMS rows because they are the clinic's own
 * referral list, not editorial content — and because getting one of these
 * numbers wrong matters more than most copy on the site. If the clinic wants to
 * maintain them, they move to a collection; the layout does not change.
 */
const HOTELS: Hotel[] = [
  {
    name: "Heathman Hotel",
    address: "220 Kirkland Avenue, Kirkland, WA 98033",
    phone: "(425) 284-5800",
    site: "heathmankirkland.com",
    note: "Use promo code SINVA for a discounted rate, or call the hotel directly.",
  },
  {
    name: "Willows Lodge",
    address: "14580 Northeast 145th Street, Woodinville, WA 98072",
    phone: "(425) 424-3900",
    site: "willowslodge.com",
    note: "15% off the lowest rate when you mention you are a patient of Sophia HI.",
  },
  {
    name: "Hampton Inn & Suites",
    address: "19211 Woodinville Snohomish Rd, Woodinville, WA 98072",
    note: "Get the best discounted rate when you mention you are a patient of Sophia HI.",
  },
  {
    name: "Residence Inn",
    address: "1920 Northeast 195th Street, Bothell, WA 98011",
    phone: "(425) 485-3030",
    site: "cwp.marriott.com/seabo/sophia",
  },
  {
    name: "Comfort Inn & Suites",
    address: "1414 228th Street Southeast, Bothell, WA 98021",
    phone: "(425) 402-0900",
    site: "comfortinn.com",
  },
  {
    name: "Country Inn & Suites",
    address: "19333 North Creek Parkway, Bothell, WA 98011",
    phone: "(425) 485-5557",
    site: "countryinns.com",
  },
];

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
 * Rebuilt from frame `0:7840`: how to find the clinic, the six hotels with the
 * rates they hold for Sophia patients, and the closing band. The page
 * previously carried only the first heading (D8).
 */
export function AccommodationsPage() {
  const page = useSection(SECTION.accommodations, {
    title: "How to Find Us",
    paragraphs: [
      "Sophia Health Institute by Dr. Klinghardt™ sits in Woodinville, about 30 miles north-east of downtown Seattle — a town known for its scenic river valley, small-town charm, and lively mix of breweries, wineries and distilleries.",
      "We chose it for the calm it offers away from the city, plus easy access to the outdoors for hiking, walking and biking.",
    ],
  });

  const map = mapEmbedUrl(page.raw?.mapEmbedUrl) ?? FALLBACK_MAP_EMBED;

  return (
    <>
      <Seo
        title={"Travel & Accommodations — Sophia Health Institute™"}
        description="Finding the Sophia Health Institute in Woodinville, and the hotels nearby that hold a rate for patients."
        path="/sophia/accommodations"
      />

      <AnimatedGradient variant="card" intensity="soft" className="page-hero">
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
          <p className="eyebrow">Get started</p>
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
              Learn more at visitwoodinville.org
            </a>
          </div>
        </Reveal>
      </section>

      <section className="section wrap">
        <Reveal>
          <h2 className="section-title">Hotels in The Local Area</h2>
          <p className="lead">
            Many of the accommodations listed below have offered a discounted rate
            to Sophia Health Institute by Dr. Klinghardt™ patients, depending on
            occupancy. Please enquire about a discounted rate when booking your
            reservation.
          </p>
        </Reveal>

        <Reveal>
          <p className="eyebrow">Accommodations</p>
        </Reveal>

        <ul className="card-grid card-grid--3 hotels">
          {HOTELS.map((hotel, index) => (
            <Reveal as="li" key={hotel.name} className="card hotel" delay={index * 60} shift={12}>
              <div className="hotel__header">
                <span className="hotel__icon">
                  <EventMetaIcon kind="pin" />
                </span>
                <h3>{hotel.name}</h3>
              </div>
              <address>{hotel.address}</address>
              {hotel.phone ? (
                <p className="hotel__phone">
                  <a href={telHref(hotel.phone)}>{hotel.phone}</a>
                </p>
              ) : null}
              {hotel.site ? (
                <p className="hotel__site">
                  <a href={`https://${hotel.site}`} target="_blank" rel="noreferrer">
                    {hotel.site} <span aria-hidden="true">↗</span>
                  </a>
                </p>
              ) : null}
              {hotel.note ? <p className="hotel__note">{hotel.note}</p> : null}
            </Reveal>
          ))}
        </ul>
      </section>

      <CtaBand
        className="cta-band--dark"
        title={
          <>
            Ready to
            <br />
            Take The Next Step
          </>
        }
        body="Our friendly team is here to help. Fill out the form and we will review your message and respond as soon as possible during our regular business hours."
        subject="Travel and accommodation enquiry"
        formSplitName
      />
    </>
  );
}
