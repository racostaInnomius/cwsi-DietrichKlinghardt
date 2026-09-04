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
  ...rest
}: {
  text: string;
  as?: ElementType;
  className?: string;
  /** Delay between each letter's start, in ms. */
  staggerMs?: number;
  /** Starting index for the stagger delay — see charOffset above. */
  charOffset?: number;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (
      typeof window === "undefined" ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
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
  }, []);

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
