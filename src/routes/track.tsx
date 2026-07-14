import { createFileRoute } from "@/lib/router-compat";
import { useState } from "react";
import { Search, Package, Truck, MapPin, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/lib/admin-store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track your order — PakOvo" },
      { name: "description", content: "Track the status of your PakOvo order in real time — from packing to delivery." },
      { property: "og:title", content: "Track your order — PakOvo" },
      { property: "og:url", content: "/track" },
    ],
    links: [{ rel: "canonical", href: "/track" }],
  }),
  component: TrackOrder,
});

type Stage = { key: string; label: string; icon: any };

const STAGES: Stage[] = [
  { key: "Pending", label: "Order placed", icon: Clock },
  { key: "Paid", label: "Processing", icon: Package },
  { key: "Fulfilled", label: "Shipped", icon: Truck },
  { key: "Delivered", label: "Out for delivery", icon: MapPin },
  { key: "Completed", label: "Delivered", icon: CheckCircle2 },
];

const stageIndex = (status: string) => {
  const map: Record<string, number> = {
    Pending: 0, Paid: 1, Fulfilled: 2, Delivered: 4,
    Refunded: 1, Cancelled: 0,
  };
  return map[status] ?? 0;
};

function TrackOrder() {
  const orders = useAdmin((s) => s.orders);
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const order = submitted ? orders.find((o) => o.id.toLowerCase() === submitted.toLowerCase()) : null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!q.trim()) { setErr("Please enter an order ID"); return; }
    setSubmitted(q.trim());
  };

  const current = order ? stageIndex(order.status) : -1;

  return (
    <section className="container-px mx-auto max-w-3xl py-12 md:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Order tracking</p>
      <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Track your order</h1>
      <p className="mt-2 text-sm text-muted-foreground">Enter your order ID (e.g. <span className="font-mono">PKO-1100</span>) to see the latest status.</p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row" noValidate>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Enter order ID"
            aria-invalid={!!err}
            className={cn(
              "h-12 w-full rounded-full border bg-background pl-10 pr-4 text-sm outline-none focus:ring-1",
              err ? "border-destructive focus:ring-destructive" : "border-input focus:border-brand focus:ring-brand",
            )}
          />
        </div>
        <Button type="submit" variant="hero" size="lg">Track</Button>
      </form>
      {err && <p className="mt-2 text-sm text-destructive">{err}</p>}

      {submitted && !order && (
        <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-center">
          <Package className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-3 font-display text-lg font-semibold">No order found</h2>
          <p className="mt-1 text-sm text-muted-foreground">We couldn't find an order with ID "<span className="font-mono">{submitted}</span>". Double-check your confirmation email.</p>
        </div>
      )}

      {order && (
        <div className="mt-10 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Order</p>
                <p className="font-display text-xl font-bold">{order.id}</p>
                <p className="mt-1 text-sm text-muted-foreground">{order.customer} · {order.date}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Total</p>
                <p className="font-display text-xl font-bold">{formatPrice(order.total)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{order.items} item{order.items > 1 ? "s" : ""}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold">Status timeline</h2>
            <ol className="mt-6 space-y-4">
              {STAGES.map((stage, i) => {
                const reached = i <= current;
                const active = i === current;
                const Icon = stage.icon;
                return (
                  <li key={stage.key} className="flex items-start gap-4">
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      reached ? "border-brand bg-brand text-brand-foreground" : "border-border bg-background text-muted-foreground",
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={cn("font-medium", reached ? "text-foreground" : "text-muted-foreground")}>{stage.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {active ? "In progress" : reached ? "Completed" : "Pending"}
                      </p>
                      {i < STAGES.length - 1 && (
                        <div className={cn("mt-2 ml-[-2.25rem] hidden h-6 w-0.5", reached ? "bg-brand" : "bg-border")} />
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-brand transition-all duration-500"
                style={{ width: `${Math.max(0, (current / (STAGES.length - 1)) * 100)}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-border bg-surface p-5 text-sm text-muted-foreground">
            Need help with this order? <a href="mailto:support@pakovo.com" className="font-semibold text-brand hover:underline">Contact our support team</a>.
          </div>
        </div>
      )}

      {!submitted && (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Demo tip</p>
          <p className="mt-1">Try order IDs <span className="font-mono">PKO-1100</span> through <span className="font-mono">PKO-1087</span> from the seeded data.</p>
        </div>
      )}
    </section>
  );
}
