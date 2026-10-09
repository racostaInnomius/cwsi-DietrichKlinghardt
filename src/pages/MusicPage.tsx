import { Seo } from "@/components/Seo";
import { useCollection, text } from "@/lib/content";
import { useSection, useRecords, SECTION } from "@/lib/sections";
import { externalUrl, mediaUrl, musicEmbed } from "@/lib/cms";
import { checkoutHref } from "@/lib/checkout";
import { Price } from "@/lib/currency";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { CartIcon } from "@/components/Icons";
import { MusicPlayer } from "@/components/MusicPlayer";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/** label | url */
/**
 * The three albums the frame lists, with the credits, price and cover the
 * client's own reference shows for each. `title | format | credits | price
 * | image`, price in cents (matches `money()`, lib/format.ts).
 *
 * Client (2026-09-27): rebuilt this fallback as cards matching a reference
 * screenshot, price and an "Add" button included — a deliberate reversal of
 * this file's earlier stance (a price/Add button next to nothing purchasable
 * being a promise the site couldn't keep). Per the client, the button stays
 * visual-only for now (no onClick, same inert-button convention
 * SophiaTeamPage.tsx uses for a team member with no bio yet) until these
 * three albums exist as real `digital-products` rows with their own Stripe
 * price — wiring `useCart` against fabricated products now would let a
 * shopper add something checkout can't actually resolve.
 *
 * Covers supplied directly (2026-09-27, /Users/rodrigo/Desktop/Album1-3.png)
 * — real photographed CD cases, rainbow case-edge reflection included in the
 * shot itself, so the CSS-drawn spine/refraction-line approximation this
 * fallback used before real covers existed is gone (see git history if it's
 * ever needed for a fourth album with no cover yet).
 */
const DISCOGRAPHY_FALLBACK: string[][] = [
  ["Just the way I am", "CD", "Guitar: Jürgen Schröder · Djembe: Stefan Bretscher · Choir: PK IV, Wildhaus/Schweiz", "1800", "/images/discography/just-the-way-i-am.png"],
  ["Depths and Heights", "CD", "Dietrich Klinghardt & Jürgen Schröder — live mit den ART-Artists & Melanie", "2500", "/images/discography/depths-and-heights.png"],
  ["Unplugged", "CD", "Guitar: Jürgen Schröder · Percussion: Jürgen Bayer · Choir: PK IV, St. Oswald 2010", "1800", "/images/discography/unplugged.png"],
];

const LINKS_FALLBACK: string[][] = [
  ["SoundCloud", "https://soundcloud.com/dr-dietrich-klinghardt"],
];

/**
 * "$25,00 usd" — the discography cards' own price format, matched literally
 * to the client's reference screenshot rather than the sitewide `money()`
 * (which would print "$25", no decimals or currency code). Scoped to this
 * one fallback display; real `digital-products` rows (record-card, above)
 * keep using `money()` like every other price on the site.
 */
function discographyPrice(cents: number, currency = "usd"): string {
  return `$${(cents / 100).toFixed(2).replace(".", ",")} ${currency}`;
}

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
  const albums = useRecords("music-discography", 5, DISCOGRAPHY_FALLBACK);

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

      <section className="section wrap">
        <Reveal>
          <p className="eyebrow">Recordings</p>
          <h2 className="section-title">Discography</h2>
          <p className="lead">
            All recordings are available as high-quality digital downloads.
            Proceeds support the ongoing research work of the Klinghardt
            Foundation.
          </p>
        </Reveal>

        {records.length ? (
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
        ) : (
          /* No products in the CMS yet, so the albums are listed as the
             client's reference design shows them — the Add button is
             visual-only until these exist as real digital-products rows
             (see DISCOGRAPHY_FALLBACK's own comment, above). */
          <ul className="discography-grid">
            {albums.map(([title, format, credits, price, image], index) => (
              <Reveal as="li" key={title} className="discography-card" delay={index * 70}>
                <div className="discography-card__case">
                  {image ? <img src={image} alt={`${title} CD case`} loading="lazy" /> : null}
                </div>
                <div className="discography-card__title">
                  <h3>{title}</h3>
                  <span className="discography-card__format">{format}</span>
                </div>
                <p className="discography-card__credits">{credits}</p>
                <div className="discography-card__footer">
                  <span className="discography-card__price">{discographyPrice(Number(price))}</span>
                  <button type="button" className="btn btn-primary discography-card__add">
                    <CartIcon /> Add
                  </button>
                </div>
              </Reveal>
            ))}
          </ul>
        )}
      </section>

      <NewsletterSection />
    </>
  );
}
