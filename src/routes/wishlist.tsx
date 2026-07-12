import { createFileRoute, Link } from "@tanstack/react-router";
import { useWishlist } from "@/lib/wishlist-store";
import { products } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — PakOvo" }, { name: "description", content: "Your saved items." }] }),
  component: Wishlist,
});

function Wishlist() {
  const ids = useWishlist(s => s.ids);
  const items = products.filter(p => ids.includes(p.id));

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Wishlist</h1>
      <p className="mt-1 text-muted-foreground">{items.length} saved items</p>
      <div className="mt-8">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">Save items you love. They'll show up here.</p>
            <Button variant="hero" className="mt-6" asChild><Link to="/shop">Browse products</Link></Button>
          </div>
        ) : <ProductGrid products={items} />}
      </div>
    </div>
  );
}
