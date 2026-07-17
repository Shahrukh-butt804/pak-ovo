import { createFileRoute, Link, useNavigate } from "@/lib/router-compat";
import { useMemo, useState, type FormEvent } from "react";
import type { Product } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductCard";
import { z } from "zod";
import { useGetAllProductsQuery } from "@/redux/services/productSlice";
import { useGetAllCategoriesQuery } from "@/redux/services/categorySlice";

const search = z.object({
  q: z.string().optional(),
  filter: z.string().optional(),
  cat: z.string().optional(),
  sort: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().catch(1),
  category: z.string().optional(),
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
  const navigate = useNavigate();
  const [sort, setSort] = useState(sp.sort ?? "newest");
  const [searchInput, setSearchInput] = useState(sp.q ?? "");
  const currentPage = sp.page ?? 1;
  const keyword = (sp.q ?? "").trim();
  const categoryId = sp.category ?? sp.cat ?? "";
  const { data: categoriesResponse } = useGetAllCategoriesQuery({});
  const categories = useMemo(() => (categoriesResponse?.docs ?? categoriesResponse ?? []) as CategoryApiItem[], [categoriesResponse]);

  const { data, isLoading } = useGetAllProductsQuery({
    page: currentPage,
    limit: 8,
    keyword: keyword || undefined,
    category: categoryId || undefined,
    sortBy: mapSortToBackend(sort),
  });

  const selectedCategory = useMemo(() => {
    if (!categoryId) return undefined;
    return categories.find((c: CategoryApiItem) => c._id === categoryId || c.id === categoryId);
  }, [categories, categoryId]);

  const items = useMemo(() => {
    const docs = (data?.docs ?? []).map((item: ProductApiItem, index: number) => normalizeProduct(item, index, sp.cat ?? "cosmetics"));

    let list: Product[] = docs;
    const term = keyword.toLowerCase();
    if (term) {
      list = list.filter((product: Product) => {
        const haystack = `${product.name} ${product.description} ${product.category}`.toLowerCase();
        return haystack.includes(term);
      });
    }
    if (sp.filter === "sale") list = list.filter((product: Product) => Boolean(product.compareAt && product.compareAt > product.price));
    if (selectedCategory) {
      const selectedCategoryName = selectedCategory.name?.toLowerCase();
      const selectedCategorySlug = selectedCategory.slug?.toLowerCase();
      list = list.filter((product: Product) => {
        const categoryValue = product.category.toLowerCase();
        return categoryValue === selectedCategoryName || categoryValue === selectedCategorySlug || categoryValue === categoryId;
      });
    }
    if (sort === "price-asc") list.sort((a: Product, b: Product) => a.price - b.price);
    if (sort === "price-desc") list.sort((a: Product, b: Product) => b.price - a.price);
    if (sort === "rating") list.sort((a: Product, b: Product) => b.rating - a.rating);
    if (sort === "newest") list.sort((a: Product, b: Product) => Number(b.badge === "new") - Number(a.badge === "new"));
    return list;
  }, [categoryId, data?.docs, keyword, sp.filter, sort]);

  const totalPages = Math.max(data?.totalPages ?? 1, 1);
  const totalItems = data?.totalDocs ?? items.length;

  const updateSearch = (updates: Record<string, unknown>) => {
    navigate({
      to: "/shop",
      search: {
        q: keyword || undefined,
        filter: sp.filter || undefined,
        cat: sp.cat || undefined,
        category: categoryId || undefined,
        sort: sort || undefined,
        page: currentPage,
        ...updates,
      },
    });
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = searchInput.trim();
    updateSearch({ q: nextQuery || undefined, page: 1 });
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    updateSearch({ sort: value, page: 1 });
  };

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <nav className="mb-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> / Shop
      </nav>
      <h1 className="font-display text-3xl font-bold md:text-4xl">
        {categoryId ? categories.find((c: CategoryApiItem) => c._id === categoryId)?.name ?? "Category" : "All products"}
      </h1>
      <p className="mt-2 text-muted-foreground">{totalItems} items</p>

      <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 shadow-sm md:flex-row md:items-center">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search products"
          className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none ring-0"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" className="h-10 rounded-full bg-brand px-4 text-sm font-medium text-brand-foreground">Search</button>
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              updateSearch({ q: undefined, page: 1 });
            }}
            className="h-10 rounded-full border border-border px-4 text-sm"
          >
            Clear
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Link to="/shop" search={{ q: keyword || undefined, sort, filter: undefined, cat: undefined, page: 1 }} className="rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:border-brand hover:text-brand">All</Link>
        {categories.map((category: CategoryApiItem) => (
          <Link
            key={category._id}
            to="/shop"
            search={{ q: keyword || undefined, sort, filter: sp.filter || undefined, cat: category._id, category: category._id, page: 1 }}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:border-brand hover:text-brand"
          >
            {category.name}
          </Link>
        ))}
        <select value={sort} onChange={(event) => handleSortChange(event.target.value)} className="ml-auto h-9 rounded-full border border-border bg-background px-3 text-sm">
          <option value="popular">Popular</option>
          <option value="newest">Newest</option>
          <option value="rating">Top rated</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <ProductGrid products={items} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No products matched your filters.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * 8 + 1, totalItems)}-{Math.min(currentPage * 8, totalItems)} of {totalItems}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateSearch({ page: Math.max(currentPage - 1, 1) })}
              disabled={currentPage === 1}
              className="h-9 rounded-full border border-border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => updateSearch({ page })}
                  className={`h-9 min-w-9 rounded-full border px-3 text-sm ${page === currentPage ? "border-brand bg-brand text-brand-foreground" : "border-border"}`}
                >
                  {page}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => updateSearch({ page: Math.min(currentPage + 1, totalPages) })}
              disabled={currentPage === totalPages}
              className="h-9 rounded-full border border-border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type CategoryApiItem = {
  _id?: string;
  id?: string;
  name?: string;
  slug?: string;
};

type ProductApiItem = {
  _id?: string | number;
  id?: string | number;
  name?: string;
  title?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  discountedPrice?: number;
  salePrice?: number;
  originalPrice?: number;
  compareAt?: number;
  rating?: number;
  reviews?: number;
  badge?: Product["badge"];
  image?: string;
  thumbnail?: string;
  productImage?: string;
  images?: string[];
  tags?: string[];
  subcategory?: string;
  category?: string | { slug?: string; name?: string };
};

function normalizeProduct(item: ProductApiItem, index: number, fallbackCategory: string): Product {
  const name = String(item.name ?? item.title ?? "Untitled product");
  const categoryName = typeof item.category === "string" ? item.category : item.category?.name ?? item.category?.slug ?? fallbackCategory;
  const category = String(categoryName);
  const discounted = item.discountedPrice != null;
  const price = Number(item.discountedPrice ?? item.price ?? item.salePrice ?? item.originalPrice ?? 0);
  const compareAt = discounted ? Number(item.price ?? item.compareAt ?? 0) : item.compareAt ? Number(item.compareAt) : undefined;

  return {
    id: String(item._id ?? item.id ?? `${category}-${index + 1}`),
    slug: String(item.slug ?? slugify(name) ?? `product-${index + 1}`),
    name,
    category: category as Product["category"],
    subcategory: String(category),
    price,
    compareAt,
    rating: Number(item.rating ?? 4.5),
    reviews: Number(item.reviews ?? 0),
    badge: item.badge ?? (discounted || item.compareAt ? "sale" : undefined),
    description: String(item.description ?? item.shortDescription ?? ""),
    image: String(item.image ?? item.thumbnail ?? item.productImage ?? ""),
    images: Array.isArray(item.images) ? item.images : undefined,
    tags: Array.isArray(item.tags) ? item.tags : [category],
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

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
