import type { ElementType, ReactNode } from "react";

/**
 * A section that may carry its own gradient — but usually does not.
 *
 * This component used to paint a gradient behind *every* section it wrapped.
 * That was a misreading of the design: the file paints ONE gradient per page
 * (`Rectangle 296`, identical across 13 frames) and leaves the sections
 * transparent on top of it. Replaying the full navy→amber range inside each
 * block put white type over colours meant to sit under dark type — 3.13:1 on
 * the teal, 1.65:1 on the amber. See docs/AUDIT_FIGMA.md §1.
 *
 * So the page gradient now lives on `<main>` (shell.css) and drifts there, and
 * this component paints a background only for `card` — the two places the
 * design really does inset a gradient box: the home hero panel and the "Join My
 * Weekly Talks" band. Both are rounded, both have margins, and both carry dark
 * type.
 *
 * The other variants are kept so call sites keep reading naturally; they render
 * a plain transparent section and let the page gradient show through.
 */
export function AnimatedGradient({
  children,
  as: Tag = "section",
  variant = "plain",
  intensity = "normal",
  className = "",
  id,
}: {
  children: ReactNode;
  as?: ElementType;
  /**
   * `card` insets a gradient panel (hero, weekly-talks band); `card-warm` is
   * its warmer twin. Everything else is transparent — the page gradient behind
   * it is the background.
   */
  variant?: "card" | "card-warm" | "plain" | "hero" | "section" | "warm" | "page";
  /** Kept for the card variants: how strongly the panel's own gradient drifts. */
  intensity?: "soft" | "normal" | "strong";
  className?: string;
  id?: string;
}) {
  const gradient =
    variant === "card"
      ? "var(--grad-card)"
      : variant === "card-warm"
        ? "var(--grad-card-warm)"
        : undefined;

  return (
    <Tag
      id={id}
      className={`${gradient ? "gradient-card" : "plain-section"}${
        className ? ` ${className}` : ""
      }`}
      data-intensity={gradient ? intensity : undefined}
      style={
        gradient ? ({ "--gradient-image": gradient } as React.CSSProperties) : undefined
      }
    >
      {children}
    </Tag>
  );
}
