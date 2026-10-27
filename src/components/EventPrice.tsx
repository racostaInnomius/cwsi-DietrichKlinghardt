import type { ReactNode } from "react";
import { number, text } from "@/lib/content";
import { Price } from "@/lib/currency";
import type { ContentDoc } from "@/data/demo";

/**
 * What an event costs, from whichever of the two the CMS filled in:
 *
 *   • the Stripe price, when the tenant sells the event here;
 *   • the announced price, for an event sold on another site — a single
 *     amount or a range (client, 2026-10-26: "permitir capturar un rango de
 *     precios en eventos ... cuando Ana no los vende").
 *
 * The Stripe price wins where both exist: that is the one actually charged.
 */

export interface EventPriceInfo {
  from: number;
  /** Present only for an announced range. */
  to?: number;
  currency: string;
  /** True when it only announces a price the tenant does not charge here. */
  announced: boolean;
}

function positive(doc: ContentDoc | undefined, key: string): number | null {
  if (doc?.[key] == null) return null;
  const value = number(doc, key, Number.NaN);
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function eventPriceInfo(event: ContentDoc | undefined): EventPriceInfo | null {
  const paid = positive(event, "price");
  if (paid != null) {
    return { from: paid, currency: text(event, "currency", "usd"), announced: false };
  }

  const from = positive(event, "announcedPriceFrom");
  if (from == null) return null;
  const to = positive(event, "announcedPriceTo");
  return {
    from,
    // A "to" at or below "from" is not a range, it is a typo: show one price.
    to: to != null && to > from ? to : undefined,
    currency: text(event, "announcedPriceCurrency", "eur"),
    announced: true,
  };
}

export function EventPrice({ event }: { event: ContentDoc | undefined }): ReactNode {
  const info = eventPriceInfo(event);
  if (!info) return null;
  if (info.to == null) return <Price cents={info.from} currency={info.currency} />;
  return (
    <>
      <Price cents={info.from} currency={info.currency} />
      {" – "}
      <Price cents={info.to} currency={info.currency} />
    </>
  );
}
