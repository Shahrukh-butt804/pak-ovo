import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as seedProducts, type Product } from "@/data/products";
import type { CategorySlug } from "@/data/categories";
import { categories as seedCategoriesData } from "@/data/categories";

export interface AdminProduct extends Product {
  stock: number;
  active: boolean;
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  items: number;
  status: "Pending" | "Paid" | "Fulfilled" | "Delivered" | "Refunded" | "Cancelled";
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  joined: string;
  orders: number;
  spent: number;
}

export interface AdminBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  active: boolean;
}

export interface AdminCategory {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  subcategories: string[];
  seoTitle?: string;
  metaDescription?: string;
}

export interface CmsContent {
  heroTitle: string;
  heroSubtitle: string;
  newsletterTitle: string;
  footerTagline: string;
  shippingThreshold: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  author: string;
  date: string;
  tags: string[];
  published: boolean;
  seoTitle?: string;
  metaDescription?: string;
}

interface AdminState {
  products: AdminProduct[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  banners: AdminBanner[];
  categories: AdminCategory[];
  cms: CmsContent;
  blog: BlogPost[];
  addProduct: (p: Omit<AdminProduct, "id">) => void;
  bulkAddProducts: (rows: Omit<AdminProduct, "id">[]) => number;
  updateProduct: (id: string, patch: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: AdminOrder["status"]) => void;
  deleteOrder: (id: string) => void;
  deleteCustomer: (id: string) => void;
  addBanner: (b: Omit<AdminBanner, "id">) => void;
  updateBanner: (id: string, patch: Partial<AdminBanner>) => void;
  deleteBanner: (id: string) => void;
  addCategory: (c: AdminCategory) => void;
  updateCategory: (slug: string, patch: Partial<AdminCategory>) => void;
  deleteCategory: (slug: string) => void;
  updateCms: (patch: Partial<CmsContent>) => void;
  addPost: (p: Omit<BlogPost, "id">) => void;
  updatePost: (id: string, patch: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  reset: () => void;
}

const seedOrders = (): AdminOrder[] => {
  const statuses: AdminOrder["status"][] = ["Pending", "Paid", "Fulfilled", "Delivered", "Refunded"];
  const names = ["Olivia Park", "Marcus Tan", "Aisha Khan", "Daniel Reed", "Sara Ahmed", "James Lee", "Mira Patel", "Owen Brooks"];
  return Array.from({ length: 14 }, (_, i) => ({
    id: `PKO-${1100 - i}`,
    customer: names[i % names.length],
    email: names[i % names.length].toLowerCase().replace(" ", ".") + "@example.com",
    date: new Date(Date.now() - i * 86400000 * 2).toISOString().slice(0, 10),
    total: Math.round((50 + Math.random() * 300) * 100) / 100,
    items: 1 + Math.floor(Math.random() * 5),
    status: statuses[i % statuses.length],
  }));
};

const seedCustomers = (): AdminCustomer[] => {
  const names = ["Olivia Park", "Marcus Tan", "Aisha Khan", "Daniel Reed", "Sara Ahmed", "James Lee", "Mira Patel", "Owen Brooks", "Lana Cruz", "Yuki Tan"];
  return names.map((n, i) => ({
    id: `CUS-${2000 + i}`,
    name: n,
    email: n.toLowerCase().replace(" ", ".") + "@example.com",
    joined: new Date(Date.now() - i * 86400000 * 30).toISOString().slice(0, 10),
    orders: 1 + Math.floor(Math.random() * 12),
    spent: Math.round((100 + Math.random() * 2400) * 100) / 100,
  }));
};

const seedBanners = (): AdminBanner[] => [
  { id: "b1", title: "New season collection", subtitle: "Up to 30% off select beauty", image: "/banner-beauty.jpg", active: true },
  { id: "b2", title: "Home essentials", subtitle: "Soft cotton sheets & curtains", image: "/banner-home.jpg", active: true },
];

const defaultCms: CmsContent = {
  heroTitle: "Elevate your lifestyle with premium products.",
  heroSubtitle: "Beauty, fashion, home essentials and natural wellness — curated in one place.",
  newsletterTitle: "Get 10% off your first order.",
  footerTagline: "Premium beauty, fashion, home essentials and natural wellness — curated for the modern lifestyle.",
  shippingThreshold: 5000,
};

const seedCategories = (): AdminCategory[] =>
  seedCategoriesData.map((c) => ({
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    description: c.description,
    image: c.image,
    subcategories: [...c.subcategories],
  }));

const seedBlog = (): BlogPost[] => [
  {
    id: "post-1",
    slug: "5-must-have-fragrances-for-2026",
    title: "5 Must-Have Fragrances for 2026",
    excerpt: "From smoky oud to bright citrus — the scents defining the season.",
    content:
      "A well-chosen fragrance is the finishing touch of any outfit. This season we're leaning into rich oud, warm amber, and bright citrus openings that carry beautifully through the day.\n\nOur editors picked five bottles worth adding to your shelf, spanning day-wear and evening statements.",
    cover: "/banner-beauty.jpg",
    author: "PakOvo Editors",
    date: new Date().toISOString().slice(0, 10),
    tags: ["Perfumes", "Trends"],
    published: true,
  },
  {
    id: "post-2",
    slug: "how-to-style-your-bedroom-in-cotton",
    title: "How to Style Your Bedroom in Pure Cotton",
    excerpt: "A calming, layered look starts with the right sheets.",
    content:
      "Pure cotton bedding is the fastest upgrade for a restful bedroom. Start with a crisp fitted sheet, layer a percale flat, and finish with a soft duvet in a neutral tone.",
    cover: "/banner-home.jpg",
    author: "PakOvo Editors",
    date: new Date(Date.now() - 86400000 * 4).toISOString().slice(0, 10),
    tags: ["Home", "Bedroom"],
    published: true,
  },
];

export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      products: seedProducts.map((p) => ({ ...p, stock: 20 + Math.floor(Math.random() * 80), active: true })),
      orders: seedOrders(),
      customers: seedCustomers(),
      banners: seedBanners(),
      categories: seedCategories(),
      cms: defaultCms,
      blog: seedBlog(),
      addProduct: (p) =>
        set((s) => ({
          products: [{ ...p, id: `sku-${Date.now().toString(36)}` }, ...s.products],
        })),
      bulkAddProducts: (rows) => {
        let added = 0;
        set((s) => {
          const next = rows.map((r) => {
            added++;
            return { ...r, id: `sku-${Date.now().toString(36)}-${added}` };
          });
          return { products: [...next, ...s.products] };
        });
        return added;
      },
      updateProduct: (id, patch) =>
        set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      updateOrderStatus: (id, status) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
      deleteOrder: (id) => set((s) => ({ orders: s.orders.filter((o) => o.id !== id) })),
      deleteCustomer: (id) => set((s) => ({ customers: s.customers.filter((c) => c.id !== id) })),
      addBanner: (b) => set((s) => ({ banners: [...s.banners, { ...b, id: `b-${Date.now().toString(36)}` }] })),
      updateBanner: (id, patch) =>
        set((s) => ({ banners: s.banners.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),
      deleteBanner: (id) => set((s) => ({ banners: s.banners.filter((b) => b.id !== id) })),
      addCategory: (c) =>
        set((s) => {
          if (s.categories.some((x) => x.slug === c.slug)) return s;
          return { categories: [...s.categories, c] };
        }),
      updateCategory: (slug, patch) =>
        set((s) => ({ categories: s.categories.map((c) => (c.slug === slug ? { ...c, ...patch } : c)) })),
      deleteCategory: (slug) => set((s) => ({ categories: s.categories.filter((c) => c.slug !== slug) })),
      updateCms: (patch) => set((s) => ({ cms: { ...s.cms, ...patch } })),
      addPost: (p) =>
        set((s) => ({ blog: [{ ...p, id: `post-${Date.now().toString(36)}` }, ...s.blog] })),
      updatePost: (id, patch) =>
        set((s) => ({ blog: s.blog.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),
      deletePost: (id) => set((s) => ({ blog: s.blog.filter((b) => b.id !== id) })),
      reset: () =>
        set({
          products: seedProducts.map((p) => ({ ...p, stock: 20 + Math.floor(Math.random() * 80), active: true })),
          orders: seedOrders(),
          customers: seedCustomers(),
          banners: seedBanners(),
          categories: seedCategories(),
          cms: defaultCms,
          blog: seedBlog(),
        }),
    }),
    { name: "pakovo-admin", version: 3 },
  ),
);

// CSV helpers
export function parseCsv(text: string): Record<string, string>[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n").filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const split = (line: string) => {
    const out: string[] = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (ch === "," && !inQ) {
        out.push(cur); cur = "";
      } else cur += ch;
    }
    out.push(cur);
    return out.map((s) => s.trim());
  };
  const headers = split(lines[0]).map((h) => h.toLowerCase());
  return lines.slice(1).map((l) => {
    const cells = split(l);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row;
  });
}

export interface ImportValidation {
  valid: Omit<AdminProduct, "id">[];
  errors: string[];
  warnings: string[];
}

const validCats: CategorySlug[] = ["cosmetics", "perfumes", "watches", "bed-sheets", "curtains", "herbs"];

export function validateProductRows(rows: Record<string, string>[], fallbackImage: string): ImportValidation {
  const valid: Omit<AdminProduct, "id">[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  rows.forEach((r, i) => {
    const rowNum = i + 2;
    const name = r.name?.trim();
    const priceNum = Number(r.price);
    const cat = (r.category?.trim() as CategorySlug) || "cosmetics";
    if (!name) { errors.push(`Row ${rowNum}: name is required`); return; }
    if (!Number.isFinite(priceNum) || priceNum < 0) { errors.push(`Row ${rowNum}: invalid price "${r.price}"`); return; }
    if (!validCats.includes(cat)) { warnings.push(`Row ${rowNum}: unknown category "${r.category}", defaulting to cosmetics`); }
    const stock = Number(r.stock);
    valid.push({
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + i,
      name,
      category: validCats.includes(cat) ? cat : "cosmetics",
      subcategory: r.subcategory?.trim() || "General",
      price: priceNum,
      compareAt: r.compareat ? Number(r.compareat) : undefined,
      rating: r.rating ? Number(r.rating) : 4.5,
      reviews: r.reviews ? Number(r.reviews) : 0,
      description: r.description?.trim() || `${name} — premium quality, curated for daily use.`,
      image: r.image?.trim() || fallbackImage,
      tags: [cat, r.subcategory || "General"],
      stock: Number.isFinite(stock) ? stock : 25,
      active: true,
    });
  });
  return { valid, errors, warnings };
}

export const productCsvTemplate = `name,category,subcategory,price,compareAt,stock,rating,reviews,description,image
Sample Lipstick,cosmetics,Lip Products,24,32,50,4.7,120,Premium matte lipstick with long-lasting color,
Sample Watch,watches,Men's Watches,189,,15,4.8,42,Stainless steel automatic watch,
`;