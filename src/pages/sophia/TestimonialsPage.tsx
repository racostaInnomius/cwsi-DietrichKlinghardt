import { Seo } from "@/components/Seo";
import { useSection, SECTION } from "@/lib/sections";
import { useCollection } from "@/lib/content";
import { videoEmbed, mediaUrl } from "@/lib/cms";
import { VideoPlayer } from "@/components/sections/VideoPlayer";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";

/**
 * What patients say (client, Ana 2026-11-09).
 *
 * Every testimonial comes from the CMS's own Testimonials collection, which
 * already existed and is already enabled for this tenant — the clinic adds
 * one there and it appears here, video or written, with nothing to touch in
 * the code. A row can be both: the video plays and the quote reads under it.
 *
 * Rows with neither are skipped rather than drawn as an empty card, and a
 * video that is not yet active in the library simply does not play, which is
 * what `videoEmbed` already decides for the rest of the site.
 */
export function TestimonialsPage() {
  const page = useSection(SECTION.testimonials);

  // A collection row IS the CMS document: its fields sit on the row itself,
  // the way every other page reads one (see SophiaTeamPage). The `.raw`
  // wrapper belongs to `useSection` blocks, not to rows, so reading through it
  // left every field undefined and the page drew its empty state no matter
  // what the clinic had added (client, Ana 2026-11-10).
  const testimonials = useCollection("testimonials")
    .map((row) => ({
      id: String(row.id ?? ""),
      author: typeof row.author === "string" ? row.author.trim() : "",
      role: typeof row.authorRole === "string" ? row.authorRole.trim() : "",
      quote: typeof row.quote === "string" ? row.quote.trim() : "",
      video: videoEmbed(row.videoTestimonial),
      avatar: mediaUrl(row.avatar),
      order: typeof row.order === "number" ? row.order : 0,
    }))
    .filter((item) => item.video || item.quote)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <Seo
        title={`${page.title || "Testimonials"} — Sophia Health Institute™`}
        description="Patients of the Sophia Health Institute by Dr. Klinghardt™ in their own words."
        path="/sophia/testimonials"
      />

      <AnimatedGradient variant="plain" intensity="soft" className="page-hero sophia-plain-hero">
        {/* The same shell every other Sophia page uses (see SophiaTeamPage):
            `wrap page-hero__inner` is what gives the page its gutters and its
            vertical rhythm. This page shipped with `container` and
            `page-hero__lede`, two classes the site does not define, so its
            content ran edge to edge and the lede lost its treatment. */}
        <div className="wrap page-hero__inner">
          <Breadcrumbs
            items={[
              { label: "Sophia Health Institute", href: "/sophia" },
              { label: page.title || "Testimonials" },
            ]}
          />
        </div>
      </AnimatedGradient>

      {/* The heading sits in the section, not in the hero, which is what
          /sophia/accommodations does and what the client asked for
          (2026-11-10: "quiero el eyebrow dorado"). On the hero's pale teal an
          eyebrow has to be ink to stay readable — the rule in base.css says
          so — whereas here it lands on the page's own ground and takes the
          gold every other eyebrow of the site uses. */}
      <section className="section wrap section--tight-top">
        <Reveal>
          {page.eyebrow ? <p className="eyebrow"><Marked text={page.eyebrow} /></p> : null}
          <h1>{page.title || "Testimonials"}</h1>
          {page.paragraphs.map((text, index) => (
            <p className="lead" key={index}>
              <Marked text={text} />
            </p>
          ))}
        </Reveal>
      </section>

      <section className="section wrap section--tight-top">
        {testimonials.length === 0 ? (
          /* Not an error: the clinic has not added one yet, and the page is
             reachable from the menu the moment it ships. The wording is the
             section's "Subtitle" so the clinic can change it from the panel
             like the rest of the page (client, 2026-11-10). */
          <p className="testimonial-empty">
            <Marked
              text={page.subtitle || "Patient stories are on their way. Please check back soon."}
            />
          </p>
        ) : (
          <div className="testimonial-grid">
              {testimonials.map((item, index) => (
              <Reveal key={item.id || index} delay={index * 60}>
                <article className="testimonial-card">
                  {item.video ? (
                    <VideoPlayer video={item.video} />
                  ) : item.avatar ? (
                    <img
                      className="testimonial-card__avatar"
                      src={item.avatar}
                      alt={item.author}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  {item.quote ? (
                    <blockquote className="testimonial-card__quote">
                      <Marked text={item.quote} />
                    </blockquote>
                  ) : null}
                  {item.author ? (
                    <footer className="testimonial-card__by">
                      <span className="testimonial-card__name">{item.author}</span>
                      {item.role ? (
                        <span className="testimonial-card__role">{item.role}</span>
                      ) : null}
                    </footer>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <CtaBand
        className="cta-band--dark"
        slug={SECTION.sophiaCtaNextStep}
        subject="Patient enquiry"
        formSplitName
      />
    </>
  );
}
