import { useEffect, useState } from "react";

/**
 * Cycles a single word of the hero headline — "esta palabra se tiene que
 * mover… usar una transition más sutil, tal vez que gire" (ref:
 * new.consciouslife.com). The word flips on its baseline rather than fading,
 * which reads as deliberate instead of decorative.
 *
 * The first word renders in the static HTML, so the headline is complete for
 * crawlers and for anyone whose JS never runs. Reduced-motion holds it there.
 */
export function RotatingWord({
  words,
  interval = 3200,
}: {
  words: string[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % words.length),
      interval,
    );
    return () => window.clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className="rotating-word">
      {/* All words are stacked in one grid cell so the line never reflows as
          they swap — the widest word sets the box. */}
      {words.map((word, i) => (
        <span
          key={word}
          className="rotating-word__item"
          data-state={i === index ? "in" : "out"}
          aria-hidden={i === index ? undefined : true}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
