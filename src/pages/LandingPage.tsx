import { Brand } from "@/components/Brand";
import { InstagramIcon, MenuIcon, VimeoIcon } from "@/components/Icons";
import { NewsletterForm } from "@/components/NewsletterForm";
import { mediaUrl } from "@/lib/cms";
import { text, usePageContent } from "@/lib/content";
import { env } from "@/lib/env";

const NEWSLETTER_BODY = "Stay current with upcoming events, clinical research updates, and receive invitations to live webinar hosted each week by Dr. Klinghardt™, and guests.";

export function LandingPage() {
  const home = usePageContent("home");
  const newsletter = usePageContent("newsletter");
  const heroImage = mediaUrl(newsletter?.heroImage ?? home?.heroImage) ?? "/images/dietrich-klinghardt.jpg";

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
          <p className="eyebrow">Stay informed</p>
          <h1>
            <span>Sign Up for</span>
            <span>Klinghardt<sup>™</sup> Newsletter</span>
          </h1>
          <p>{text(newsletter, "bodyText", NEWSLETTER_BODY)}</p>
          <NewsletterForm />
          <div className="no-spam"><span />No spam. Unsubscribe at any time.</div>
        </div>
        <div className="newsletter-image">
          <img src={heroImage} alt="Dr. Dietrich Klinghardt" width="1920" height="1080" fetchPriority="high" />
        </div>
      </section>
    </main>

    <footer><Brand inverted /></footer>
  </div>;
}
