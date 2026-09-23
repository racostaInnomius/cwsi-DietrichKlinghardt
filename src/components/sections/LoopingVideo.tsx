import { useEffect, useRef } from "react";

/**
 * A short, silent animation that plays itself — the pyramid on
 * /academy/five-levels, standing in for what used to be a static image.
 * Unlike `SelfHostedVideo` (a long film, `preload="none"`, click to play),
 * this is a handful of seconds and a few MB: nothing to gate behind a poster
 * and a play button. It starts the moment it scrolls into view and pauses
 * when it scrolls back out, rather than autoplaying the instant the page
 * mounts somewhere off-screen.
 *
 * Muted and looped because that's what browsers require to autoplay at all;
 * there is no audio track to lose. `prefers-reduced-motion` skips the
 * autoplay entirely and leaves the poster frame in place, same as `Reveal`.
 */
export function LoopingVideo({
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
          } else {
            node.pause();
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
      loop
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
