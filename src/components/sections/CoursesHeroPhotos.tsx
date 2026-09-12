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
      // Client (2026-09-10): the hero is now pinned (.courses-hero-pin,
      // sections.css) instead of scrolling past freely — the drift is
      // driven off that pin's own 0→1 progress (same dwell/progress math
      // as HomePage.tsx's hero/newsletter pins) rather than the card's
      // free-floating position relative to the viewport's centre, so the
      // photos settle into place exactly once over the hold instead of
      // nudging back and forth as the whole page scrolls past.
      const wrapper = document.querySelector<HTMLElement>(".courses-hero-pin");
      const card = document.querySelector<HTMLElement>(".courses-hero-pin .courses-hero");
      if (el && wrapper && card) {
        // The card's own height (80vh, sections.css), not window.innerHeight
        // — sticky actually releases at wrapperHeight - cardHeight, and the
        // card here is shorter than the viewport (client, 2026-09-11: "el
        // hero quedo muy alto... del mismo tamano que home"), so using the
        // full window height would release the pin too early and desync
        // this progress from where it actually unsticks.
        const dwell = wrapper.getBoundingClientRect().height - card.getBoundingClientRect().height;
        const progress = dwell > 0 ? Math.min(1, Math.max(0, -wrapper.getBoundingClientRect().top / dwell)) : 0;
        // Raw 0→1: each column (sections.css) interpolates its own
        // --from/--to across this directly, rather than both sharing one
        // pre-scaled pixel value.
        el.style.setProperty("--courses-photos-progress", String(progress));
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
