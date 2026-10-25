import { useEffect, useRef } from "react";
import { useSection, SECTION } from "@/lib/sections";
import { BLOCKS } from "@/data/blocks";

/**
 * The staggered instructor-photo cluster on the Courses hero's right side,
 * replacing TeachersStrip's text marquee now that real photos exist for it
 * (client, 2026-09-09) — same "el header replica new.consciouslife.com"
 * brief TeachersStrip's own comment already cited, but as a vertical
 * scroll-parallax of photo cards instead of a horizontal auto-drifting
 * text strip.
 *
 * Two columns, the right one starting lower so they interlock and move as
 * layers. While the hero is pinned, each column travels from "top photo
 * whole" to "bottom photo whole", inside a clipped, edge-faded window the
 * height of the hero's content box — sizing and the why are in
 * sections.css (.courses-hero-photos).
 */
/* The instructors are the cards of the "courses-instructors" Page Contents
   block (client, 2026-10-21: the clinic changes them): Foto, title = name,
   subtitle = role, in the order dragged in the CMS — the first two fill the
   left column, the next two the right. The layout is two columns of two, so
   only the first four show. A card without a photo keeps the bundled photo
   of the same person (matched by name, src/data/blocks.ts), so reordering
   never puts one person's face under another's name. */
const SHOWN = 4;

/**
 * Mobile parallax travel each side of rest, px. The columns move in OPPOSITE
 * directions (left down, right up — a scissor), so they slide past each other
 * by twice their travel. Client, 2026-10-23: the first ±16/±36 same-way drift
 * was "demasiado sutil". sections.css gives the cluster 40px of room above and
 * below on mobile, so this never reaches the lead text or the hero's edge.
 */
const MOBILE_TRAVEL_LEFT = 56;
const MOBILE_TRAVEL_RIGHT = 72;

export function CoursesHeroPhotos() {
  const ref = useRef<HTMLDivElement | null>(null);
  const bundled = BLOCKS[SECTION.coursesInstructors]?.cards ?? [];
  const people = useSection(SECTION.coursesInstructors)
    .cards.slice(0, SHOWN)
    .map((card) => ({
      name: card.title,
      title: card.subtitle ?? "",
      image: card.image || bundled.find((b) => b.title === card.title)?.image || "",
    }));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const desktop = window.matchMedia("(min-width: 900px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Where the columns are drawn (0→1), easing toward where the scroll says
    // they should be — GSAP's `scrub: 0.5` feel, frame-rate independent.
    let shown = -1;
    let last = performance.now();
    let stuckOffset = -1;
    // The same easing for the mobile parallax (its own 0→1: the cluster's
    // trip across the viewport).
    let mobileShown = -1;
    let frame: number;

    function raf(now: number) {
      const wrapper = document.querySelector<HTMLElement>(".courses-hero-pin");
      const card = document.querySelector<HTMLElement>(".courses-hero-pin .courses-hero");
      const stickyHeader = document.querySelector<HTMLElement>(".site-shell__sticky-top");
      const columns = node
        ? [...node.querySelectorAll<HTMLElement>(".courses-hero-photos__col")]
        : [];
      if (node && wrapper && card) {
        // The card's sticky `top` matches what is actually stuck above it
        // (the announcement bar's height changes on scroll; client,
        // 2026-09-18: no stray jolt before the pin takes over).
        const headerOffset = stickyHeader?.getBoundingClientRect().height ?? 0;
        // Written only when it changes: a custom property on <html> every
        // frame would make the browser recalculate styles every frame.
        if (headerOffset !== stuckOffset) {
          stuckOffset = headerOffset;
          document.documentElement.style.setProperty(
            "--courses-hero-sticky-offset",
            `${headerOffset}px`,
          );
        }
        // Progress through the pin's hold: sticky releases at wrapper height
        // minus the card's own (shorter than the viewport) height, counted
        // from the instant the card locks under the header.
        const dwell = wrapper.getBoundingClientRect().height - card.getBoundingClientRect().height;
        const progress =
          dwell > 0
            ? Math.min(1, Math.max(0, (headerOffset - wrapper.getBoundingClientRect().top) / dwell))
            : 0;

        if (!desktop.matches) {
          shown = -1;
          if (reducedMotion.matches) {
            for (const column of columns) column.style.transform = "";
            mobileShown = -1;
          } else {
            // Stacked mobile hero (client, 2026-10-23: "que sí se muevan, algo
            // similar a web"): NOT pinned — holding the page on a phone would
            // hijack the scroll — but a parallax while the cluster crosses the
            // screen: the left column sinks and the right one rises, eased like
            // the desktop hold, every card staying inside the hero.
            const rect = node.getBoundingClientRect();
            const viewport = window.innerHeight;
            const target = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport + rect.height)));
            const step = 1 - Math.pow(1 - 0.16, Math.min(64, now - last) / 16.7);
            mobileShown = mobileShown < 0 ? target : mobileShown + (target - mobileShown) * step;
            if (Math.abs(target - mobileShown) < 0.0005) mobileShown = target;
            columns.forEach((column, index) => {
              const y =
                index === 1
                  ? MOBILE_TRAVEL_RIGHT * (1 - 2 * mobileShown) // +72 → −72: rises
                  : MOBILE_TRAVEL_LEFT * (2 * mobileShown - 1); // −56 → +56: sinks
              column.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
            });
          }
        } else {
          mobileShown = -1;
          // Reduced motion: no travel, the end of the hold, where every
          // photo shows its name and role.
          const target = reducedMotion.matches ? 1 : progress;
          const step = 1 - Math.pow(1 - 0.16, Math.min(64, now - last) / 16.7);
          shown = shown < 0 || reducedMotion.matches ? target : shown + (target - shown) * step;
          if (Math.abs(target - shown) < 0.0005) shown = target;

          // Travel measured live (resize-safe): each column from "top photo
          // whole under the top fade" to "bottom photo whole above the
          // bottom fade"; the right one starts lower, so they move as layers.
          const windowHeight = node.clientHeight;
          const fade = parseFloat(getComputedStyle(node).getPropertyValue("--ph-fade")) || 16;
          const cardHeight = columns[0]?.firstElementChild?.getBoundingClientRect().height ?? 0;
          const gap = parseFloat(getComputedStyle(columns[0] ?? node).rowGap) || 0;
          // Client, 2026-10-25: "intercaladas como ladrillos" — the right
          // column always sits half a photo lower, so no two photos are ever
          // level (same as consciouslife.com's experts).
          const brick = (cardHeight + gap) / 2;
          const from = fade;
          // Travel all the way (client, 2026-10-25), so every photo is seen
          // whole on the way down: the hold ends with the right column's
          // bottom photo whole above the bottom fade.
          let to = Math.min(from, windowHeight - fade - (columns[1]?.offsetHeight ?? 0) - brick);
          // Reduced motion holds still at the end, so there it stops where
          // the left column's top photo still shows its name and role (even
          // a long CMS name).
          if (reducedMotion.matches) {
            const top = columns[0]?.firstElementChild;
            const caption = top?.querySelector("figcaption")?.getBoundingClientRect().height ?? 0;
            to = Math.min(from, Math.max(to, fade + caption - cardHeight));
          }
          const y = from + (to - from) * shown;
          columns.forEach((column, index) => {
            const offset = index === 1 ? brick : 0;
            column.style.transform = `translate3d(0, ${(y + offset).toFixed(2)}px, 0)`;
          });
        }
      }
      last = now;
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="courses-hero-photos" ref={ref} aria-label="Instructors">
      <div className="courses-hero-photos__col courses-hero-photos__col--a">
        {people.slice(0, 2).map((person, index) => (
          <PhotoCard key={`a-${index}-${person.name}`} {...person} />
        ))}
      </div>
      <div className="courses-hero-photos__col courses-hero-photos__col--b">
        {people.slice(2, 4).map((person, index) => (
          <PhotoCard key={`b-${index}-${person.name}`} {...person} />
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
      {image ? <img src={image} alt="" loading="lazy" decoding="async" /> : null}
      <figcaption>
        <b>{name}</b>
        <span>{title}</span>
      </figcaption>
    </figure>
  );
}
