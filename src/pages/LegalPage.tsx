import { Seo } from "@/components/Seo";
import { useCollection, text } from "@/lib/content";
import { richTextBlocks } from "@/lib/cms";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";

const HEADINGS: Record<string, string> = {
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  refunds: "Refund Policy",
};

/**
 * Privacy, terms and refunds, from the `legal-pages` collection.
 *
 * These are the pages where inventing copy would be worse than showing none:
 * a policy this site has not actually adopted is a claim about how personal
 * data is handled. So there is no fallback text — an unpublished policy says so
 * and points at contact.
 */
export function LegalPage({ type }: { type: "privacy" | "terms" | "refunds" }) {
  const doc = useCollection("legal-pages").find((row) => row.type === type);
  const title = text(doc, "title", HEADINGS[type]);
  const paragraphs = richTextBlocks(doc?.body);
  const effective = text(doc, "effectiveDate");

  return (
    <>
      <Seo
        title={`${title} — Dr. Dietrich Klinghardt™`}
        noindex
      />

      <AnimatedGradient variant="page" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <p className="eyebrow">Legal</p>
            <h1><Marked text={title} /></h1>
            {effective ? (
              <p className="lead">
                Effective{" "}
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(effective))}
              </p>
            ) : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap">
        {paragraphs.length ? (
          <Reveal className="prose">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
        ) : (
          <p className="empty-note">
            This policy has not been published yet. Please{" "}
            <a href="/contact">get in touch</a> if you need it before it goes up.
          </p>
        )}
      </section>
    </>
  );
}
