import { Brand } from "@/components/Brand";
import { InstagramIcon, MenuIcon, VimeoIcon } from "@/components/Icons";
import { NewsletterForm } from "@/components/NewsletterForm";
import { mediaUrl, richTextBlocks } from "@/lib/cms";
import { text, usePageContent } from "@/lib/content";
import { env } from "@/lib/env";

const FALLBACK_HEADING = "Klinghardt® Newsletter";
const FALLBACK_DESCRIPTION = "Stay current with upcoming events, clinical research updates, and receive invitations to live webinar hosted each week by Dr. Klinghardt®, and guests.";
const FALLBACK_CONSENT = "By subscribing you agree to receive email communications from the Klinghardt Institute.";
const FALLBACK_PRIVACY = "Your information is never shared.";
const FALLBACK_NO_SPAM = "No spam. Unsubscribe at any time.";

function TrademarkText({ value }: { value: string }) {
  const parts = value.split(/([™®])/);
  return <>{parts.filter(Boolean).map((part, index) => (
    part === "™" || part === "®"
      ? <sup key={`${part}-${index}`}>{part}</sup>
      : <span className="trademark-part" key={`${part}-${index}`}>{part}</span>
  ))}</>;
}

export function LandingPage() {
  const home = usePageContent("home");
  const newsletter = usePageContent("newsletter");
  const heroImage = mediaUrl(newsletter?.heroImage ?? home?.heroImage) ?? "/images/dietrich-klinghardt.jpg";
  const blocks = richTextBlocks(newsletter?.body);
  const details = (blocks[3] ?? `${FALLBACK_PRIVACY}\n${FALLBACK_NO_SPAM}`).split(/\n+/).filter(Boolean);
  const heading = blocks[0] ?? FALLBACK_HEADING;
  const description = blocks[1] ?? FALLBACK_DESCRIPTION;
  const consentLines = [blocks[2] ?? FALLBACK_CONSENT, details[0] ?? FALLBACK_PRIVACY];
  const noSpam = details.slice(1).join(" ") || FALLBACK_NO_SPAM;

  return <div className="landing-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header">
      <a href="#main-content" className="brand-link"><Brand /></a>
      <nav aria-label="Primary navigation">
        <a className="contact-link" href={env.CONTACT_URL}>Contact Us</a>
        <a className="social-link" href={env.VIMEO_URL} aria-label="Vimeo"><VimeoIcon /></a>
        <a className="social-link" href={env.INSTAGRAM_URL} aria-label="Instagram"><InstagramIcon /></a>
        <a className="menu-link" href="#newsletter" aria-label="Go to newsletter signup"><MenuIcon /></a>
      </nav>
    </header>

    <main id="main-content">
      <section id="newsletter" className="newsletter-section">
        <div className="newsletter-copy">
          <p className="eyebrow">{text(newsletter, "title", "Stay informed")}</p>
          <h1>
            <span>Sign Up for</span>
            <span><TrademarkText value={heading} /></span>
          </h1>
          <p>{description}</p>
          <NewsletterForm consentLines={consentLines} />
          <div className="no-spam"><span />{noSpam}</div>
        </div>
        <div className="newsletter-image">
          <img src={heroImage} alt="Dr. Dietrich Klinghardt" width="1920" height="1080" fetchPriority="high" />
        </div>
      </section>
    </main>

    <footer><Brand inverted /></footer>
  </div>;
}
