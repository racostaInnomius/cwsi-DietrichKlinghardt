import { useEffect, useRef, useState, type ElementType } from "react";

/**
 * Reveals text one letter at a time, each rising into place with a slight
 * 3D tilt — the character-by-character "SplitText" treatment on
 * beautyunscripted.com's own opening statement (inspected directly:
 * `perspective: 400px` on the heading, each letter its own
 * `translate3d(...) rotateX(10deg)` tween). That page drives it with GSAP;
 * this is the same visual read built from the same IntersectionObserver +
 * CSS approach `Reveal` already uses, so it costs no new dependency.
 *
 * Tune `staggerMs` down as text length grows — the default (22ms) suits a
 * short headline; run it across a full paragraph unchanged and the last
 * letter starts seconds after the first (2026-09-04: "quiero que animes
 * todo el párrafo").
 *
 * `charOffset` lets two adjacent instances read as one continuous cascade —
 * e.g. a heading-role title followed by a plain-text span for the copy
 * after it, each its own element (so only the title carries `role="heading"`)
 * but sharing one letter count so the second doesn't restart the stagger
 * from zero.
 *
 * SSG-safe: the real text still exists as regular characters in the
 * static HTML (screen readers get the plain string via `aria-label`,
 * never the exploded spans), so nothing depends on JS running.
 */
export function SplitReveal({
  text,
  as: Tag = "span",
  className = "",
  staggerMs = 22,
  charOffset = 0,
  triggerOn = "scroll",
  ...rest
}: {
  text: string;
  as?: ElementType;
  className?: string;
  /** Delay between each letter's start, in ms. */
  staggerMs?: number;
  /** Starting index for the stagger delay — see charOffset above. */
  charOffset?: number;
  /**
   * "scroll" (default): waits for the element to scroll into view, via
   * IntersectionObserver. "load": plays as soon as the page has mounted,
   * for text that sits high enough up that it should already be part of
   * arriving on the page rather than something scroll uncovers (client,
   * 2026-09-15, Home's Academy teaser: "que ejecute la animación una vez
   * que se lee todo el DOM").
   */
  triggerOn?: "scroll" | "load";
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (
      triggerOn === "load" ||
      typeof window === "undefined" ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // A frame late rather than synchronous with mount, so the CSS
      // transition (opacity/transform on .split-reveal__char) actually has
      // a "before" state to animate away from instead of painting straight
      // into "is-visible".
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [triggerOn]);

  const words = text.split(" ");
  let charIndex = charOffset;

  return (
    <Tag
      ref={ref}
      className={`split-reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      aria-label={text}
      {...rest}
    >
      {words.map((word, wi) => (
        <span className="split-reveal__word" key={wi} aria-hidden="true">
          {word.split("").map((char, ci) => {
            const i = charIndex;
            charIndex += 1;
            return (
              <span
                key={ci}
                className="split-reveal__char"
                style={{ transitionDelay: `${i * staggerMs}ms` }}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
