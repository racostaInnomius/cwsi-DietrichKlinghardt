import type { ReactNode } from "react";
import { Marked } from "@/components/Marked";
import { useButtonLabel } from "@/lib/buttons";

/**
 * The text of a button, from the CMS (Site Buttons) with the bundled label as
 * its fallback — see src/lib/buttons.ts.
 *
 * A component rather than a hook call per page so a button's wording is read
 * where it is written, next to its own markup, and ™/® are set the same way
 * here as in every heading of the site.
 */
export function ButtonText({ id }: { id: string }): ReactNode {
  return <Marked text={useButtonLabel(id)} />;
}
