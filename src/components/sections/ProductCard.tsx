import { Link } from "react-router-dom";
import { toCartItem, type StoreProduct } from "@/lib/store";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/format";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { ArrowIcon } from "@/components/Icons";

/**
 * One product, as the store and the home page's shop strip both draw it.
 *
 * It lived inside StorePage until the home page needed the same card; copying
 * it would have meant the "add to cart" behaviour drifting between the two
 * places that offer it.
 */
export function ProductCard({
  product,
  delay,
  featured,
}: {
  product: StoreProduct;
  delay: number;
  featured?: boolean;
}) {
  const { add, items } = useCart();
  const inCart = items.some((item) => item.sourceId === product.id);

  return (
    <Reveal
      as="li"
      className={`product${featured ? " product--featured" : ""}`}
      delay={delay}
      shift={14}
    >
      <div className="product__media">
        {product.image ? <img src={product.image} alt="" loading="lazy" /> : null}
        {featured ? <span className="product__pick">Klinghardt&rsquo;s Pick</span> : null}
        {product.isPhysical ? <span className="product__tag">Ships to you</span> : null}
      </div>

      <div className="product__body">
        {product.categoryLabel ? (
          <p className="product__category">{product.categoryLabel}</p>
        ) : null}
        <h3>
          <Marked text={product.title} />
        </h3>
        {product.subtitle ? <p className="product__subtitle">{product.subtitle}</p> : null}

        <div className="product__buy">
          {product.price != null ? (
            <span className="product__price">{money(product.price, product.currency)}</span>
          ) : null}
          <button
            type="button"
            className="product__add"
            onClick={() => add(toCartItem(product))}
            aria-label={inCart ? `Add another ${product.title}` : `Add ${product.title} to cart`}
          >
            <ArrowIcon />
          </button>
        </div>
        {inCart ? (
          <Link className="product__incart" to="/cart">
            In your cart →
          </Link>
        ) : null}
      </div>
    </Reveal>
  );
}
