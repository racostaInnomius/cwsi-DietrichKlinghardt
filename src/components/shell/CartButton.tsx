import { Link } from "react-router-dom";
import { useCart } from "@/lib/cart";

/**
 * Cart entry point in the nav — the designer asked for it explicitly: "por
 * favor agregar un shopping cart al nav bar, porque tenemos shop y también los
 * cursos". It ships in F1 wired to the cart store so the header is final; the
 * checkout it leads to arrives in F6 (store + cart phase).
 */
export function CartButton() {
  const { count } = useCart();

  return (
    <Link
      className="cart-button"
      to="/cart"
      aria-label={count > 0 ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart, empty"}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M3 4h2.2l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L21 7H6.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="20" r="1.4" fill="currentColor" />
        <circle cx="17" cy="20" r="1.4" fill="currentColor" />
      </svg>
      {count > 0 ? <span className="cart-button__count">{count}</span> : null}
    </Link>
  );
}
