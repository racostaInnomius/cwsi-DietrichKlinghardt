import { useEffect, useRef } from "react";

/**
 * The staggered instructor-photo cluster on the Courses hero's right side,
 * replacing TeachersStrip's text marquee now that real photos exist for it
 * (client, 2026-09-09) — same "el header replica new.consciouslife.com"
 * brief TeachersStrip's own comment already cited, but as a vertical
 * scroll-parallax of photo cards instead of a horizontal auto-drifting
 * text strip.
 *
 * Two columns, the right one offset down to interlock with the left —
 * each column drifts vertically at its own rate as the page scrolls, a
 * few pixels apart so the cluster reads as layered rather than flat.
 * `.courses-hero` (sections.css) clips this with overflow: hidden, so the
 * drift is only ever visible inside the hero's own frame, never past it.
 */
const PEOPLE = [
  {
    name: "Dr. Dietrich Klinghardt™",
    title: "Medicine Doctor",
    image: "/images/dietrich-klinghardt-course.webp",
    column: "a" as const,
  },
  {
    name: "Michaela Jezzard",
    title: "Medicine Doctor",
    image: "/images/michaela-jezzard.webp",
    column: "a" as const,
  },
  {
    name: "Daniela Deiosso",
    title: "Medicine Doctor",
    image: "/images/daniela-deiosso.webp",
    column: "b" as const,
  },
  {
    name: "Summer Beattie",
    title: "Medicine Doctor",
    image: "/images/summer-beattie.webp",
    column: "b" as const,
  },
];

export function CoursesHeroPhotos() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame: number;
    function raf() {
      const el = ref.current;
      if (el) {
        // 0 when the cluster's centre is at the viewport's own centre —
        // negative above it, positive below — so the drift is centred on
        // the natural "resting" scroll position instead of only ever
        // running one direction.
        const rect = el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2 - window.innerHeight / 2;
        // Clamped to ±280px — was ±1200 (client, 2026-09-09: "no se nota
        // que tenga algun efecto... hazlo mas llamativo"), which combined
        // with the CSS rates below meant the full drift only showed up
        // after scrolling much further than the hero is actually on
        // screen for. A tighter clamp reaches its full effect within an
        // ordinary scroll past the hero instead of needing an unrealistic
        // amount of it, and stays capped rather than sliding the cards
        // fully out of frame on a long scroll.
        const clamped = Math.max(-280, Math.min(280, -mid));
        // "px" suffix matters: without a unit, multiplying this by the
        // unitless --courses-photos-rate in CSS produces a bare number,
        // which translateY() rejects outright — an invalid calc() drops
        // the WHOLE transform declaration, not just the invalid part. That
        // was the actual bug behind "no se nota que tenga algun efecto":
        // the transform was never applying at all, at any rate.
        el.style.setProperty("--courses-photos-scroll", `${clamped}px`);
      }
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="courses-hero-photos" ref={ref} aria-label="Instructors">
      <div className="courses-hero-photos__col courses-hero-photos__col--a">
        {PEOPLE.filter((p) => p.column === "a").map((person) => (
          <PhotoCard key={person.name} {...person} />
        ))}
      </div>
      <div className="courses-hero-photos__col courses-hero-photos__col--b">
        {PEOPLE.filter((p) => p.column === "b").map((person) => (
          <PhotoCard key={person.name} {...person} />
        ))}
      </div>
    </div>
  );
}

function PhotoCard({
  name,
  title,
  image,
}: {
  name: string;
  title: string;
  image: string;
}) {
  return (
    <figure className="courses-hero-photos__card">
      <img src={image} alt="" loading="lazy" decoding="async" />
      <figcaption>
        <b>{name}</b>
        <span>{title}</span>
      </figcaption>
    </figure>
  );
}
