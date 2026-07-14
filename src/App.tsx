import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, type ReactNode } from "react";
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
import { Route as ForgetPasswordRoute } from "@/routes/auth.forgetPassword";
import { Route as VerifyOtpRoute } from "@/routes/auth.verifyotp";
import { Route as ResetPasswordRoute } from "@/routes/auth.resetPassword";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Provider, useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "./redux/reducers/userSlice";
import { store } from "./redux/store";

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

interface JwtPayload {
  exp: number;
  email?: string;
  isAdmin?: boolean;
  [key: string]: any;
}

function PrivateRoute({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectUser);
  const token = Cookies.get("accessToken") || user?.token || null;

  useEffect(() => {
    if (!token) {
      dispatch(logout());
    }
  }, [dispatch, location.pathname, token]);

  if (!token) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  let decoded: JwtPayload;

  try {
    decoded = jwtDecode<JwtPayload>(token);
  } catch {
    dispatch(logout());
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    dispatch(logout());
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

export function App() {
  return (
    <Provider store={store}>
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
          <Route path="/checkout" element={<PrivateRoute><RouteRenderer route={CheckoutRoute} /></PrivateRoute>} />
          <Route path="/track" element={<PrivateRoute><RouteRenderer route={TrackRoute} /></PrivateRoute>} />
          <Route path="/account" element={<PrivateRoute><RouteRenderer route={AccountRoute} /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><RouteRenderer route={AdminRoute} /></PrivateRoute>} />
          <Route path="/blog" element={<RouteRenderer route={BlogRoute} />} />
          <Route path="/blog/:slug" element={<RouteRenderer route={BlogSlugRoute} />} />
          <Route path="/auth/login" element={<RouteRenderer route={LoginRoute} />} />
          <Route path="/auth/forget-password" element={<RouteRenderer route={ForgetPasswordRoute} />} />
          <Route path="/auth/verify-otp" element={<RouteRenderer route={VerifyOtpRoute} />} />
          <Route path="/auth/reset-password" element={<RouteRenderer route={ResetPasswordRoute} />} />
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
    </Provider>
  );
}