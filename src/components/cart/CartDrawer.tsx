import { Link } from "@/lib/router-compat";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart, cartTotals } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { open, setOpen, lines, setQty, remove } = useCart();
  const totals = cartTotals(lines);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50 animate-in fade-in duration-200" onClick={() => setOpen(false)} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-display text-lg font-semibold">Your bag ({lines.length})</h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="p-1.5 hover:bg-secondary rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Your bag is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Discover our latest arrivals.</p>
            </div>
            <Button variant="premium" onClick={() => setOpen(false)} asChild>
              <Link to="/shop">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              <ul className="divide-y divide-border">
                {lines.map((l) => (
                  <li key={`${l.id}-${l.variant ?? ""}`} className="flex gap-4 py-4">
                    <Link to="/products/$slug" params={{ slug: l.slug }} onClick={() => setOpen(false)} className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-surface">
                      <img src={l.image} alt={l.name} className="h-full w-full object-cover" />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <Link to="/products/$slug" params={{ slug: l.slug }} onClick={() => setOpen(false)} className="text-sm font-medium hover:text-brand line-clamp-2">{l.name}</Link>
                        <button onClick={() => remove(l.id, l.variant)} aria-label="Remove" className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {l.variant && <p className="text-xs text-muted-foreground">{l.variant}</p>}
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-border">
                          <button onClick={() => setQty(l.id, l.qty - 1, l.variant)} className="p-1.5 hover:bg-secondary rounded-l-full" aria-label="Decrease">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{l.qty}</span>
                          <button onClick={() => setQty(l.id, l.qty + 1, l.variant)} className="p-1.5 hover:bg-secondary rounded-r-full" aria-label="Increase">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold">{formatPrice(l.price * l.qty)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border p-5">
              <div className="space-y-1.5 text-sm">
                <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
                <Row label="Shipping" value={totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)} />
                <Row label="Tax (est.)" value={formatPrice(totals.tax)} />
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(totals.total)}</span>
                </div>
              </div>
              <Button variant="hero" size="lg" className="mt-4 w-full" asChild>
                <Link to="/checkout" onClick={() => setOpen(false)}>Checkout</Link>
              </Button>
              <button onClick={() => setOpen(false)} className="mt-2 w-full py-2 text-center text-sm text-muted-foreground hover:text-foreground">
                Continue shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span><span className="text-foreground">{value}</span>
    </div>
  );
}