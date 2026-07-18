import { ProductGrid } from "@/components/product/ProductCard";
import { UPLOADS_URL } from "@/constants/api";
import { findCategory } from "@/data/categories";
import { createFileRoute, notFound } from "@/lib/router-compat";
import { useGetCategoryBySlugQuery } from "@/redux/services/categorySlice";
import { useGetAllProductsQuery } from "@/redux/services/productSlice";
import { useGetAllSubCategoriesQuery } from "@/redux/services/subCategorySlice";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

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
      scripts: c
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: "/" },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: c.name,
                    item: `/collections/${c.slug}`,
                  },
                ],
              }),
            },
          ]
        : [],
    };
  },
  component: Collection,
});

function Collection() {
  const params = useParams();
  const { slug  }: any = params; // category slug, constant from URL

  const [sort, setSort] = useState("popular");
  const [subCategorySlug, setSubCategorySlug] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data: category, isLoading: isLoadingCategory } = useGetCategoryBySlugQuery(slug);

  const { data: subCategories, isLoading: isLoadingSubCategories } = useGetAllSubCategoriesQuery({
    slug,
  });

  const { data: productsResponse, isLoading: isLoadingProducts, refetch } = useGetAllProductsQuery(
    {
      category: slug,
      subCategory: subCategorySlug || undefined,
      page,
      limit,
      sortBy: mapSortToBackend(sort),
    },
    { refetchOnMountOrArgChange: true },
  );

  const items = useMemo(
    () => (productsResponse?.docs ?? []).map((item: any, index: number) => normalizeProduct(item, index, slug)),
    [productsResponse?.docs, slug],
  );
  const totalPages = Math.max(productsResponse?.totalPages ?? 1, 1);
  const totalItems = productsResponse?.totalDocs ?? items.length;

  const categoryLabel = useMemo(
    () =>
      slug
        ? slug
            .split("-")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : "Category",
    [slug],
  );

  const handleSubCategoryClick = (nextSlug: string) => {
    setSubCategorySlug(nextSlug);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };
return (
  <>
    <section className="border-b border-border bg-surface">
      <div className="container-px mx-auto grid max-w-7xl items-center gap-6 py-8 md:grid-cols-[1fr_220px] md:py-10">
        <div className="min-w-0">
          <nav className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>{" "}
            /{" "}
            <Link to="/shop" className="hover:text-foreground">
              Shop
            </Link>{" "}
            / {categoryLabel}
          </nav>
          {/* Uncomment once tagline is available from a category fetch */}
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
            Time, beautifully kept
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">{categoryLabel}</h1>
          {/* Uncomment once description is available from a category fetch */}
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Hand-picked watches — classic dress pieces, modern smartwatches and statement luxury timepieces.</p>
        </div>
        {/* Uncomment once image is available from a category fetch */}
        <div className="hidden overflow-hidden rounded-2xl border border-border md:block">
          <img src={UPLOADS_URL + category?.image} crossOrigin="anonymous" alt={categoryLabel} className="h-72 w-full object-cover" />
        </div>
      </div>
    </section>

    <section className="container-px mx-auto max-w-7xl py-10">
      <div className="flex flex-wrap items-center gap-2">
        {!(isLoadingSubCategories || isLoadingCategory) && (subCategories?.docs?.length ?? 0) > 0 && (
          <>
            <button
              type="button"
              onClick={() => handleSubCategoryClick("")}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                subCategorySlug === ""
                  ? "border-brand text-brand"
                  : "border-border text-foreground hover:border-brand hover:text-brand"
              }`}
            >
              All
            </button>
            {subCategories.docs.map((sub: any) => (
              <button
                key={sub._id}
                type="button"
                onClick={() => handleSubCategoryClick(sub.slug)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  subCategorySlug === sub.slug
                    ? "border-brand text-brand"
                    : "border-border text-foreground hover:border-brand hover:text-brand"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </>
        )}
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="ml-auto h-10 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="popular">Popular</option>
          <option value="rating">Top rated</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{totalItems} products</p>

      <div className="mt-6">
        {isLoadingProducts ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <ProductGrid products={items} refetch={refetch} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No products matched your filters.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            Showing {Math.min((page - 1) * limit + 1, totalItems)}-
            {Math.min(page * limit, totalItems)} of {totalItems}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="h-9 rounded-full border border-border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  className={`h-9 min-w-9 rounded-full border px-3 text-sm ${
                    pageNum === page ? "border-brand bg-brand text-brand-foreground" : "border-border"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="h-9 rounded-full border border-border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <div className="mt-16 rounded-2xl border border-border bg-surface p-8">
        <h2 className="font-display text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-6 divide-y divide-border">
          {[
            {
              q: `How do I choose the right ${categoryLabel.toLowerCase()}?`,
              a: `Browse our curated products or use filters to narrow by price and popularity. Every product page includes detailed specs and verified reviews.`,
            },
            {
              q: "What is the shipping time?",
              a: "Standard delivery 3–6 business days. Express delivery 1–3 days. Free shipping on orders over Rs 5,000.",
            },
            {
              q: "What is your return policy?",
              a: "Easy 30-day returns on all items in original condition. Refunds processed within 5–7 business days.",
            },
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

function normalizeProduct(item: any, index: number, fallbackCategory: string) {
  const name = String(item.name ?? item.title ?? "Untitled product");
  const categoryName =
    typeof item.category === "string"
      ? item.category
      : (item.category?.name ?? item.category?.slug ?? fallbackCategory);
  const category = String(categoryName);
  const discounted = item.discountedPrice != null;
  const price = Number(item.discountedPrice ?? item.price ?? 0);
  const compareAt = discounted ? Number(item.price ?? 0) : undefined;

  return {
    id: String(item._id ?? item.id ?? `${category}-${index + 1}`),
    slug: String(item.slug ?? `product-${index + 1}`),
    name,
    category,
    subcategory: String(item.subCategory?.name ?? category),
    price,
    compareAt,
    rating: Number(item.rating ?? 4.5),
    reviews: Number(item.reviews ?? 0),
    badge: discounted ? "sale" : undefined,
    description: String(item.description ?? ""),
    image: String(item.image ?? ""),
    tags: [category],
    wished: item.wished ?? false,
  };
}



function mapSortToBackend(value: string) {
  switch (value) {
    case "price-asc":
      return "low-to-high";
    case "price-desc":
      return "high-to-low";
    case "rating":
      return "top-rated";
    case "popular":
      return "popular";
    default:
      return "newest";
  }
}
