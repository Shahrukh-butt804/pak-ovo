import { createFileRoute, Link } from "@/lib/router-compat";
import { useWishlist } from "@/lib/wishlist-store";
import { products, type Product } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { useGetMyWishlistQuery } from "@/redux/services/wishlistSlice";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [{ title: "Wishlist — PakOvo" }, { name: "description", content: "Your saved items." }],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { data: wishlist, isLoading } = useGetMyWishlistQuery({});
  const ids = useWishlist((s) => s.ids);
  const apiProducts = Array.isArray(wishlist?.products) ? wishlist.products : [];
  const apiItems = apiProducts.map((p: any) => ({
    id: p._id,
    slug: p.slug ?? (p.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    name: p.title ?? p.name ?? "Product",
    wished: true,
    image: p.image ? p.image.split("\\").join("/") : "",
    price: p.price ?? 0,
    rating: p.rating ?? 0,
    reviews: p.reviews ?? 0,
    category: p.category as any,
    subcategory: p.subcategory ?? "",
    description: p.description ?? "",
    tags: [],
    compareAt: p.discountedPrice ?? undefined,
  } as Product));

  const localItems = products
    .filter((p) => ids.includes(p.id))
    .map((p) => ({ ...p, wished: true }));
  const items = apiItems.length > 0 ? apiItems : localItems;

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Wishlist</h1>
      <p className="mt-1 text-muted-foreground">{items.length} saved items</p>
      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">Save items you love. They'll show up here.</p>
            <Button variant="hero" className="mt-6" asChild>
              <Link to="/shop">Browse products</Link>
            </Button>
          </div>
        ) : (
          <ProductGrid products={items} />
        )}
      </div>
    </div>
  );
}
