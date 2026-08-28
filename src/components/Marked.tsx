import { Fragment, type ReactNode } from "react";

/**
 * Renders ™ and ® small and raised wherever they appear in a string.
 *
 * The brand carries trademark marks in most of its names, and set at full size
 * inside an 86px display heading they read as a typo. Titles arrive as plain
 * strings — from the CMS or from fallback copy — so the mark cannot be marked
 * up at the source; it is found here instead.
 */
export function Marked({ text }: { text: string }): ReactNode {
  const parts = text.split(/([™®])/);
  if (parts.length === 1) return text;

  return parts.map((part, index) =>
    part === "™" || part === "®" ? (
      <sup key={index} className="tm">
        {part}
      </sup>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}
