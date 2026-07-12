import { categories, type CategorySlug } from "./categories";
import cosmetics from "@/assets/cat-cosmetics.jpg";
import perfumes from "@/assets/cat-perfumes.jpg";
import watches from "@/assets/cat-watches.jpg";
import bedsheets from "@/assets/cat-bedsheets.jpg";
import curtains from "@/assets/cat-curtains.jpg";
import herbs from "@/assets/cat-herbs.jpg";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  subcategory: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  badge?: "new" | "bestseller" | "sale" | "limited";
  description: string;
  image: string;
  images?: string[];
  variants?: { name: string; options: string[] }[];
  tags: string[];
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
}

const IMG: Record<CategorySlug, string> = {
  cosmetics,
  perfumes,
  watches,
  "bed-sheets": bedsheets,
  curtains,
  herbs,
};

// Convert seed USD-style prices into PKR (rounded). Keeps the model intact
// while making prices feel realistic for a Pakistani storefront.
const TO_PKR = 280;
const toPkr = (n: number) => Math.round((n * TO_PKR) / 50) * 50;

// Every product uses its category's curated hero image — no random /
// placeholder photos. Galleries repeat the same relevant photo so the
// gallery viewer feels coherent while remaining fully offline-safe.
const productImage = (catSlug: CategorySlug, _idx: number) => IMG[catSlug];
const productGallery = (catSlug: CategorySlug, _idx: number) => [IMG[catSlug]];

// Per-category product seed lists — realistic names, prices, subcategories.
const seed: Record<CategorySlug, Array<{
  name: string;
  subcategory: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  badge?: Product["badge"];
  variants?: Product["variants"];
  description?: string;
}>> = {
  cosmetics: [
    { name: "Velvet Matte Lipstick — Rouge", subcategory: "Lip Products", price: 24, compareAt: 32, rating: 4.8, reviews: 412, badge: "bestseller", variants: [{ name: "Shade", options: ["Rouge", "Nude", "Berry", "Coral"] }] },
    { name: "Silk Touch Foundation", subcategory: "Face Makeup", price: 38, rating: 4.7, reviews: 287, variants: [{ name: "Shade", options: ["Porcelain", "Beige", "Sand", "Caramel", "Espresso"] }] },
    { name: "Lash Volume Mascara", subcategory: "Eye Makeup", price: 22, rating: 4.6, reviews: 530, badge: "bestseller" },
    { name: "Hydra Glow Serum 30ml", subcategory: "Skin Care", price: 48, compareAt: 60, rating: 4.9, reviews: 198, badge: "sale" },
    { name: "Brow Sculpt Pencil", subcategory: "Eye Makeup", price: 18, rating: 4.5, reviews: 162, variants: [{ name: "Shade", options: ["Blonde", "Brown", "Dark Brown", "Black"] }] },
    { name: "Vitamin C Brightening Cream", subcategory: "Skin Care", price: 42, rating: 4.7, reviews: 305 },
    { name: "Pro Highlighter Palette", subcategory: "Face Makeup", price: 36, rating: 4.6, reviews: 121, badge: "new" },
    { name: "Liquid Eyeliner — Onyx", subcategory: "Eye Makeup", price: 16, rating: 4.4, reviews: 87 },
    { name: "Lip Plumper Gloss", subcategory: "Lip Products", price: 20, rating: 4.5, reviews: 244 },
    { name: "Rose Clay Face Mask", subcategory: "Skin Care", price: 28, rating: 4.8, reviews: 175 },
    { name: "Soft Blush Powder", subcategory: "Face Makeup", price: 26, rating: 4.6, reviews: 132, variants: [{ name: "Shade", options: ["Peach", "Pink", "Mauve"] }] },
    { name: "Pro Makeup Brush Set (12pc)", subcategory: "Beauty Tools", price: 58, compareAt: 80, rating: 4.7, reviews: 384, badge: "sale" },
    { name: "Setting Mist Hydra Veil", subcategory: "Skin Care", price: 24, rating: 4.5, reviews: 96 },
    { name: "Glow Starter Gift Set", subcategory: "Makeup Sets", price: 96, compareAt: 130, rating: 4.9, reviews: 67, badge: "limited" },
    { name: "Nude Eyeshadow Palette", subcategory: "Eye Makeup", price: 44, rating: 4.7, reviews: 218 },
  ],
  perfumes: [
    { name: "Noir Intense Eau de Parfum 100ml", subcategory: "Men's Perfumes", price: 120, compareAt: 150, rating: 4.9, reviews: 412, badge: "bestseller" },
    { name: "Velvet Rose EDP 75ml", subcategory: "Women's Perfumes", price: 110, rating: 4.8, reviews: 357, badge: "bestseller" },
    { name: "Citrus Bloom Unisex 100ml", subcategory: "Unisex Perfumes", price: 95, rating: 4.6, reviews: 142 },
    { name: "Royal Oud Attar 12ml", subcategory: "Attar", price: 65, rating: 4.9, reviews: 89, badge: "limited" },
    { name: "Vanilla Mist Body Spray", subcategory: "Body Mists", price: 22, rating: 4.5, reviews: 213 },
    { name: "Amber & Musk Discovery Set", subcategory: "Gift Sets", price: 75, rating: 4.7, reviews: 64, badge: "new" },
    { name: "Aqua Marine Pour Homme", subcategory: "Men's Perfumes", price: 88, rating: 4.4, reviews: 102 },
    { name: "Jasmine Nights EDP", subcategory: "Women's Perfumes", price: 105, compareAt: 130, rating: 4.7, reviews: 188, badge: "sale" },
    { name: "Saffron Cedar Attar 6ml", subcategory: "Attar", price: 48, rating: 4.8, reviews: 51 },
    { name: "Wild Fig Body Mist", subcategory: "Body Mists", price: 18, rating: 4.3, reviews: 76 },
    { name: "Black Leather EDP 100ml", subcategory: "Men's Perfumes", price: 135, rating: 4.8, reviews: 144 },
    { name: "Peony Petal EDT 50ml", subcategory: "Women's Perfumes", price: 78, rating: 4.5, reviews: 92 },
    { name: "Signature Trio Gift Set", subcategory: "Gift Sets", price: 145, compareAt: 190, rating: 4.9, reviews: 38, badge: "sale" },
    { name: "Sandalwood Oud Unisex", subcategory: "Unisex Perfumes", price: 99, rating: 4.7, reviews: 73 },
    { name: "Soft Cotton Body Mist", subcategory: "Body Mists", price: 16, rating: 4.4, reviews: 121 },
  ],
  watches: [
    { name: "Heritage Automatic 40mm", subcategory: "Men's Watches", price: 380, compareAt: 480, rating: 4.8, reviews: 142, badge: "bestseller", variants: [{ name: "Strap", options: ["Steel", "Leather", "Mesh"] }] },
    { name: "Mini Bloom 32mm", subcategory: "Women's Watches", price: 220, rating: 4.7, reviews: 98 },
    { name: "Pulse Smartwatch 45mm", subcategory: "Smart Watches", price: 199, compareAt: 260, rating: 4.6, reviews: 412, badge: "sale" },
    { name: "Couple Classic Set", subcategory: "Couple Watches", price: 360, rating: 4.9, reviews: 56, badge: "limited" },
    { name: "Skyline Chronograph", subcategory: "Men's Watches", price: 295, rating: 4.5, reviews: 87 },
    { name: "Rose Gold Bracelet Watch", subcategory: "Women's Watches", price: 245, rating: 4.7, reviews: 134, badge: "bestseller" },
    { name: "Sport Active Smartwatch", subcategory: "Smart Watches", price: 159, rating: 4.4, reviews: 287 },
    { name: "Onyx Dress Watch", subcategory: "Men's Watches", price: 175, rating: 4.5, reviews: 64 },
    { name: "Ivory Pearl Dial 30mm", subcategory: "Women's Watches", price: 198, rating: 4.6, reviews: 71 },
    { name: "Couple Edition Slim", subcategory: "Couple Watches", price: 285, rating: 4.7, reviews: 42 },
    { name: "Titan Diver 200m", subcategory: "Luxury Watches", price: 720, compareAt: 890, rating: 4.9, reviews: 33, badge: "sale" },
    { name: "Heritage Moonphase", subcategory: "Luxury Watches", price: 1200, rating: 5.0, reviews: 18, badge: "limited" },
    { name: "Premium Leather Strap 22mm", subcategory: "Accessories", price: 38, rating: 4.6, reviews: 156 },
    { name: "Watch Travel Roll", subcategory: "Accessories", price: 65, rating: 4.7, reviews: 41 },
    { name: "Minimalist 38mm Quartz", subcategory: "Men's Watches", price: 145, rating: 4.4, reviews: 92, badge: "new" },
  ],
  "bed-sheets": [
    { name: "Egyptian Cotton Sheet Set — King", subcategory: "Cotton Bed Sheets", price: 145, compareAt: 180, rating: 4.8, reviews: 312, badge: "bestseller", variants: [{ name: "Color", options: ["Ivory", "Sand", "Sage", "Charcoal"] }] },
    { name: "Percale Crisp Sheet Set — Queen", subcategory: "Cotton Bed Sheets", price: 118, rating: 4.7, reviews: 198 },
    { name: "Sateen Stripe Sheet Set", subcategory: "Printed Bed Sheets", price: 132, rating: 4.6, reviews: 142 },
    { name: "Botanical Print Duvet Cover", subcategory: "Duvet Covers", price: 98, rating: 4.5, reviews: 87, badge: "new" },
    { name: "Linen Blend Fitted Sheet — King", subcategory: "Fitted Bed Sheets", price: 95, rating: 4.6, reviews: 64 },
    { name: "Hotel Collection Pillowcases (2pc)", subcategory: "Pillow Covers", price: 38, rating: 4.7, reviews: 215 },
    { name: "Soft Bamboo Sheet Set — Queen", subcategory: "Cotton Bed Sheets", price: 138, compareAt: 170, rating: 4.8, reviews: 175, badge: "sale" },
    { name: "Minimal Geo Duvet Set", subcategory: "Bed Sets", price: 165, rating: 4.5, reviews: 51 },
    { name: "Vintage Floral Sheet Set", subcategory: "Printed Bed Sheets", price: 122, rating: 4.4, reviews: 68 },
    { name: "Quilted Bedspread — Queen", subcategory: "Bed Sets", price: 178, rating: 4.6, reviews: 39 },
    { name: "Waffle Texture Pillow Set (4pc)", subcategory: "Pillow Covers", price: 48, rating: 4.6, reviews: 102 },
    { name: "Deep Pocket Fitted — King", subcategory: "Fitted Bed Sheets", price: 78, rating: 4.5, reviews: 144 },
    { name: "Heritage Print Duvet Cover", subcategory: "Duvet Covers", price: 110, rating: 4.7, reviews: 56, badge: "bestseller" },
    { name: "Soft Touch Microfiber Set", subcategory: "Cotton Bed Sheets", price: 64, rating: 4.3, reviews: 287 },
    { name: "Premium 7pc Bed Bundle", subcategory: "Bed Sets", price: 285, compareAt: 360, rating: 4.8, reviews: 47, badge: "sale" },
  ],
  curtains: [
    { name: "Blackout Velvet Curtains (Pair)", subcategory: "Blackout Curtains", price: 145, compareAt: 180, rating: 4.7, reviews: 198, badge: "bestseller", variants: [{ name: "Color", options: ["Charcoal", "Navy", "Olive", "Ivory"] }] },
    { name: "Sheer Linen Panel — Cream", subcategory: "Sheer Curtains", price: 65, rating: 4.6, reviews: 142 },
    { name: "Thermal Blackout Curtain Set", subcategory: "Blackout Curtains", price: 128, rating: 4.7, reviews: 87 },
    { name: "Cotton Window Curtain (Pair)", subcategory: "Window Curtains", price: 78, rating: 4.5, reviews: 102 },
    { name: "Boho Tassel Door Curtain", subcategory: "Door Curtains", price: 58, rating: 4.4, reviews: 64, badge: "new" },
    { name: "Pure Linen Curtain Panel", subcategory: "Linen Curtains", price: 110, rating: 4.8, reviews: 51 },
    { name: "Premium Curtain Rod Set", subcategory: "Accessories", price: 45, rating: 4.6, reviews: 134 },
    { name: "Embroidered Sheer Panel", subcategory: "Sheer Curtains", price: 72, compareAt: 95, rating: 4.5, reviews: 38, badge: "sale" },
    { name: "Heavy Drape Blackout — Long", subcategory: "Blackout Curtains", price: 168, rating: 4.7, reviews: 76 },
    { name: "Modern Geometric Curtain", subcategory: "Window Curtains", price: 84, rating: 4.4, reviews: 49 },
    { name: "Rustic Linen Door Drape", subcategory: "Door Curtains", price: 68, rating: 4.6, reviews: 33 },
    { name: "Soft Voile Sheer (Pair)", subcategory: "Sheer Curtains", price: 56, rating: 4.5, reviews: 121 },
    { name: "Decorative Curtain Tie-backs", subcategory: "Accessories", price: 22, rating: 4.7, reviews: 188 },
    { name: "Stonewashed Linen Panel", subcategory: "Linen Curtains", price: 128, rating: 4.8, reviews: 42, badge: "bestseller" },
    { name: "Mid-Century Window Set", subcategory: "Window Curtains", price: 96, rating: 4.5, reviews: 58 },
  ],
  herbs: [
    { name: "Whole Chamomile Flowers 100g", subcategory: "Whole Herbs", price: 14, rating: 4.8, reviews: 312 },
    { name: "Organic Moringa Powder 250g", subcategory: "Herbal Powders", price: 24, compareAt: 32, rating: 4.7, reviews: 198, badge: "sale" },
    { name: "Calming Sleep Tea Blend", subcategory: "Herbal Teas", price: 18, rating: 4.9, reviews: 412, badge: "bestseller" },
    { name: "Chia Seeds 500g", subcategory: "Seeds", price: 12, rating: 4.6, reviews: 287 },
    { name: "Cold Pressed Argan Oil 50ml", subcategory: "Natural Oils", price: 28, rating: 4.8, reviews: 142 },
    { name: "Daily Wellness Blend", subcategory: "Wellness Blends", price: 32, rating: 4.7, reviews: 87, badge: "new" },
    { name: "Whole Lavender Buds 80g", subcategory: "Whole Herbs", price: 16, rating: 4.7, reviews: 121 },
    { name: "Ashwagandha Root Powder", subcategory: "Herbal Powders", price: 22, rating: 4.6, reviews: 175 },
    { name: "Green Tea Whole Leaf 100g", subcategory: "Herbal Teas", price: 20, rating: 4.7, reviews: 144 },
    { name: "Flax Seeds 500g", subcategory: "Seeds", price: 10, rating: 4.5, reviews: 92 },
    { name: "Pure Rose Hip Oil 30ml", subcategory: "Natural Oils", price: 26, rating: 4.7, reviews: 68 },
    { name: "Energy Boost Herbal Blend", subcategory: "Wellness Blends", price: 28, rating: 4.6, reviews: 51 },
    { name: "Hibiscus Petal Tea", subcategory: "Herbal Teas", price: 16, rating: 4.5, reviews: 102 },
    { name: "Premium Pumpkin Seeds 300g", subcategory: "Seeds", price: 14, rating: 4.7, reviews: 156 },
    { name: "Black Seed Oil 100ml", subcategory: "Natural Oils", price: 34, compareAt: 42, rating: 4.8, reviews: 244, badge: "sale" },
  ],
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const products: Product[] = categories.flatMap((cat) =>
  seed[cat.slug].map((p, idx): Product => ({
    id: `${cat.slug}-${idx + 1}`,
    slug: `${slugify(p.name)}-${idx + 1}`,
    name: p.name,
    category: cat.slug,
    subcategory: p.subcategory,
    price: toPkr(p.price),
    compareAt: p.compareAt ? toPkr(p.compareAt) : undefined,
    rating: p.rating,
    reviews: p.reviews,
    badge: p.badge,
    description:
      p.description ||
      `${p.name} — a thoughtfully sourced ${cat.name.toLowerCase()} essential, crafted for daily premium use. Quality you can feel from the first touch.`,
    image: productImage(cat.slug, idx + 1),
    images: productGallery(cat.slug, idx + 1),
    variants: p.variants,
    tags: [cat.name, p.subcategory],
  })),
);

export const categoryFallbackImage = (slug: CategorySlug) => IMG[slug];

export const findProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const productsByCategory = (slug: string) =>
  products.filter((p) => p.category === slug);

export const bestsellers = () =>
  products.filter((p) => p.badge === "bestseller").slice(0, 12);

export const newArrivals = () =>
  products
    .filter((p) => p.badge === "new" || p.rating >= 4.7)
    .slice(0, 12);

export const onSale = () =>
  products.filter((p) => p.compareAt && p.compareAt > p.price);

export const relatedProducts = (p: Product, n = 4) =>
  products
    .filter((x) => x.category === p.category && x.id !== p.id)
    .slice(0, n);