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

  const testimonials = useCollection("testimonials")
    .filter((row) => row.raw?.visible !== false)
    .map((row) => {
      const raw = row.raw ?? {};
      return {
        id: String(row.id ?? raw.id ?? ""),
        author: typeof raw.author === "string" ? raw.author.trim() : "",
        role: typeof raw.authorRole === "string" ? raw.authorRole.trim() : "",
        quote: typeof raw.quote === "string" ? raw.quote.trim() : "",
        video: videoEmbed(raw.videoTestimonial),
        avatar: mediaUrl(raw.avatar),
        order: typeof raw.order === "number" ? raw.order : 0,
      };
    })
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
        <div className="container">
          <Breadcrumbs
            items={[
              { label: "Sophia Health Institute", href: "/sophia" },
              { label: page.title || "Testimonials" },
            ]}
          />
          {page.eyebrow ? <p className="eyebrow">{page.eyebrow}</p> : null}
          <h1>{page.title || "Testimonials"}</h1>
          {page.paragraphs.length > 0 ? (
            <div className="page-hero__lede">
              {page.paragraphs.map((text, index) => (
                <p key={index}>
                  <Marked text={text} />
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </AnimatedGradient>

      <section className="section">
        <div className="container">
          {testimonials.length === 0 ? (
            /* Not an error: the clinic has not added one yet, and the page is
               reachable from the menu the moment it ships. */
            <p className="testimonial-empty">
              Patient stories are on their way. Please check back soon.
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
        </div>
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
