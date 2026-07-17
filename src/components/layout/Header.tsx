import logo from "@/assets/logo.png";
import { categories } from "@/data/categories";
import { useCart } from "@/lib/cart-store";
import { Link, useNavigate } from "@/lib/router-compat";
import { logout, selectUser } from "@/redux/reducers/userSlice";
import { useLogoutMutation } from "@/redux/services/authSlice";
import { useGetMyCartQuery } from "@/redux/services/cartSlice";
import { useGetMyWishlistQuery } from "@/redux/services/wishlistSlice";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { MegaMenu } from "./MegaMenu";

export function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const setCartOpen = useCart((s) => s.setOpen);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");

  const { data: cart } = useGetMyCartQuery({});
  const { data: wishlist } = useGetMyWishlistQuery({});

  const [logoutuser, { isLoading }] = useLogoutMutation();

  const username = useSelector(selectUser)?.fullName;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate({ to: "/search", search: { q } });
    setMobileOpen(false);
  };

  const handleLogout = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const res: any = await logoutuser({});

    if (res?.data?.success) {
      dispatch(logout());
      toast.success(res?.data?.message || "Operation successful");
      navigate({ to: "/account" });
    } else {
      toast.error(
        res?.error?.data?.message || res?.error?.data?.errors[0].msg || "something went wrong",
      );
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="bg-navy text-navy-foreground">
        <div className="container-px mx-auto flex h-9 max-w-7xl items-center justify-between text-xs">
          <span className="hidden sm:inline">
            Free shipping over Rs 5,000 · 30-day easy returns
          </span>
          <div className="flex items-center gap-4">
            {username ? (
              <>
                <Link to="/account" className="hover:text-gold transition-colors">
                  My Account
                </Link>
                <Button disabled={isLoading} size="sm" variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/auth/login" className="hover:text-gold transition-colors">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container-px mx-auto flex justify-between h-20 max-w-7xl items-center gap-6">
        <button
          className="lg:hidden -ml-2 p-2"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="PakOvo"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
          <span className="hidden font-display text-lg font-bold tracking-tight sm:inline">
            <span className="text-brand">Pak</span>
            <span className="text-navy">Ovo</span>
          </span>
        </Link>

        {/* <form onSubmit={submit} className="relative ml-auto hidden max-w-md flex-1 lg:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="search"
            placeholder="Search cosmetics, perfumes, watches..."
            className="h-11 w-full rounded-full border border-input bg-secondary/50 pl-10 pr-4 text-sm outline-none transition-colors focus:border-brand focus:bg-background"
          />
        </form> */}

        <nav className="ml-auto flex items-center gap-1 lg:ml-2">
          <Link
            to="/search"
            aria-label="Search"
            className="lg:hidden p-2 hover:text-brand transition-colors"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative p-2 hover:text-brand transition-colors"
          >
            <Heart className="h-5 w-5" />
            {wishlist?.products?.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-gold-foreground">
                {wishlist?.products?.length || 0}
              </span>
            )}
          </Link>
          <Link
            to="/account"
            aria-label="Account"
            className="hidden p-2 hover:text-brand transition-colors sm:block"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Cart"
            className="relative p-2 hover:text-brand transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            {cart?.products?.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-foreground">
                {cart?.products?.length || 0}
              </span>
            )}
          </button>
        </nav>
      </div>

      <div className="hidden border-t border-border lg:block relative">
        <div className="container-px mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3 text-sm font-medium xl:gap-x-8">
          <Link to="/" className="hover:text-brand transition-colors">
            Home
          </Link>
          <div className="group">
            <Link to="/shop" className="flex items-center gap-1 hover:text-brand transition-colors">
              Shop
            </Link>
            <MegaMenu />
          </div>
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/collections/$slug"
              params={{ slug: c.slug }}
              className="hover:text-brand transition-colors"
            >
              {c.name}
            </Link>
          ))}
          <Link to="/blog" className="hover:text-brand transition-colors">
            Journal
          </Link>
          <Link
            to="/shop"
            search={{ filter: "sale" }}
            className="text-destructive font-semibold hover:opacity-80 transition-opacity"
          >
            Sale
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-background p-6">
            <div className="mb-6 flex items-center justify-between">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                <img src={logo} alt="PakOvo" className="h-10 w-10 object-contain" />
                <span className="font-display text-lg font-bold">
                  <span className="text-brand">Pak</span>
                  <span className="text-navy">Ovo</span>
                </span>
              </Link>
              <button aria-label="Close" onClick={() => setMobileOpen(false)} className="p-2">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={submit} className="relative mb-6">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="search"
                placeholder="Search..."
                className="h-11 w-full rounded-full border border-input bg-secondary/50 pl-10 pr-4 text-sm outline-none focus:border-brand focus:bg-background"
              />
            </form>
            <nav className="space-y-1">
              <MobileLink to="/" onClick={() => setMobileOpen(false)}>
                Home
              </MobileLink>
              <MobileLink to="/shop" onClick={() => setMobileOpen(false)}>
                Shop all
              </MobileLink>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to="/collections/$slug"
                  params={{ slug: c.slug }}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-medium hover:bg-secondary"
                >
                  {c.name}
                </Link>
              ))}
              <MobileLink to="/wishlist" onClick={() => setMobileOpen(false)}>
                Wishlist
              </MobileLink>
              <MobileLink to="/blog" onClick={() => setMobileOpen(false)}>
                Journal
              </MobileLink>
              <MobileLink to="/account" onClick={() => setMobileOpen(false)}>
                My account
              </MobileLink>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileLink({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block rounded-lg px-3 py-3 text-base font-medium hover:bg-secondary"
    >
      {children}
    </Link>
  );
}
