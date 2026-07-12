import cosmetics from "@/assets/cat-cosmetics.jpg";
import perfumes from "@/assets/cat-perfumes.jpg";
import watches from "@/assets/cat-watches.jpg";
import bedsheets from "@/assets/cat-bedsheets.jpg";
import curtains from "@/assets/cat-curtains.jpg";
import herbs from "@/assets/cat-herbs.jpg";

export type CategorySlug =
  | "cosmetics"
  | "perfumes"
  | "watches"
  | "bed-sheets"
  | "curtains"
  | "herbs";

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  image: string;
  subcategories: string[];
  seoTitle?: string;
  metaDescription?: string;
}

export const categories: Category[] = [
  {
    slug: "cosmetics",
    name: "Cosmetics",
    tagline: "Beauty, refined",
    description:
      "Discover premium face, lip, eye and skincare essentials curated from the world's most-loved beauty houses.",
    image: cosmetics,
    subcategories: [
      "Face Makeup",
      "Lip Products",
      "Eye Makeup",
      "Skin Care",
      "Beauty Tools",
      "Makeup Sets",
    ],
  },
  {
    slug: "perfumes",
    name: "Perfumes",
    tagline: "Signature scents",
    description:
      "Long-lasting fragrances for him, her and everyone — from fresh daily mists to deep, sensual ouds.",
    image: perfumes,
    subcategories: [
      "Men's Perfumes",
      "Women's Perfumes",
      "Unisex Perfumes",
      "Attar",
      "Body Mists",
      "Gift Sets",
    ],
  },
  {
    slug: "watches",
    name: "Watches",
    tagline: "Time, beautifully kept",
    description:
      "Hand-picked watches — classic dress pieces, modern smartwatches and statement luxury timepieces.",
    image: watches,
    subcategories: [
      "Men's Watches",
      "Women's Watches",
      "Couple Watches",
      "Smart Watches",
      "Luxury Watches",
      "Accessories",
    ],
  },
  {
    slug: "bed-sheets",
    name: "Bed Sheets",
    tagline: "Sleep, elevated",
    description:
      "Soft cotton, percale and sateen bed sheets in calming neutrals and confident prints.",
    image: bedsheets,
    subcategories: [
      "Cotton Bed Sheets",
      "Printed Bed Sheets",
      "Fitted Bed Sheets",
      "Pillow Covers",
      "Duvet Covers",
      "Bed Sets",
    ],
  },
  {
    slug: "curtains",
    name: "Curtains",
    tagline: "Light, your way",
    description:
      "Blackout, sheer and decorative curtains that finish a room with quiet confidence.",
    image: curtains,
    subcategories: [
      "Blackout Curtains",
      "Sheer Curtains",
      "Window Curtains",
      "Door Curtains",
      "Linen Curtains",
      "Accessories",
    ],
  },
  {
    slug: "herbs",
    name: "Herbs & Naturals",
    tagline: "Nature, gathered",
    description:
      "Whole herbs, teas, powders, seeds and pure oils — sourced for purity and packed with care.",
    image: herbs,
    subcategories: [
      "Whole Herbs",
      "Herbal Powders",
      "Herbal Teas",
      "Seeds",
      "Natural Oils",
      "Wellness Blends",
    ],
  },
];

export const findCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);