import { useMemo, useState } from "react";
import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import {
  featuredProducts,
  toCartItem,
  usedCategories,
  useStoreProducts,
  type StoreProduct,
} from "@/lib/store";
import { useCart } from "@/lib/cart";
import { useSection } from "@/lib/sections";
import { money } from "@/lib/format";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/**
 * The Klinghardt store: the month's picks, then the catalogue filtered by
 * category. Adding to the cart is local; paying is the cart's job.
 */
export function StorePage() {
  const page = useSection("store", {
    title: "Explore the Klinghardt Store",
    paragraphs: [
      "Books, work materials, testing kits and professional resources, curated by Dr. Klinghardt.",
    ],
  });

  const products = useStoreProducts();
  const featured = useMemo(() => featuredProducts(products), [products]);
  const categories = useMemo(() => usedCategories(products), [products]);
  const [category, setCategory] = useState("");

  const visible = category
    ? products.filter((product) => product.categoryKey === category)
    : products;

  return (
    <>
      <Seo
        title={"Store — Dr. Dietrich Klinghardt™"}
        description="Books, work materials, testing kits and professional resources from Dr. Dietrich Klinghardt."
        path="/store"
      />

      {/* The designer marks Shop as one of the two places the gradient should
          move most. */}
      <AnimatedGradient variant="page" intensity="strong" className="page-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <p className="eyebrow">Shop</p>
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      {featured.length ? (
        <section className="section wrap">
          <Reveal>
            <p className="eyebrow">Klinghardt’s picks</p>
            <h2 className="section-title">Top picks of the month</h2>
          </Reveal>
          <ul className="product-grid product-grid--featured">
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} delay={index * 60} featured />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="section wrap">
        {categories.length ? (
          <div className="tabs store-filters" role="tablist" aria-label="Product categories">
            <button
              type="button"
              role="tab"
              className="tab"
              aria-selected={category === ""}
              onClick={() => setCategory("")}
            >
              All <span>{products.length}</span>
            </button>
            {categories.map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                className="tab"
                aria-selected={category === item.key}
                onClick={() => setCategory(item.key)}
              >
                {item.label}{" "}
                <span>
                  {products.filter((product) => product.categoryKey === item.key).length}
                </span>
              </button>
            ))}
          </div>
        ) : null}

        {visible.length ? (
          <ul className="product-grid">
            {visible.map((product, index) => (
              <ProductCard key={product.id} product={product} delay={(index % 8) * 50} />
            ))}
          </ul>
        ) : (
          <p className="empty-note">
            {products.length
              ? "Nothing in this category yet."
              : "The store is being stocked. Join the newsletter below and you’ll hear when it opens."}
          </p>
        )}
      </section>

      <NewsletterSection />
    </>
  );
}

function ProductCard({
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
        {product.isPhysical ? <span className="product__tag">Ships to you</span> : null}
      </div>

      <div className="product__body">
        {product.categoryLabel ? (
          <p className="eyebrow">{product.categoryLabel}</p>
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
            className="btn btn-outline product__add"
            onClick={() => add(toCartItem(product))}
          >
            {inCart ? "Add another" : "Add to cart"}
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
