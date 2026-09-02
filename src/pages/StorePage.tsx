import { useMemo, useState } from "react";
import { Seo } from "@/components/Seo";
import {
  featuredProducts,
  usedCategories,
  useStoreProducts,
} from "@/lib/store";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { ProductCard } from "@/components/sections/ProductCard";
import { TopPicksSection } from "@/components/sections/TopPicksSection";

/**
 * The Klinghardt store: the month's picks, then the catalogue filtered by
 * category. Adding to the cart is local; paying is the cart's job.
 *
 * No plain-text page-hero here — the Top Picks panel is the page's header.
 */
export function StorePage() {
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

      {/* No visible page-hero on this page — the Top Picks panel below is
          the header. Kept for the document outline / screen readers, since
          that panel doesn't render at all without a featured product. */}
      <h1 className="sr-only">Explore the Klinghardt Store</h1>

      <TopPicksSection products={featured} />

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
