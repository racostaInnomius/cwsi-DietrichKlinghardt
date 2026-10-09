import { useMemo } from "react";
import { useCollection, text, number } from "./content";
import { mediaUrl, richTextBlocks } from "./cms";
import { checkoutHref } from "./checkout";
import { env } from "./env";
import type { ContentDoc } from "@/data/demo";
import type { CartItem } from "./cart";

/**
 * The store catalogue, read from `digital-products`.
 *
 * Note what is NOT here: the Stripe price id. That field is gated to
 * authenticated readers in the CMS, so the storefront never sees it — the cart
 * carries document ids and the API resolves prices server-side. That is the
 * same boundary that stops a crafted cart from naming its own price.
 */

export const CATEGORIES = [
  { key: "books", label: "Books" },
  { key: "cds", label: "CDs & audio" },
  { key: "dvds", label: "DVDs & video" },
  { key: "tests", label: "Tests & kits" },
  { key: "color-glasses", label: "Color glasses" },
  { key: "materials", label: "Work materials" },
  { key: "downloads", label: "Courses & downloads" },
] as const;

const CATEGORY_LABELS = new Map(CATEGORIES.map((c) => [c.key, c.label]));

export interface StoreProduct {
  id: string;
  title: string;
  subtitle?: string;
  slug?: string;
  description?: string;
  image?: string;
  /** Minor units, as the CMS stores it. */
  price?: number;
  currency: string;
  categoryKey?: string;
  categoryLabel?: string;
  featuredRank?: number;
  isPhysical: boolean;
  /**
   * A single-product Stripe link, when the product has one. Until cart
   * checkout opens this is the only way to actually buy something.
   */
  buyHref?: string;
}

function normalise(doc: ContentDoc): StoreProduct {
  const categoryKey = text(doc, "category") || undefined;
  const price = number(doc, "price", -1);
  const rank = number(doc, "featuredRank", -1);

  return {
    id: String(doc.id ?? ""),
    title: text(doc, "title", "Untitled"),
    subtitle: text(doc, "subtitle") || undefined,
    slug: text(doc, "slug") || undefined,
    description: richTextBlocks(doc.description)[0],
    image: mediaUrl(doc.hero),
    price: price >= 0 ? price : undefined,
    currency: text(doc, "currency", "usd"),
    categoryKey,
    categoryLabel: categoryKey ? (CATEGORY_LABELS.get(categoryKey) ?? categoryKey) : undefined,
    featuredRank: rank >= 0 ? rank : undefined,
    isPhysical: doc.isPhysical === true,
    buyHref: checkoutHref(doc.checkoutUrl),
  };
}

export function useStoreProducts(): StoreProduct[] {
  const rows = useCollection("digital-products");
  return useMemo(
    () =>
      rows
        .filter((row) => row.status === "published")
        .map(normalise)
        .filter((product) => product.id && product.title),
    [rows],
  );
}

/** "Klinghardt's picks": the ranked products, lowest rank first. */
export function featuredProducts(products: StoreProduct[], limit = 5): StoreProduct[] {
  return products
    .filter((product) => product.featuredRank != null)
    .sort((a, b) => (a.featuredRank ?? 0) - (b.featuredRank ?? 0))
    .slice(0, limit);
}

/** Only the categories that actually have something in them. */
export function usedCategories(products: StoreProduct[]) {
  return CATEGORIES.filter((category) =>
    products.some((product) => product.categoryKey === category.key),
  );
}

export function toCartItem(product: StoreProduct): Omit<CartItem, "quantity"> {
  return {
    sourceId: product.id,
    kind: "product",
    title: product.title,
    unitAmount: product.price ?? 0,
    currency: product.currency,
    image: product.image,
    isPhysical: product.isPhysical,
  };
}

export interface CheckoutResult {
  url: string;
}

/**
 * Hands the basket to the API, which prices it and creates the Stripe session.
 * Only document ids and quantities travel — see the note at the top.
 */
/**
 * `currency`: the visitor's display currency — the API then charges the cart
 * in it (converting each Stripe price server-side). Omitted = USD as set up.
 */
export async function startCheckout(
  items: CartItem[],
  currency?: string | null,
): Promise<CheckoutResult> {
  const response = await fetch(`${env.API_URL}/api/public/checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tenantId: env.TENANT_ID,
      siteId: env.SITE_ID,
      items: items.map((item) => ({
        productId: item.sourceId,
        quantity: item.quantity,
      })),
      ...(currency ? { currency } : {}),
    }),
  });

  const body = (await response.json().catch(() => null)) as {
    data?: { url?: string };
    error?: string;
  } | null;

  if (!response.ok || !body?.data?.url) {
    throw new Error(body?.error || "Checkout is not available right now.");
  }
  return { url: body.data.url };
}
