import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Cart state. The designer asked for a cart in the nav that covers both the
 * shop and the courses, so the line item is deliberately generic: anything
 * sellable carries a `sourceId` plus display fields.
 *
 * The line is keyed by `sourceId` — the CMS document id — NOT by a Stripe price
 * id. `digital-products.stripePriceId` is gated to authenticated readers, so a
 * public page cannot know it; checkout posts document ids and the API resolves
 * the price server-side, which is also what stops a crafted cart from setting
 * its own price.
 *
 * SSG note: every storage access is guarded — this module is imported during
 * the static render, where `window` does not exist.
 */

export interface CartItem {
  /** CMS document id — the line's identity, and what checkout posts. */
  sourceId: string;
  kind: "product" | "course" | "event";
  title: string;
  /** Minor units, for display only; the server prices the order. */
  unitAmount: number;
  currency: string;
  image?: string;
  /** Physical goods collect a shipping address at checkout (plan D9). */
  isPhysical?: boolean;
  quantity: number;
}

interface CartValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (sourceId: string) => void;
  setQuantity: (sourceId: string, quantity: number) => void;
  clear: () => void;
}

// Bumped when the line shape changed (priceId → sourceId): an old stored
// cart would deserialise into lines checkout cannot resolve.
const STORAGE_KEY = "dk_cart_v2";

const CartContext = createContext<CartValue | null>(null);

function readStored(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Shape-check every entry: a stale or hand-edited payload must not reach
    // checkout as a half-formed line item.
    return parsed.filter(
      (item): item is CartItem =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as CartItem).sourceId === "string" &&
        typeof (item as CartItem).title === "string" &&
        Number.isFinite((item as CartItem).quantity),
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Hydrate after mount, never during the static render, so the server markup
  // and the first client paint agree.
  useEffect(() => {
    setItems(readStored());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Private mode / quota — the cart still works for this session.
    }
  }, [items]);

  const add = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((row) => row.sourceId === item.sourceId);
      if (existing) {
        return current.map((row) =>
          row.sourceId === item.sourceId
            ? { ...row, quantity: row.quantity + quantity }
            : row,
        );
      }
      return [...current, { ...item, quantity }];
    });
  }, []);

  const remove = useCallback((sourceId: string) => {
    setItems((current) => current.filter((row) => row.sourceId !== sourceId));
  }, []);

  const setQuantity = useCallback((sourceId: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((row) => row.sourceId !== sourceId)
        : current.map((row) => (row.sourceId === sourceId ? { ...row, quantity } : row)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartValue>(
    () => ({
      items,
      count: items.reduce((total, row) => total + row.quantity, 0),
      subtotal: items.reduce((total, row) => total + row.unitAmount * row.quantity, 0),
      add,
      remove,
      setQuantity,
      clear,
    }),
    [items, add, remove, setQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return value;
}
