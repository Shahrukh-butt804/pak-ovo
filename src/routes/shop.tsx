import { createFileRoute, Link } from "@/lib/router-compat";
import { useMemo, useState } from "react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { ProductGrid } from "@/components/product/ProductCard";
import { z } from "zod";

const search = z.object({
  filter: z.string().optional(),
  cat: z.string().optional(),
  sort: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Shop all — PakOvo" },
      { name: "description", content: "Browse all premium products: cosmetics, perfumes, watches, bed sheets, curtains, herbs." },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: Shop,
});

function Shop() {
  const sp = Route.useSearch();
  const [sort, setSort] = useState(sp.sort ?? "popular");

  const items = useMemo(() => {
    let list = products.slice();
    if (sp.filter === "sale") list = list.filter(p => p.compareAt);
    if (sp.cat) list = list.filter(p => p.category === sp.cat);
    if (sort === "price-asc") list.sort((a,b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a,b) => b.price - a.price);
    if (sort === "rating") list.sort((a,b) => b.rating - a.rating);
    if (sort === "newest") list.sort((a,b) => (b.badge === "new" ? 1 : 0) - (a.badge === "new" ? 1 : 0));
    return list;
  }, [sp, sort]);

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <nav className="mb-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> / Shop
      </nav>
      <h1 className="font-display text-3xl font-bold md:text-4xl">
        {sp.filter === "sale" ? "Sale" : sp.cat ? categories.find(c=>c.slug===sp.cat)?.name : "All products"}
      </h1>
      <p className="mt-2 text-muted-foreground">{items.length} items</p>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Link to="/shop" className="rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:border-brand hover:text-brand">All</Link>
        {categories.map(c => (
          <Link key={c.slug} to="/shop" search={{ cat: c.slug }} className="rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:border-brand hover:text-brand">{c.name}</Link>
        ))}
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="ml-auto h-9 rounded-full border border-border bg-background px-3 text-sm">
          <option value="popular">Popular</option>
          <option value="newest">Newest</option>
          <option value="rating">Top rated</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <div className="mt-8">
        <ProductGrid products={items} />
      </div>
    </div>
  );
}
