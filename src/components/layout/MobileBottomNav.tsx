import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, ShoppingBag, Heart, User } from "lucide-react";
import { useCart } from "@/lib/cart-store";

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const setCartOpen = useCart((s) => s.setOpen);
  const cartCount = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));

  const isActive = (p: string) => pathname === p;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-5">
        <Item to="/" label="Home" active={isActive("/")}><Home className="h-5 w-5" /></Item>
        <Item to="/search" label="Search" active={isActive("/search")}><Search className="h-5 w-5" /></Item>
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground"
        >
          <ShoppingBag className="h-5 w-5" />
          Cart
          {cartCount > 0 && (
            <span className="absolute right-4 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-foreground">
              {cartCount}
            </span>
          )}
        </button>
        <Item to="/wishlist" label="Saved" active={isActive("/wishlist")}><Heart className="h-5 w-5" /></Item>
        <Item to="/account" label="Account" active={isActive("/account")}><User className="h-5 w-5" /></Item>
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

function Item({ to, label, active, children }: { to: string; label: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${active ? "text-brand" : "text-muted-foreground hover:text-foreground"}`}
    >
      {children}
      {label}
    </Link>
  );
}