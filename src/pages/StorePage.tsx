import { useMemo, useState } from "react";
import { Seo } from "@/components/Seo";
import {
  featuredProducts,
  usedCategories,
  useStoreProducts,
} from "@/lib/store";
import { useSection } from "@/lib/sections";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { ProductCard } from "@/components/sections/ProductCard";
import { TopPicksSection } from "@/components/sections/TopPicksSection";

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
      <AnimatedGradient variant="plain" intensity="strong" className="page-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <p className="eyebrow">Shop</p>
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

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
