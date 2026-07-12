import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag, Star, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { findProduct, relatedProducts } from "@/data/products";
import { findCategory } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { formatPrice } from "@/lib/format";
import { ProductGrid } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = findProduct(params.slug);
    if (!product) throw notFound();
    return { product, related: relatedProducts(product, 4), cat: findCategory(product.category)! };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [] };
    return {
      meta: [
        { title: `${p.name} — PakOvo` },
        { name: "description", content: p.description },
        { property: "og:title", content: p.name },
        { property: "og:description", content: p.description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/products/${p.slug}` },
        { property: "og:image", content: p.image },
      ],
      links: [{ rel: "canonical", href: `/products/${p.slug}` }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          description: p.description,
          image: p.image,
          aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviews },
        offers: { "@type": "Offer", priceCurrency: "PKR", price: p.price, availability: "https://schema.org/InStock" },
        }),
      }],
    };
  },
  notFoundComponent: () => (
    <div className="container-px mx-auto max-w-7xl py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Product not found</h1>
      <Button asChild className="mt-6"><Link to="/shop">Back to shop</Link></Button>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product, related, cat } = Route.useLoaderData();
  const navigate = useNavigate();
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState(product.variants?.[0]?.options[0]);
  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];
  const [activeImg, setActiveImg] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  const doAdd = () => add({ id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.image, variant }, qty);

  return (
    <>
      <section className="container-px mx-auto max-w-7xl pt-8">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link> /{" "}
          <Link to="/collections/$slug" params={{ slug: cat.slug }} className="hover:text-foreground">{cat.name}</Link> / {product.name}
        </nav>
      </section>

      <section className="container-px mx-auto grid max-w-7xl gap-10 py-8 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div
            className="relative overflow-hidden rounded-2xl bg-surface aspect-square cursor-zoom-in"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
            }}
            onMouseLeave={() => setZoom(null)}
          >
            <img
              src={gallery[activeImg]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-200"
              style={zoom ? { transform: `scale(1.8)`, transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = product.image; }}
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {gallery.map((src: string, i: number) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
                className={cn(
                  "aspect-square overflow-hidden rounded-md bg-surface transition-all",
                  i === activeImg ? "ring-2 ring-brand" : "opacity-70 hover:opacity-100",
                )}
              >
                <img src={src} alt="" className="h-full w-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = product.image; }} />
              </button>
            ))}
          </div>
        </div>

        <div>
          {product.badge && <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">{product.badge}</span>}
          <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex gap-0.5 text-gold">
              {[1,2,3,4,5].map(i => <Star key={i} className={cn("h-4 w-4", i <= Math.round(product.rating) && "fill-current")} />)}
            </div>
            <span className="text-sm text-muted-foreground">{product.rating.toFixed(1)} · {product.reviews} reviews</span>
          </div>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.compareAt)}</span>
                <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                  -{Math.round((1 - product.price / product.compareAt) * 100)}%
                </span>
              </>
            )}
          </div>
          <p className="mt-5 leading-relaxed text-muted-foreground">{product.description}</p>

          {product.variants?.map((v: { name: string; options: string[] }) => (
            <div key={v.name} className="mt-6">
              <p className="text-sm font-medium">{v.name}: <span className="text-muted-foreground">{variant}</span></p>
              <div className="mt-2 flex flex-wrap gap-2">
                {v.options.map((o: string) => (
                  <button key={o} onClick={() => setVariant(o)} className={cn("rounded-full border px-4 py-2 text-sm transition-colors", variant === o ? "border-brand bg-brand/10 text-brand" : "border-border hover:border-foreground")}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-8 flex gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-secondary rounded-l-full" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-secondary rounded-r-full" aria-label="Increase"><Plus className="h-4 w-4" /></button>
            </div>
            <Button variant="hero" size="lg" className="flex-1" onClick={doAdd}><ShoppingBag className="h-4 w-4" /> Add to bag</Button>
            <Button variant="outline" size="lg" onClick={() => toggleWish(product.id)} aria-label="Wishlist"><Heart className={cn("h-4 w-4", wished && "fill-destructive text-destructive")} /></Button>
          </div>
          <Button variant="premium" size="lg" className="mt-3 w-full" onClick={() => { doAdd(); navigate({ to: "/checkout" }); }}>Buy it now</Button>

          <div className="mt-8 grid gap-3 rounded-2xl border border-border bg-surface p-5 text-sm">
            <div className="flex items-center gap-3"><Truck className="h-4 w-4 text-brand" /> Free shipping on orders over Rs 5,000</div>
            <div className="flex items-center gap-3"><RotateCcw className="h-4 w-4 text-brand" /> 30-day easy returns</div>
            <div className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-brand" /> Authentic product guarantee</div>
          </div>

          <div className="mt-10 space-y-4">
            <details open className="rounded-xl border border-border p-4">
              <summary className="cursor-pointer font-medium">Specifications</summary>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                <li><strong className="text-foreground">Category:</strong> {cat.name}</li>
                <li><strong className="text-foreground">Subcategory:</strong> {product.subcategory}</li>
                <li><strong className="text-foreground">SKU:</strong> {product.id.toUpperCase()}</li>
                <li><strong className="text-foreground">In stock:</strong> Yes — ships within 24h</li>
              </ul>
            </details>
            <details className="rounded-xl border border-border p-4">
              <summary className="cursor-pointer font-medium">Reviews ({product.reviews})</summary>
              <div className="mt-4 space-y-4">
                {[
                  { name: "Olivia P.", rating: 5, text: "Beautiful product. Exactly as described and feels premium." },
                  { name: "Marcus T.", rating: 5, text: "Fast delivery, packaging was elegant. Will buy again." },
                ].map(r => (
                  <div key={r.name} className="border-b border-border pb-3">
                    <div className="flex items-center gap-2"><div className="flex gap-0.5 text-gold">{Array.from({length: r.rating}).map((_,i) => <Star key={i} className="h-3 w-3 fill-current" />)}</div><span className="text-xs font-semibold">{r.name}</span></div>
                    <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl py-16">
        <h2 className="mb-8 font-display text-2xl font-bold md:text-3xl">You may also like</h2>
        <ProductGrid products={related} />
      </section>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground line-clamp-1">{product.name}</p>
            <p className="font-semibold">{formatPrice(product.price)}</p>
          </div>
          <Button variant="hero" onClick={doAdd}><ShoppingBag className="h-4 w-4" /> Add</Button>
        </div>
      </div>
    </>
  );
}
