import { createFileRoute, Link } from "@/lib/router-compat";
import { useState } from "react";
import { CheckCircle2, Lock, ShoppingBag, Truck, CreditCard } from "lucide-react";
import { useCart, cartTotals } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — PakOvo" }, { name: "description", content: "Complete your purchase securely." }] }),
  component: Checkout,
});

function Checkout() {
  const { lines, clear } = useCart();
  const t = cartTotals(lines);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="container-px mx-auto max-w-2xl py-24 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-brand" />
        <h1 className="mt-4 font-display text-3xl font-bold">Order confirmed</h1>
        <p className="mt-2 text-muted-foreground">Thank you for shopping with PakOvo. A confirmation email is on its way.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="hero" size="lg" asChild><Link to="/">Continue shopping</Link></Button>
          <Button variant="outline" size="lg" asChild><Link to="/track">Track my order</Link></Button>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-px mx-auto max-w-7xl py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Nothing to check out</h1>
        <Button variant="hero" size="lg" className="mt-6" asChild><Link to="/shop">Shop now</Link></Button>
      </div>
    );
  }

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Checkout</h1>
      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><Lock className="h-3 w-3" /> Secure 256-bit SSL checkout</p>

      <ol className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Step icon={ShoppingBag} label="Cart" done />
        <Divider />
        <Step icon={Truck} label="Shipping" active />
        <Divider />
        <Step icon={CreditCard} label="Payment" active />
        <Divider />
        <Step icon={CheckCircle2} label="Confirm" />
      </ol>

      <form onSubmit={(e) => { e.preventDefault(); clear(); setDone(true); }} className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <Block title="Contact">
            <Input label="Email" type="email" required />
            <Input label="Phone" required />
          </Block>
          <Block title="Shipping address">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="First name" required />
              <Input label="Last name" required />
              <Input label="Address" className="sm:col-span-2" required />
              <Input label="City" required />
              <Input label="Postal code" required />
              <Input label="Country" defaultValue="Pakistan" className="sm:col-span-2" required />
            </div>
          </Block>
          <Block title="Payment">
            <Input label="Card number" required placeholder="1234 1234 1234 1234" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Expiry" required placeholder="MM/YY" />
              <Input label="CVC" required placeholder="123" />
            </div>
            <Input label="Name on card" required />
          </Block>
          <Button variant="hero" size="xl" type="submit" className="w-full">Pay {formatPrice(t.total)}</Button>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-6 lg:sticky lg:top-32">
          <h2 className="font-display text-lg font-semibold">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {lines.map(l => (
              <li key={`${l.id}-${l.variant ?? ""}`} className="flex gap-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-md bg-background">
                  <img src={l.image} alt={l.name} className="h-full w-full object-cover" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-navy-foreground">{l.qty}</span>
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium line-clamp-1">{l.name}</p>
                  {l.variant && <p className="text-xs text-muted-foreground">{l.variant}</p>}
                </div>
                <p className="text-sm font-semibold">{formatPrice(l.price * l.qty)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
            <Row label="Subtotal" value={formatPrice(t.subtotal)} />
            <Row label="Shipping" value={t.shipping === 0 ? "Free" : formatPrice(t.shipping)} />
            <Row label="Tax" value={formatPrice(t.tax)} />
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <span>Total</span><span>{formatPrice(t.total)}</span>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
function Input({ label, className, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input {...rest} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand" />
    </label>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-muted-foreground"><span>{label}</span><span className="text-foreground">{value}</span></div>;
}

function Step({ icon: Icon, label, active, done }: { icon: any; label: string; active?: boolean; done?: boolean }) {
  return (
    <li className={`flex items-center gap-1.5 ${done ? "text-brand" : active ? "text-foreground" : ""}`}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </li>
  );
}
function Divider() {
  return <li aria-hidden className="h-px w-6 bg-border" />;
}
