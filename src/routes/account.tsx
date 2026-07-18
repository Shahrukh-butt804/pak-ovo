import { createFileRoute, Link } from "@/lib/router-compat";
import { useGetMyProfileQuery } from "@/redux/services/profileSlice";
import { Heart, Package, User } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [{ title: "My account — PakOvo" }, { name: "robots", content: "noindex" }],
  }),
  component: Account,
});

const tiles = [
  { icon: Package, label: "My orders", desc: "Track and manage", href: "/track" as const },
  { icon: Heart, label: "Wishlist", desc: "Saved for later", href: "/wishlist" as const },
];

function Account() {
  const { data: profile, isLoading } = useGetMyProfileQuery({});

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <div className="rounded-3xl bg-navy p-8 text-navy-foreground md:p-12">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-brand-foreground">
            <User className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Welcome back</p>
            <h1 className="font-display text-2xl font-bold md:text-3xl">
              Hello, {profile?.fullName || "User"}
            </h1>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat label="Orders" value={profile?.ordersCount || 0} />
          <Stat label="Wishlist" value={profile?.wishlistCount || 0} />
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tiles.map(({ icon: Icon, label, desc, href }) => (
          <Link
            key={label}
            to={href}
            className="group rounded-2xl border border-border bg-card p-6 hover:border-brand transition-colors"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold">{label}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </Link>
        ))}
      </div>

      {/* <button className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive">
        <LogOut className="h-4 w-4" /> Sign out
      </button> */}
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
