
# PakOvo — Premium Ecommerce Platform

A custom React + Tailwind build (no Shopify). The existing TanStack Start template gives us file-based routing, SSR, and a typed server layer — perfect for a fast, SEO-friendly storefront with an admin portal.

## Brand & Design System

- **Primary**: PakOvo green `#22C55E` (from logo)
- **Secondary**: Deep navy `#0F1B3D` (logo wordmark)
- **Accent**: Champagne gold `#C9A84C` for premium touches
- **Neutrals**: White, soft gray surfaces, near-black text
- **Type**: Sora (headings), Inter (body), semibold buttons
- All tokens defined in `src/styles.css` via `@theme` + oklch; no hardcoded colors in components
- Custom shadcn variants (hero, premium, gold) — never inline `text-white` etc.
- Subtle motion: fade/slide on scroll, hover lifts, image zoom

## Architecture

```text
src/routes/
  __root.tsx              header + footer shell, mega menu, splash
  index.tsx               homepage (12 sections)
  shop.tsx                all products
  collections.$slug.tsx   category pages (cosmetics, perfumes, watches, etc.)
  products.$slug.tsx      product detail
  cart.tsx                cart drawer + page
  checkout.tsx            single-page checkout
  wishlist.tsx
  search.tsx
  account/                customer portal (orders, addresses, profile, wishlist)
  admin/                  admin portal (dashboard, products, orders, customers, etc.)
  auth/login, register, reset-password
  sitemap[.]xml.ts
src/components/
  layout/    Header, MegaMenu, Footer, MobileNav, Splash
  product/   ProductCard, ProductGrid, QuickView, Gallery, Variants
  cart/      CartDrawer, LineItem
  home/      Hero, CategoryGrid, NewArrivals, BestSellers, FlashSale, Testimonials, Trust, Newsletter
  ui/        shadcn primitives + custom variants
src/data/    seed products, categories, reviews (100+ items)
src/lib/     cart store (zustand), wishlist store, formatters, SEO helpers
```

## Backend: Lovable Cloud

I'll enable Lovable Cloud for: auth (email + Google), products/orders/customers tables with RLS, admin role via `user_roles` + `has_role()` security-definer, file storage for product images. Admin portal gated by `_authenticated` layout + role check.

For v1 we'll ship with seeded JSON product data so the storefront is fully browsable immediately, and wire DB-backed orders/auth/admin CRUD on top.

## Build Order (phased so you see progress fast)

**Phase 1 — Foundation & Storefront (this turn)**
1. Design tokens, fonts, shadcn variants, splash screen
2. Header with mega menu, mobile bottom nav, footer
3. Homepage: all 12 sections with seeded data + generated hero/category imagery
4. Collection pages with filters/sort
5. Product detail with gallery, variants, related products
6. Cart drawer + cart page (zustand, persisted)
7. Wishlist, recently viewed, search with live suggestions
8. Checkout (single-page, guest + account)
9. SEO: per-route `head()`, JSON-LD product/breadcrumb/FAQ, sitemap, robots

**Phase 2 — Accounts & Admin (next turn, after Phase 1 lands)**
- Enable Lovable Cloud, schema + RLS, auth flows
- Customer portal (orders, addresses, profile)
- Admin portal (dashboard, product/order/customer/discount/banner CRUD, analytics)

## Technical Details

- TanStack Start file routes; never edit `routeTree.gen.ts`
- TanStack Query for data; loader `ensureQueryData` + `useSuspenseQuery`
- Cart/wishlist in zustand with `persist` to localStorage
- Images: AI-generated hero/category banners (premium lifestyle), product images use high-quality placeholders sized for performance, lazy-loaded
- All routes get unique title/description/og tags; product pages get Product JSON-LD
- Mobile-first; sticky add-to-cart on product pages; bottom nav on mobile
- No purple gradients, no generic AI aesthetic — committed to clean luxury

## What I won't do in Phase 1

- Real payments (checkout will be a polished UI flow that records the order; we can wire Stripe later)
- Loyalty points logic, abandoned cart emails, blog CMS — scaffolded UI only, full logic in a later phase
- Compare-products full diff table — link present, deep build later

Reply "go" and I'll start with Phase 1. If you want a different phase ordering (e.g., admin first), say so now.
