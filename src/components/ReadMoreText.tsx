import { useEffect, useRef, useState } from "react";

/**
 * A paragraph shown on two lines, with "Read more" (and a down arrow) when the
 * text runs longer; the click shows the rest. The button only appears when
 * the copy really overflows the two lines — measured live, so a short CMS
 * text, a wider window or a font swap never leaves a button that reveals
 * nothing. Client, 2026-10-26 (/weekly-talks hero lead).
 */
export function ReadMoreText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || expanded) return;
    const measure = () => setOverflows(node.scrollHeight > node.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [expanded, text]);

  return (
    <>
      <p ref={ref} className={`${className ?? ""}${expanded ? "" : " read-more--clamped"}`}>
        {text}
      </p>
      {overflows && !expanded ? (
        <button
          type="button"
          className="read-more__toggle"
          aria-expanded={false}
          onClick={() => setExpanded(true)}
        >
          Read more
          <svg viewBox="0 0 12 8" width="12" height="8" aria-hidden="true">
            <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
      ) : null}
    </>
  );
}
