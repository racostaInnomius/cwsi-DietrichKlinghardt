import { useMemo } from "react";
import { useCollection } from "./content";
import { BUTTONS } from "@/data/buttons";
import type { ContentDoc } from "@/data/demo";

/**
 * Button wording, read from the CMS (Site Buttons) so the tenant owns the
 * calls to action without a code change (client, 2026-10-26).
 *
 * One CMS document per button, each carrying the button's key and its text.
 * The bundled BUTTONS registry stays the fallback: no document, no key, or an
 * empty text keeps the button exactly as the code describes it. A button with
 * no text is a dead end for the visitor, so an unfinished document must never
 * be able to blank one.
 *
 * Two documents for the same key: the first one wins, so a duplicate the
 * editor added by accident cannot make the label flicker between builds.
 */

function labelsFromCms(rows: ContentDoc[]): Record<string, string> {
  const labels: Record<string, string> = {};
  for (const row of rows) {
    const key = typeof row?.key === "string" ? row.key.trim() : "";
    const label = typeof row?.label === "string" ? row.label.trim() : "";
    if (key && label && !(key in labels)) labels[key] = label;
  }
  return labels;
}

export function useButtonLabels(): Record<string, string> {
  const rows = useCollection("site-buttons");
  return useMemo(() => labelsFromCms(rows), [rows]);
}

/** The text of one button, from the CMS when it has one. */
export function useButtonLabel(key: string): string {
  const labels = useButtonLabels();
  return labels[key] || BUTTONS[key]?.label || "";
}
