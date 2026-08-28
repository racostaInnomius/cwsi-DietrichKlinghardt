import type { ElementType, ReactNode } from "react";

/**
 * Section wrapper with the brand gradient drifting behind the content —
 * "aquí está la referencia para cómo queremos que se mueva el background de
 * tonos entre secciones" (ref: newgenre.studio). The note asks for it to be
 * noticeable in the hero (down to the "Learn more" button) and strongest on
 * Shop and Newsletter, so intensity is a prop rather than a global setting.
 *
 * The gradient itself comes from the active theme (`--grad-hero` /
 * `--grad-section` / `--grad-warm`), which is why a Sophia section drifts teal
 * and a DK section drifts navy→gold without either knowing about the other.
 */
export function AnimatedGradient({
  children,
  as: Tag = "section",
  variant = "hero",
  intensity = "normal",
  className = "",
  id,
}: {
  children: ReactNode;
  as?: ElementType;
  /** Which themed gradient to drift. `page` is the light internal-page band. */
  variant?: "hero" | "section" | "warm" | "page";
  /** `strong` for hero/shop/newsletter, `soft` where it should stay quiet. */
  intensity?: "soft" | "normal" | "strong";
  className?: string;
  id?: string;
}) {
  const gradient =
    variant === "section"
      ? "var(--grad-section)"
      : variant === "warm"
        ? "var(--grad-warm)"
        : variant === "page"
          ? "var(--grad-page)"
          : "var(--grad-hero)";

  return (
    <Tag
      id={id}
      className={`animated-gradient${className ? ` ${className}` : ""}`}
      data-intensity={intensity}
      style={{ "--gradient-image": gradient } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
