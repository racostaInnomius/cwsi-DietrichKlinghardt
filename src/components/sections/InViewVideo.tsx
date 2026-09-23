import { useEffect, useRef } from "react";

/**
 * A short, silent animation that plays itself — the pyramid on
 * /academy/five-levels, standing in for what used to be a static image.
 * Unlike `SelfHostedVideo` (a long film, `preload="none"`, click to play),
 * this is a handful of seconds and a few MB: nothing to gate behind a poster
 * and a play button. It plays once, the moment it first scrolls into view
 * (client, 2026-09-22: "solo que se ejecute una sola vez cuando aparezca a
 * la vista" — no loop), then leaves its last frame on screen.
 *
 * Muted because that's what browsers require to autoplay at all; there is no
 * audio track to lose. `prefers-reduced-motion` skips the autoplay entirely
 * and leaves the poster frame in place, same as `Reveal`.
 */
export function InViewVideo({
  src,
  poster,
  title,
  className = "",
  width,
  height,
}: {
  src: string;
  poster: string;
  /** Accessible name — there's no visible caption, so this is the only
   *  description assistive tech gets. Carry over the old <img>'s alt text. */
  title: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) {
      node.play().catch(() => {});
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.play().catch(() => {});
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
    <video
      ref={ref}
      className={className}
      muted
      playsInline
      preload="auto"
      poster={poster}
      aria-label={title}
      width={width}
      height={height}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
