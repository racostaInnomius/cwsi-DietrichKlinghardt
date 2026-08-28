import { Seo } from "@/components/Seo";
import { useCollection, text } from "@/lib/content";
import { useSection, useRecords, SECTION } from "@/lib/sections";
import { externalUrl, mediaUrl, musicEmbed } from "@/lib/cms";
import { checkoutHref } from "@/lib/checkout";
import { money } from "@/lib/format";
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
  const page = useSection(SECTION.music, {
    title: "Music as Medicine",
    paragraphs: [
      "Sound reaches levels of the nervous system that words do not. These recordings are made to be listened to slowly.",
    ],
  });
  const links = useRecords(SECTION.musicLinks, 2, LINKS_FALLBACK)
    .map(([label, href]) => [label, externalUrl(href)] as const)
    .filter((entry): entry is readonly [string, string] => Boolean(entry[1]));

  const tracks = useCollection("music-embeds")
    .map(musicEmbed)
    .filter((track): track is NonNullable<typeof track> => Boolean(track));

  // Recordings sold as digital products — the discography. F6 moves these into
  // the cart; until then each one links straight to its own Stripe link.
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

      <AnimatedGradient variant="page" intensity="normal" className="page-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <p className="eyebrow">Sound and healing</p>
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
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
            <p className="eyebrow">Discography</p>
            <h2 className="section-title">Take the recordings with you</h2>
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
                        {money(price, text(record, "currency", "usd"))}
                      </span>
                    ) : null}
                    {href ? (
                      <a className="btn btn-primary" href={href}>
                        Buy
                      </a>
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
