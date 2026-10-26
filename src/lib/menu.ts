import { useMemo } from "react";
import { useCollection } from "./content";
import { PRIMARY_NAV, type NavItem } from "@/components/shell/navigation";
import type { ContentDoc } from "@/data/demo";

/**
 * The header menu, read from the CMS (Site Menus) so the tenant owns its
 * wording, its order and its submenus (client, 2026-10-26: Ana).
 *
 * The bundled PRIMARY_NAV stays the fallback and is what every build starts
 * from: no row, no options, or a row whose options carry no destination keeps
 * the menu exactly as the code describes it. A menu is the one piece of the
 * site every page depends on, so a half-filled row must never be able to
 * empty it.
 */

/** A CMS option row, at either level. */
interface MenuRow {
  label?: unknown;
  sublabel?: unknown;
  mark?: unknown;
  destination?: unknown;
  externalUrl?: unknown;
  theme?: unknown;
  children?: unknown;
}

const MARKS: Record<string, NavItem["mark"]> = { tm: "™", r: "®" };

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * One CMS row → one NavItem, or null when the row cannot produce a working
 * link (no label, no destination, or "external" without an address).
 */
function toNavItem(row: MenuRow, withChildren: boolean): NavItem | null {
  const label = str(row.label);
  if (!label) return null;

  const destination = str(row.destination);
  const external = destination === "external";
  const href = external ? str(row.externalUrl) : destination;
  if (!href) return null;

  const item: NavItem = { label, href };
  const sublabel = str(row.sublabel);
  if (sublabel) item.sublabel = sublabel;
  const mark = MARKS[str(row.mark)];
  if (mark) item.mark = mark;
  if (str(row.theme) === "sophia") item.theme = "sophia";
  if (external) item.external = true;

  if (withChildren && Array.isArray(row.children)) {
    const children = row.children
      .map((child) => toNavItem(child as MenuRow, false))
      .filter((child): child is NavItem => child !== null);
    if (children.length) item.children = children;
  }

  return item;
}

/** The menu rows come back in `_order`, so the CMS order is the site's order. */
export function navFromCms(doc: ContentDoc | undefined): NavItem[] | null {
  const rows = (doc as { items?: unknown } | undefined)?.items;
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const items = rows
    .map((row) => toNavItem(row as MenuRow, true))
    .filter((item): item is NavItem => item !== null);
  return items.length ? items : null;
}

export function usePrimaryNav(): NavItem[] {
  const menus = useCollection("site-menus");
  return useMemo(() => navFromCms(menus[0]) ?? PRIMARY_NAV, [menus]);
}
