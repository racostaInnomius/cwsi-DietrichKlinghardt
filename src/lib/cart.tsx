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
 * sellable carries a `priceId` (Stripe) plus display fields.
 *
 * F1 ships the store, the badge and persistence; F6 turns `items` into a Stripe
 * Checkout Session server-side (see the implementation plan, D6). Keeping the
 * shape stable now means the buy buttons written in F2/F3 don't need revisiting.
 *
 * SSG note: every storage access is guarded — this module is imported during
 * the static render, where `window` does not exist.
 */

export interface CartItem {
  /** Stripe Price id — the only field checkout truly needs. */
  priceId: string;
  /** CMS document id, so the server can re-validate the item. */
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
  remove: (priceId: string) => void;
  setQuantity: (priceId: string, quantity: number) => void;
  clear: () => void;
}

const STORAGE_KEY = "dk_cart_v1";

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
        typeof (item as CartItem).priceId === "string" &&
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
      const existing = current.find((row) => row.priceId === item.priceId);
      if (existing) {
        return current.map((row) =>
          row.priceId === item.priceId
            ? { ...row, quantity: row.quantity + quantity }
            : row,
        );
      }
      return [...current, { ...item, quantity }];
    });
  }, []);

  const remove = useCallback((priceId: string) => {
    setItems((current) => current.filter((row) => row.priceId !== priceId));
  }, []);

  const setQuantity = useCallback((priceId: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((row) => row.priceId !== priceId)
        : current.map((row) => (row.priceId === priceId ? { ...row, quantity } : row)),
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
