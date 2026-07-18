import { createFileRoute, Link, notFound } from "@/lib/router-compat";
import { useMemo, useState } from "react";
import { findCategory } from "@/data/categories";
import { productsByCategory } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductCard";
import { ChevronDown } from "lucide-react";
import { useGetAllSubCategoriesQuery } from "@/redux/services/subCategorySlice";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }: any) => {
    const cat = findCategory(params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }: any) => {
    const c = loaderData?.cat;
    return {
      meta: [
        { title: `${c?.name ?? "Collection"} — PakOvo` },
        { name: "description", content: c?.description ?? "" },
        { property: "og:title", content: `${c?.name ?? ""} — PakOvo` },
        { property: "og:description", content: c?.description ?? "" },
        { property: "og:url", content: `/collections/${c?.slug ?? ""}` },
        { property: "og:image", content: c?.image ?? "" },
      ],
      links: [{ rel: "canonical", href: `/collections/${c?.slug ?? ""}` }],
      scripts: c ? [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: c.name, item: `/collections/${c.slug}` },
          ],
        }),
      }] : [],
    };
  },
  component: Collection,
});

function Collection() {
  const { cat } = Route.useLoaderData();
  const all = productsByCategory(cat.slug);
  const [sort, setSort] = useState("popular");

  // const {data : subCategories} = useGetAllSubCategoriesQuery({slug})
  // console.log("🚀 ~ Collection ~ subCategories:", subCategories)

  const items = useMemo(() => {
    let list = all.slice();
    if (sort === "price-asc") list.sort((a,b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a,b) => b.price - a.price);
    if (sort === "rating") list.sort((a,b) => b.rating - a.rating);
    return list;
  }, [all, sort]);

  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="container-px mx-auto grid max-w-7xl items-center gap-6 py-8 md:grid-cols-[1fr_180px] md:py-10">
          <div className="min-w-0">
            <nav className="text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link> /{" "}
              <Link to="/shop" className="hover:text-foreground">Shop</Link> / {cat.name}
            </nav>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">{cat.tagline}</p>
            <h1 className="mt-1 font-display text-2xl font-bold md:text-3xl">{cat.name}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{cat.description}</p>
          </div>
          <div className="hidden overflow-hidden rounded-xl border border-border md:block">
            <img src={cat.image} alt={cat.name} className="h-28 w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl py-10">
        <div className="flex flex-wrap items-center gap-2">
          <select value={sort} onChange={e => setSort(e.target.value)} className="ml-auto h-9 rounded-full border border-border bg-background px-3 text-sm">
            <option value="popular">Popular</option>
            <option value="rating">Top rated</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{items.length} products</p>
        <div className="mt-6">
          <ProductGrid products={items} />
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-surface p-8">
          <h2 className="font-display text-2xl font-bold">Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-border">
            {[
              { q: `How do I choose the right ${cat.name.toLowerCase()}?`, a: `Browse our curated products or use filters to narrow by price and popularity. Every product page includes detailed specs and verified reviews.` },
              { q: "What is the shipping time?", a: "Standard delivery 3–6 business days. Express delivery 1–3 days. Free shipping on orders over Rs 5,000." },
              { q: "What is your return policy?", a: "Easy 30-day returns on all items in original condition. Refunds processed within 5–7 business days." },
            ].map(({ q, a }) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-medium list-none">
                  {q} <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
