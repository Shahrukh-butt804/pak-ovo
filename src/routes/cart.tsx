import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart, cartTotals } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your cart — PakOvo" }, { name: "description", content: "Review your shopping bag." }], links: [{ rel: "canonical", href: "/cart" }] }),
  component: CartPage,
});

function CartPage() {
  const { lines, setQty, remove } = useCart();
  const t = cartTotals(lines);

  if (lines.length === 0) {
    return (
      <div className="container-px mx-auto max-w-7xl py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Your bag is empty</h1>
        <p className="mt-2 text-muted-foreground">Start exploring premium products.</p>
        <Button variant="hero" size="lg" className="mt-6" asChild><Link to="/shop">Shop now</Link></Button>
      </div>
    );
  }

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Your bag</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-border">
          {lines.map(l => (
            <li key={`${l.id}-${l.variant ?? ""}`} className="flex gap-4 py-6">
              <Link to="/products/$slug" params={{ slug: l.slug }} className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-surface">
                <img src={l.image} alt={l.name} className="h-full w-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                  <Link to="/products/$slug" params={{ slug: l.slug }} className="font-medium hover:text-brand">{l.name}</Link>
                  <button onClick={() => remove(l.id, l.variant)} aria-label="Remove" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
                {l.variant && <p className="text-xs text-muted-foreground">{l.variant}</p>}
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-border">
                    <button onClick={() => setQty(l.id, l.qty - 1, l.variant)} className="p-2 hover:bg-secondary rounded-l-full"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-10 text-center text-sm font-medium">{l.qty}</span>
                    <button onClick={() => setQty(l.id, l.qty + 1, l.variant)} className="p-2 hover:bg-secondary rounded-r-full"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <p className="font-semibold">{formatPrice(l.price * l.qty)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-6 lg:sticky lg:top-32">
          <h2 className="font-display text-lg font-semibold">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={formatPrice(t.subtotal)} />
            <Row label="Shipping" value={t.shipping === 0 ? "Free" : formatPrice(t.shipping)} />
            <Row label="Tax (est.)" value={formatPrice(t.tax)} />
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <span>Total</span><span>{formatPrice(t.total)}</span>
            </div>
          </div>
          <input placeholder="Discount code" className="mt-4 h-10 w-full rounded-md border border-input bg-background px-3 text-sm" />
          <Button variant="hero" size="lg" className="mt-3 w-full" asChild><Link to="/checkout">Checkout</Link></Button>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-muted-foreground"><span>{label}</span><span className="text-foreground">{value}</span></div>;
}
