import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Reveals its children once they scroll into view — the "que las secciones
 * entren sutilmente" note (ref: beautyunscripted.com).
 *
 * SSG-safe: the markup ships with the `.reveal` class, so a crawler (and a
 * browser that never runs the observer) still sees real content in the HTML;
 * only the visual entrance depends on JS. Under `prefers-reduced-motion` the
 * CSS neutralises the transform, and we skip observing entirely.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  shift,
  className = "",
  once = true,
  style,
}: {
  children: ReactNode;
  /** Element to render — use `section`/`li` to keep semantics intact. */
  as?: ElementType;
  /** Stagger, in ms, for sequences of cards. */
  delay?: number;
  /** Travel distance; smaller for dense grids. */
  shift?: number;
  className?: string;
  once?: boolean;
  /** Merged with the reveal's own custom properties, never replacing them. */
  style?: React.CSSProperties;
}) {
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
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      // Fire a little before the element is fully on screen so the motion
      // finishes as the reader arrives at it.
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={
        {
          ...style,
          ...(delay ? { "--reveal-delay": `${delay}ms` } : {}),
          ...(shift != null ? { "--reveal-shift": `${shift}px` } : {}),
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
