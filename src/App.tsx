import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { RouteRenderer } from "@/lib/router-compat";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Splash } from "@/components/layout/Splash";
import { Toaster } from "@/components/ui/sonner";

import { Route as IndexRoute } from "@/routes/index";
import { Route as ShopRoute } from "@/routes/shop";
import { Route as SearchRoute } from "@/routes/search";
import { Route as CartRoute } from "@/routes/cart";
import { Route as WishlistRoute } from "@/routes/wishlist";
import { Route as CheckoutRoute } from "@/routes/checkout";
import { Route as TrackRoute } from "@/routes/track";
import { Route as AccountRoute } from "@/routes/account";
import { Route as AdminRoute } from "@/routes/admin";
import { Route as BlogRoute } from "@/routes/blog";
import { Route as BlogSlugRoute } from "@/routes/blog.$slug";
import { Route as LoginRoute } from "@/routes/auth.login";
import { Route as RegisterRoute } from "@/routes/auth.register";
import { Route as CollectionsSlugRoute } from "@/routes/collections.$slug";
import { Route as ProductSlugRoute } from "@/routes/products.$slug";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-3 text-muted-foreground">Page not found.</p>
        <a href="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Go home
        </a>
      </div>
    </div>
  );
}

export function App() {
  return (
    <>
      <ScrollToTop />
      <Splash />
      <Header />
      <main className="min-h-[60vh] pb-20 lg:pb-0">
        <Routes>
          <Route path="/" element={<RouteRenderer route={IndexRoute} />} />
          <Route path="/shop" element={<RouteRenderer route={ShopRoute} />} />
          <Route path="/search" element={<RouteRenderer route={SearchRoute} />} />
          <Route path="/cart" element={<RouteRenderer route={CartRoute} />} />
          <Route path="/wishlist" element={<RouteRenderer route={WishlistRoute} />} />
          <Route path="/checkout" element={<RouteRenderer route={CheckoutRoute} />} />
          <Route path="/track" element={<RouteRenderer route={TrackRoute} />} />
          <Route path="/account" element={<RouteRenderer route={AccountRoute} />} />
          <Route path="/admin" element={<RouteRenderer route={AdminRoute} />} />
          <Route path="/blog" element={<RouteRenderer route={BlogRoute} />} />
          <Route path="/blog/:slug" element={<RouteRenderer route={BlogSlugRoute} />} />
          <Route path="/auth/login" element={<RouteRenderer route={LoginRoute} />} />
          <Route path="/auth/register" element={<RouteRenderer route={RegisterRoute} />} />
          <Route path="/collections/:slug" element={<RouteRenderer route={CollectionsSlugRoute} />} />
          <Route path="/products/:slug" element={<RouteRenderer route={ProductSlugRoute} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileBottomNav />
      <CartDrawer />
      <Toaster />
    </>
  );
}