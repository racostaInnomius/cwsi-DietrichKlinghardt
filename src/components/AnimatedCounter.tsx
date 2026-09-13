import { useEffect, useRef, useState } from "react";

/** Starts fast, settles gently — the client's own reference demo uses this
 * exact curve for the count-up. */
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function formatValue(value: number, format?: "k", suffix = ""): string {
  if (format === "k") {
    // 10000 -> "10K". One decimal while still rising (e.g. "6.4K"), a
    // clean integer once it reaches five figures — same rule the
    // reference demo uses.
    const thousands = value / 1000;
    const shown = value >= 10000 ? Math.round(thousands) : Math.round(thousands * 10) / 10;
    return `${shown}K`;
  }
  return `${Math.round(value)}${suffix}`;
}

/**
 * A number that counts up from 0 once it scrolls into view, instead of
 * appearing already at its final value.
 *
 * Client (2026-09-12), via the designer: "para los numeros... podemos hacer
 * un conteo y un fade-slide" — the fade-slide is the same <Reveal> the stat
 * tiles already use; this is just the count-up layered on top of it. Its
 * own IntersectionObserver (not Reveal's) because it needs to drive a
 * requestAnimationFrame loop, not a CSS class toggle — same threshold and
 * "fire once" behaviour as the client's reference demo, adapted to this
 * component library instead of the demo's raw DOM script.
 */
export function AnimatedCounter({
  to,
  suffix = "",
  format,
  duration = 1800,
}: {
  to: number;
  suffix?: string;
  format?: "k";
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(() => formatValue(0, format, suffix));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof window === "undefined" ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplay(formatValue(to, format, suffix));
      return;
    }

    let frame: number;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / duration);
            setDisplay(formatValue(easeOutExpo(progress) * to, format, suffix));
            if (progress < 1) frame = requestAnimationFrame(tick);
          };
          frame = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, suffix, format, duration]);

  return <span ref={ref}>{display}</span>;
}
