import { Seo } from "@/components/Seo";
import { useCollection, text } from "@/lib/content";
import { alignStyle, useSection, useRecords, SECTION } from "@/lib/sections";
import { externalUrl, mediaUrl, musicEmbed } from "@/lib/cms";
import { checkoutHref } from "@/lib/checkout";
import { CheckoutLink, Price } from "@/lib/currency";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { MusicPlayer } from "@/components/MusicPlayer";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/** label | url */
const LINKS_FALLBACK: string[][] = [
  ["SoundCloud", "https://soundcloud.com/dr-dietrich-klinghardt"],
];

/**
 * Music as medicine — the SoundCloud library plus the recordings that can be
 * bought.
 *
 * Every embed passes through `musicEmbed`, which admits nothing but a
 * `https://w.soundcloud.com/player/` URL from an active row. A row that fails
 * validation is dropped silently: a page missing one track is better than a
 * page that renders an arbitrary iframe from public CMS data.
 */
export function MusicPage() {
  const page = useSection(SECTION.music);
  const links = useRecords(SECTION.musicLinks, 2, LINKS_FALLBACK)
    .map(([label, href]) => [label, externalUrl(href)] as const)
    .filter((entry): entry is readonly [string, string] => Boolean(entry[1]));

  const tracks = useCollection("music-embeds")
    .map(musicEmbed)
    .filter((track): track is NonNullable<typeof track> => Boolean(track));

  // Heading and lead of the recordings section. Its cards are the CMS's own
  // digital-products rows: the client asked (2026-11-04) that nothing be shown
  // here while there is nothing really on sale, so the whole section leaves
  // the page rather than listing albums with an inert Add button.
  const discography = useSection("music-discography");

  const records = useCollection("digital-products").filter(
    (product) => product.status === "active" && Boolean(product.accessTrack),
  );

  return (
    <>
      <Seo
        title={"Music — Dr. Dietrich Klinghardt™"}
        description="Recordings and sound work by Dr. Dietrich Klinghardt."
        path="/music"
      />

      <AnimatedGradient variant="card" intensity="normal" className="page-hero page-hero--center music-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            {page.eyebrow ? <p className="eyebrow"><Marked text={page.eyebrow} /></p> : null}
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead" style={alignStyle(page, 0)}>{page.lead}</p> : null}
            {links.length ? (
              <p className="music-links">
                {links.map(([label, href]) => (
                  <a key={href} className="arrow-link" href={href} target="_blank" rel="noreferrer">
                    {label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </p>
            ) : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      {tracks.length ? (
        <section className="section wrap music-stack">
          {tracks.map((track, index) => (
            <Reveal key={track.embedUrl} delay={index * 90}>
              <MusicPlayer music={track} />
            </Reveal>
          ))}
        </section>
      ) : (
        <section className="section wrap">
          <p className="empty-note">
            The recordings are being prepared for release. Join the newsletter
            below to hear when they are available.
          </p>
        </section>
      )}

      {records.length ? (
        <section className="section wrap">
          <Reveal>
            {discography.eyebrow ? <p className="eyebrow"><Marked text={discography.eyebrow} /></p> : null}
            <h2 className="section-title"><Marked text={discography.title} /></h2>
            {discography.subtitle ? <p className="lead">{discography.subtitle}</p> : null}
          </Reveal>

          <ul className="record-grid">
            {records.map((record, index) => {
              const href = checkoutHref(record.checkoutUrl);
              const price = typeof record.price === "number" ? record.price : undefined;
              const cover = mediaUrl(record.hero);

              return (
                <Reveal as="li" key={String(record.id)} className="record-card" delay={index * 80}>
                  <div className="record-card__cover">
                    {cover ? <img src={cover} alt="" loading="lazy" /> : null}
                  </div>
                  <h3>{text(record, "title", "Untitled")}</h3>
                  {text(record, "subtitle") ? <p>{text(record, "subtitle")}</p> : null}
                  <div className="record-card__buy">
                    {price != null ? (
                      <span className="record-card__price">
                        <Price cents={price} currency={text(record, "currency", "usd")} />
                      </span>
                    ) : null}
                    {href ? (
                      <CheckoutLink
                        className="btn btn-primary"
                        href={href}
                        kind="product"
                        itemId={record.id}
                        currency={text(record, "currency", "usd")}
                      >
                        Buy
                      </CheckoutLink>
                    ) : (
                      <span className="record-card__soon">Coming soon</span>
                    )}
                  </div>
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
