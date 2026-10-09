import { Price } from "@/lib/currency";
import { toCartItem, type StoreProduct } from "@/lib/store";
import { useCart } from "@/lib/cart";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { StarIcon, ArrowIcon } from "@/components/Icons";

/**
 * "Dr. Klinghardt's Top N Picks of the Month" — the curated shelf at the top
 * of the store, in the same boxed-gradient panel the Courses hero uses.
 *
 * The "current selection" date is read from the visitor's clock rather than
 * a CMS field: the client asked for it to just track the calendar month, no
 * admin field to keep in sync.
 *
 * Renders nothing when no product carries a `featuredRank` — an empty shelf
 * would read as a broken section, not as "nothing curated yet".
 */
export function TopPicksSection({ products }: { products: StoreProduct[] }) {
  if (!products.length) return null;

  const currentSelection = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <AnimatedGradient variant="card-warm" intensity="normal" className="top-picks">
      <div className="wrap top-picks__inner">
        <div className="top-picks__head">
          <Reveal>
            <p className="eyebrow top-picks__eyebrow">
              <StarIcon /> Klinghardt’s selection
            </p>
            <h2>
              Dr. Klinghardt’s Top {products.length} <em>Picks of the Month</em>
            </h2>
            <p className="lead">
              A personal curation from Dr. Dietrich Klinghardt™ — the resources
              and formulas he returns to most frequently in his practice.
            </p>
          </Reveal>
          <Reveal className="top-picks__badge" delay={80}>
            <p className="eyebrow">Current selection</p>
            <p className="top-picks__badge-date">{currentSelection}</p>
          </Reveal>
        </div>

        <ul className="top-picks__grid">
          {products.map((product, index) => (
            <TopPickCard key={product.id} product={product} rank={index + 1} delay={index * 60} />
          ))}
        </ul>
      </div>
    </AnimatedGradient>
  );
}

function TopPickCard({
  product,
  rank,
  delay,
}: {
  product: StoreProduct;
  rank: number;
  delay: number;
}) {
  const { add } = useCart();

  return (
    <Reveal as="li" className="top-pick-card" delay={delay} shift={14}>
      <div className="top-pick-card__media">
        <span className="top-pick-card__number">{rank}</span>
        {product.image ? <img src={product.image} alt="" loading="lazy" /> : null}
      </div>
      <div className="top-pick-card__body">
        {product.categoryLabel ? (
          <p className="top-pick-card__category">{product.categoryLabel}</p>
        ) : null}
        <h3>
          <Marked text={product.title} />
        </h3>
        <div className="top-pick-card__footer">
          {product.price != null ? (
            <span className="top-pick-card__price"><Price cents={product.price} currency={product.currency} /></span>
          ) : null}
          <button
            type="button"
            className="top-pick-card__arrow"
            onClick={() => add(toCartItem(product))}
            aria-label={`Add ${product.title} to cart`}
          >
            <ArrowIcon />
          </button>
        </div>
      </div>
    </Reveal>
  );
}
