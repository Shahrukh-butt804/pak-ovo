import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, MapPin, CreditCard, Heart, Bell, LogOut, User, Award } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My account — PakOvo" }, { name: "robots", content: "noindex" }] }),
  component: Account,
});

const tiles = [
  { icon: Package, label: "My orders", desc: "Track and manage", href: "/account" as const },
  { icon: Heart, label: "Wishlist", desc: "Saved for later", href: "/wishlist" as const },
  { icon: MapPin, label: "Addresses", desc: "Shipping & billing", href: "/account" as const },
  { icon: CreditCard, label: "Payment methods", desc: "Cards on file", href: "/account" as const },
  { icon: Bell, label: "Notifications", desc: "Updates & deals", href: "/account" as const },
  { icon: Award, label: "Rewards", desc: "1,240 points", href: "/account" as const },
];

function Account() {
  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <div className="rounded-3xl bg-navy p-8 text-navy-foreground md:p-12">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-brand-foreground">
            <User className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Welcome back</p>
            <h1 className="font-display text-2xl font-bold md:text-3xl">Hello, Sara</h1>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat label="Orders" value="12" />
          <Stat label="Reward points" value="1,240" />
          <Stat label="Wishlist" value="8" />
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tiles.map(({ icon: Icon, label, desc, href }) => (
          <Link key={label} to={href} className="group rounded-2xl border border-border bg-card p-6 hover:border-brand transition-colors">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand"><Icon className="h-5 w-5" /></div>
            <h3 className="mt-4 font-semibold">{label}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold">Recent orders</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="p-4">Order</th><th className="p-4">Date</th><th className="p-4">Total</th><th className="p-4">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { id: "PKO-1041", date: "Jun 9, 2026", total: "$148.50", status: "Delivered" },
                { id: "PKO-1029", date: "May 22, 2026", total: "$72.00", status: "In transit" },
                { id: "PKO-1017", date: "May 4, 2026", total: "$240.00", status: "Delivered" },
              ].map(o => (
                <tr key={o.id}>
                  <td className="p-4 font-medium">{o.id}</td>
                  <td className="p-4 text-muted-foreground">{o.date}</td>
                  <td className="p-4">{o.total}</td>
                  <td className="p-4"><span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <button className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive">
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 p-4">
      <p className="text-xs uppercase tracking-wider text-navy-foreground/60">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
