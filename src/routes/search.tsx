import { createFileRoute, Link } from "@/lib/router-compat";
import { useMemo, useState } from "react";
import { Search as SearchIcon, TrendingUp } from "lucide-react";
import { z } from "zod";
import { products } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductCard";

export const Route = createFileRoute("/search")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({ meta: [{ title: "Search — PakOvo" }, { name: "description", content: "Search premium products." }] }),
  component: SearchPage,
});

const popular = ["Lipstick", "Oud Perfume", "Smart Watch", "Cotton Sheets", "Chamomile Tea", "Argan Oil"];

function SearchPage() {
  const sp = Route.useSearch();
  const [q, setQ] = useState(sp.q ?? "");

  const items = useMemo(() => {
    if (!q.trim()) return [];
    const lower = q.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.tags.some(tag => tag.toLowerCase().includes(lower))
    );
  }, [q]);

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Search</h1>
      <div className="relative mt-6">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products, categories..."
          className="h-14 w-full rounded-full border border-border bg-surface pl-12 pr-4 text-base outline-none focus:border-brand"
        />
      </div>

      {!q.trim() ? (
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Popular searches</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {popular.map(t => (
              <button key={t} onClick={() => setQ(t)} className="rounded-full border border-border px-4 py-2 text-sm hover:border-brand hover:text-brand">{t}</button>
            ))}
          </div>
        </div>
      ) : items.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No results for "{q}". Try a different keyword.</p>
      ) : (
        <div className="mt-10">
          <p className="mb-6 text-sm text-muted-foreground">{items.length} results for "{q}"</p>
          <ProductGrid products={items.slice(0, 24)} />
        </div>
      )}
    </div>
  );
}
