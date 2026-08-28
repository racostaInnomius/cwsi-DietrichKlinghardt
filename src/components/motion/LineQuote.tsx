import { useEffect, useRef, useState } from "react";

/**
 * A pull quote whose lines slide up one after another when scrolled into view
 * — "que estas quotes se animen como en líneas" (ref: beautyunscripted.com,
 * the "WE ARE AN AGENCY THAT IS REDEFINING" block). Used on the Home and on
 * The 5 Levels of Healing.
 *
 * Lines are authored, not measured: the CMS copy carries the breaks (one array
 * entry per line), so the rhythm stays the designer's decision rather than a
 * side effect of the viewport width.
 */
export function LineQuote({
  lines,
  cite,
  className = "",
}: {
  lines: string[];
  /** Attribution, e.g. "— Dr. Dietrich Klinghardt™". */
  cite?: string;
  className?: string;
}) {
  const ref = useRef<HTMLQuoteElement | null>(null);
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
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <blockquote
      ref={ref}
      className={`line-quote${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
    >
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className="line-quote__line"
          style={{ "--line-index": index } as React.CSSProperties}
        >
          <span>{line}</span>
        </span>
      ))}
      {cite ? <cite className="line-quote__cite">{cite}</cite> : null}
    </blockquote>
  );
}
