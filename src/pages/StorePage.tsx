import { useMemo, useState } from "react";
import { Seo } from "@/components/Seo";
import { useSection } from "@/lib/sections";
import {
  featuredProducts,
  usedCategories,
  useStoreProducts,
} from "@/lib/store";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { ProductCard } from "@/components/sections/ProductCard";
import { TopPicksSection } from "@/components/sections/TopPicksSection";

/**
 * The Klinghardt store: the month's picks, then the catalogue filtered by
 * category. Adding to the cart is local; paying is the cart's job.
 *
 * The Top Picks panel opens the page; a centred intro (client, 2026-09-11:
 * "te falta el titulo y el parrafo de texto despues de los picks") names the
 * catalogue itself before the category filters and grid.
 */
export function StorePage() {
  const products = useStoreProducts();
  const featured = useMemo(() => featuredProducts(products), [products]);
  const categories = useMemo(() => usedCategories(products), [products]);
  const [category, setCategory] = useState("");

  const intro = useSection("store-intro", {
    title: "Explore the Klinghardt® Store",
    paragraphs: [
      "Discover books, work materials, testing kits, scripts and other professional resources used in neurobiological practice.",
    ],
  });

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

      <TopPicksSection products={featured} />

      <section className="section wrap store-intro">
        <Reveal className="section-heading section-heading--center">
          <p className="eyebrow">Shop</p>
          <h1><Marked text={intro.title} /></h1>
          {intro.lead ? <p className="lead">{intro.lead}</p> : null}
        </Reveal>
      </section>

      <section className="section wrap">
        {categories.length ? (
          // Client (2026-09-11): "los botones... deben verse como la imagen
          // anexa" — sentence case (not the shared .tab's own uppercase),
          // no visible counts (kept for screen readers via aria-label
          // instead), and a "Shop all" reset action at the row's other end.
          <div className="store-filters-row">
            <div className="tabs store-filters" role="tablist" aria-label="Product categories">
              <button
                type="button"
                role="tab"
                className="tab"
                aria-selected={category === ""}
                aria-label={`All (${products.length})`}
                onClick={() => setCategory("")}
              >
                All
              </button>
              {categories.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  className="tab"
                  aria-selected={category === item.key}
                  aria-label={`${item.label} (${products.filter((product) => product.categoryKey === item.key).length})`}
                  onClick={() => setCategory(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button type="button" className="arrow-link store-filters__shop-all" onClick={() => setCategory("")}>
              Shop all <span aria-hidden="true">↗</span>
            </button>
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
