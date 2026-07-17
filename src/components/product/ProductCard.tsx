import { UPLOADS_URL } from "@/constants/api";
import { type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { Link } from "@/lib/router-compat";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist-store";
import { useAddToCartMutation } from "@/redux/services/cartSlice";
import { useAddProductToWishlistMutation } from "@/redux/services/wishlistSlice";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const toggleWish = useWishlist((s) => s.toggle);
  const [addToWishlist, { isLoading: isAddingToWishlist }] = useAddProductToWishlistMutation();
  const wished = useWishlist((s) => s.ids.includes(product.id));

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const res: any = await addToCart({ productId: product.id, quantity: 1 });
    if (res?.data?.success) {
      toast.success(res.data.message || "Operation successful");
    } else {
      toast.error(res.error.data.message || "something went wrong");
    }
  };
  const handleAddToWishlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleWish(product.id);
    e.preventDefault();
    e.stopPropagation();
    const res: any = await addToWishlist(product.id);
    if (res?.data?.success) {
      toast.success(res.data.message || "Operation successful");
    } else {
      toggleWish(product.id);
      toast.error(res.error.data.message || "something went wrong");
    }
  };

  const badgeStyles: Record<string, string> = {
    new: "bg-brand text-brand-foreground",
    bestseller: "bg-navy text-navy-foreground",
    sale: "bg-destructive text-destructive-foreground",
    limited: "bg-gold text-gold-foreground",
  };

  return (
    <div className="group relative flex flex-col">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative aspect-4/5 overflow-hidden rounded-xl bg-surface"
      >
        <img
          src={UPLOADS_URL + product.image}
          alt={product.name}
          crossOrigin="anonymous"
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.badge && (
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
              badgeStyles[product.badge],
            )}
          >
            {product.badge}
          </span>
        )}
        <button
          onClick={handleAddToWishlist}
          disabled={isAddingToWishlist}
          aria-label="Add to wishlist"
          className={cn(
            "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 backdrop-blur transition-all hover:scale-110",
            wished && "text-destructive",
          )}
        >
          <Heart className={cn("h-4 w-4", wished && "fill-current")} />
        </button>
        <button
          disabled={isAddingToCart}
          onClick={handleAddToCart}
          className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 rounded-full bg-navy py-2.5 text-xs font-semibold text-navy-foreground opacity-0 transition-all duration-300 hover:bg-brand group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ShoppingBag className="h-4 w-4" />
          Quick add
        </button>
      </Link>
      <div className="mt-3 px-1">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {product?.category || "N/A"}
        </p>
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="mt-1 block text-sm font-medium hover:text-brand line-clamp-2"
        >
          {product.name}
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          <span className="text-xs text-muted-foreground">
            {product.rating.toFixed(1)} ({product.reviews})
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold">{formatPrice(product.price)}</span>
          {product.compareAt && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export function ProductRow({ products }: { products: Product[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-px-4 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
      {products.map((p) => (
        <div key={p.id} className="w-[70%] shrink-0 snap-start sm:w-[45%] md:w-[35%] lg:w-auto">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
