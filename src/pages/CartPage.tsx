import { useState } from "react";
import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useCart } from "@/lib/cart";
import { startCheckout, useStoreProducts } from "@/lib/store";
import { money } from "@/lib/format";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";

/**
 * The cart.
 *
 * Totals shown here are the stored unit amounts, which is fine for a summary —
 * but the charge is priced by the API from the CMS rows, so a stale or tampered
 * line cannot change what is actually billed. If the two ever disagree, Stripe
 * charges the server's number.
 */
export function CartPage() {
  const { items, count, subtotal, setQuantity, remove, clear } = useCart();
  const products = useStoreProducts();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsShipping = items.some((item) => item.isPhysical);
  const currency = items[0]?.currency ?? "usd";

  async function checkout() {
    if (!items.length || busy) return;
    setBusy(true);
    setError(null);
    try {
      const { url } = await startCheckout(items);
      window.location.assign(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Checkout is not available right now.",
      );
      setBusy(false);
    }
  }

  return (
    <>
      <Seo
        title={"Your Cart — Dr. Dietrich Klinghardt™"}
        noindex
      />

      <AnimatedGradient variant="page" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <p className="eyebrow">Checkout</p>
            <h1>Your Cart</h1>
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap two-col">
        <div>
          {items.length ? (
            <ul className="cart-list">
              {items.map((item) => {
                // Re-read the catalogue so a line stored days ago still shows
                // the current title and image.
                const live = products.find((product) => product.id === item.sourceId);
                return (
                  <li key={item.sourceId} className="cart-line">
                    <div className="cart-line__media">
                      {(live?.image ?? item.image) ? (
                        <img src={live?.image ?? item.image} alt="" loading="lazy" />
                      ) : null}
                    </div>

                    <div className="cart-line__body">
                      <h2>
                        <Marked text={live?.title ?? item.title} />
                      </h2>
                      {item.isPhysical ? (
                        <p className="cart-line__note">Ships to you</p>
                      ) : null}
                      <button
                        type="button"
                        className="cart-line__remove"
                        onClick={() => remove(item.sourceId)}
                      >
                        Remove
                      </button>
                    </div>

                    <label className="cart-line__qty">
                      <span className="sr-only">Quantity of {item.title}</span>
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={item.quantity}
                        onChange={(event) =>
                          setQuantity(item.sourceId, Number(event.target.value) || 0)
                        }
                      />
                    </label>

                    <span className="cart-line__price">
                      {money((live?.price ?? item.unitAmount) * item.quantity, item.currency)}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="empty-note">
              Your cart is empty. <Link to="/store">Browse the store</Link>.
            </p>
          )}
        </div>

        <Reveal as="aside" className="donate-panel" delay={100}>
          <p className="eyebrow">Summary</p>
          <h2>
            {count} {count === 1 ? "item" : "items"}
          </h2>
          <dl className="cart-summary">
            <div>
              <dt>Subtotal</dt>
              <dd>{money(subtotal, currency)}</dd>
            </div>
            {needsShipping ? (
              <div>
                <dt>Shipping</dt>
                <dd>Calculated at checkout</dd>
              </div>
            ) : null}
          </dl>

          {error ? <p className="donate-error">{error}</p> : null}

          <button
            className="btn btn-primary donate-panel__cta"
            onClick={checkout}
            disabled={!items.length || busy}
          >
            {busy ? "Opening checkout…" : "Checkout"}
          </button>

          {items.length ? (
            <button type="button" className="cart-clear" onClick={clear}>
              Empty cart
            </button>
          ) : null}

          <p className="donate-panel__note cart-panel__legal">
            Payment is handled by Stripe. Prices are confirmed by the server at
            checkout.
          </p>
        </Reveal>
      </section>
    </>
  );
}
