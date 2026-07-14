import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, type ComponentType } from "react";
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
import { toast } from "sonner";
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

type RouteModule = {
  _config: {
    component: ComponentType;
  };
};

function renderRoute(route: RouteModule) {
  const Component = route._config.component;
  return <Component />;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectUser);
  const token = Cookies.get("accessToken") || user?.token || null;

  if (!token) {
    dispatch(logout());
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    toast.error("Please login to continue.");
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  let decoded: JwtPayload;

  try {
    decoded = jwtDecode<JwtPayload>(token);
  } catch {
    dispatch(logout());
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    toast.error("Your session is invalid. Please login again.");
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    dispatch(logout());
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    toast.error("Session expired. Please login again.");
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
          <Route path="/" element={renderRoute(IndexRoute)} />
          <Route path="/shop" element={renderRoute(ShopRoute)} />
          <Route path="/search" element={renderRoute(SearchRoute)} />
          <Route path="/cart" element={renderRoute(CartRoute)} />
          <Route path="/wishlist" element={renderRoute(WishlistRoute)} />
          <Route path="/checkout" element={<PrivateRoute>{renderRoute(CheckoutRoute)}</PrivateRoute>} />
          <Route path="/track" element={<PrivateRoute>{renderRoute(TrackRoute)}</PrivateRoute>} />
          <Route path="/account" element={<PrivateRoute>{renderRoute(AccountRoute)}</PrivateRoute>} />
          <Route path="/admin" element={renderRoute(AdminRoute)} />
          <Route path="/blog" element={renderRoute(BlogRoute)} />
          <Route path="/blog/:slug" element={renderRoute(BlogSlugRoute)} />
          <Route path="/auth/login" element={renderRoute(LoginRoute)} />
          <Route path="/auth/forget-password" element={renderRoute(ForgetPasswordRoute)} />
          <Route path="/auth/verify-otp" element={renderRoute(VerifyOtpRoute)} />
          <Route path="/auth/reset-password" element={renderRoute(ResetPasswordRoute)} />
          <Route path="/auth/register" element={renderRoute(RegisterRoute)} />
          <Route path="/collections/:slug" element={renderRoute(CollectionsSlugRoute)} />
          <Route path="/products/:slug" element={renderRoute(ProductSlugRoute)} />
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