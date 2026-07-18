import { createFileRoute, Link } from "@/lib/router-compat";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Mail,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/categories";
import { bestsellers, newArrivals, onSale, products } from "@/data/products";
import { ProductRow, ProductGrid } from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import hero from "@/assets/hero-1.jpg";
import bannerBeauty from "@/assets/banner-beauty.jpg";
import bannerHome from "@/assets/banner-home.jpg";
import catCosmetics from "@/assets/cat-cosmetics.jpg";
import catPerfumes from "@/assets/cat-perfumes.jpg";
import catWatches from "@/assets/cat-watches.jpg";
import catBedsheets from "@/assets/cat-bedsheets.jpg";
import catCurtains from "@/assets/cat-curtains.jpg";
import catHerbs from "@/assets/cat-herbs.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PakOvo — Premium Beauty, Perfumes, Watches & Home" },
      {
        name: "description",
        content:
          "Discover premium cosmetics, perfumes, watches, bed sheets, curtains and natural herbs at PakOvo. Free shipping over Rs 5,000.",
      },
      { property: "og:title", content: "PakOvo — Premium Lifestyle Store" },
      {
        property: "og:description",
        content:
          "Beauty, fashion, home essentials and natural wellness in one premium destination.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <CategoryGrid />
      <NewArrivalsSection />
      <BeautyBanner />
      <BestSellersSection />
      <HomeBanner />
      <HerbsSection />
      <FlashSale />
      <Reviews />
      <TrustBar />
      <Newsletter />
    </>
  );
}

function Hero() {
  const slides = [
    {
      img: hero,
      eyebrow: "New season collection",
      title: "Elevate your lifestyle",
      accent: "premium",
    },
    {
      img: catPerfumes,
      eyebrow: "Signature scents",
      title: "Fragrances you'll love",
      accent: "luxury",
    },
    { img: catWatches, eyebrow: "Timepieces", title: "Watches that define", accent: "elegance" },
    { img: catBedsheets, eyebrow: "Home comfort", title: "Sleep, beautifully", accent: "softness" },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [slides.length]);
  const s = slides[idx];
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="container-px mx-auto grid max-w-7xl items-center gap-8 py-8 md:grid-cols-2 md:py-12 lg:py-14">
        <div key={idx} className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" /> {s.eyebrow}
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl lg:text-5xl">
            {s.title} with <span className="text-gold-gradient">{s.accent}</span> products.
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground md:text-base">
            Beauty, fashion, home essentials and natural wellness — curated in one place, delivered
            to your door.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="hero" size="lg" asChild>
              <Link to="/shop">
                Shop Now <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/shop">Explore Categories</Link>
            </Button>
          </div>
          <div className="mt-6 flex items-center gap-6 text-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-brand to-gold"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-gold">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Loved by 25,000+ customers</p>
            </div>
          </div>
          <div className="mt-6 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === idx ? "w-8 bg-brand" : "w-4 bg-border",
                )}
              />
            ))}
          </div>
        </div>
        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="relative aspect-16/10 overflow-hidden rounded-3xl shadow-2xl md:aspect-4/3">
            <img
              key={s.img}
              src={s.img}
              alt={s.title}
              width={1600}
              height={1024}
              className="h-full w-full object-cover animate-fade-up"
            />
          </div>
          <div className="absolute -left-6 -bottom-6 hidden rounded-2xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur md:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 text-brand">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Free express delivery</p>
                <p className="text-xs text-muted-foreground">On orders over Rs 5,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    "New Season Drops",
    "Free Shipping Rs 5,000+",
    "30-Day Returns",
    "Premium Quality",
    "Authentic Brands",
  ];
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div className="border-y border-border bg-navy py-3 text-navy-foreground overflow-hidden">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap text-sm font-medium uppercase tracking-[0.2em]">
        {doubled.map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            {t} <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  link,
  linkText = "View all",
}: {
  eyebrow?: string;
  title: string;
  link?: string;
  linkText?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
        )}
        <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">{title}</h2>
      </div>
      {link && (
        <Link
          to={link as any}
          className="hidden text-sm font-semibold underline-offset-4 hover:underline sm:flex items-center gap-1"
        >
          {linkText} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function CategoryGrid() {
  return (
    <section className="container-px mx-auto max-w-7xl py-16 md:py-24">
      <SectionHeader eyebrow="Shop by category" title="Six worlds, one destination" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {categories.map((c, i) => (
          <Link
            key={c.slug}
            to="/collections/$slug"
            params={{ slug: c.slug }}
            className="group relative overflow-hidden rounded-2xl bg-surface aspect-[4/5]"
          >
            <img
              src={c.image}
              alt={c.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-navy-foreground">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                {c.tagline}
              </p>
              <h3 className="mt-1 font-display text-xl font-bold md:text-2xl">{c.name}</h3>
              <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold opacity-90 group-hover:gap-2 transition-all">
                Shop {c.name} <ArrowRight className="h-4 w-4" />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function NewArrivalsSection() {
  return (
    <section className="container-px mx-auto max-w-7xl py-16 md:py-20">
      <SectionHeader eyebrow="Just landed" title="New arrivals" link="/shop" />
      <ProductRow products={newArrivals().slice(0, 8)} isFromDB={false} />
    </section>
  );
}

function BeautyBanner() {
  const images = [bannerBeauty, catPerfumes, catCosmetics, catHerbs];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % images.length), 5000);
    return () => clearInterval(t);
  }, [images.length]);
  return (
    <section className="container-px mx-auto max-w-7xl py-16">
      <Link
        to="/collections/$slug"
        params={{ slug: "perfumes" }}
        className="relative block overflow-hidden rounded-3xl"
      >
        <img
          key={images[i]}
          src={images[i]}
          alt="Beauty & perfume collection"
          loading="lazy"
          className="h-[320px] w-full object-cover transition-opacity duration-700 md:h-[400px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/40 to-transparent" />
        <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center p-8 md:p-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Beauty & Perfume
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-5xl">
            Signature scents,
            <br />
            everyday luxury.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Discover the season's most coveted fragrances and beauty essentials.
          </p>
          <Button variant="hero" size="lg" className="mt-6 w-fit">
            Shop the collection <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </Link>
    </section>
  );
}

function BestSellersSection() {
  return (
    <section className="bg-surface">
      <div className="container-px mx-auto max-w-7xl py-16 md:py-24">
        <SectionHeader eyebrow="Customer favorites" title="Best sellers" link="/shop" />
        <ProductGrid products={bestsellers().slice(0, 8)} />
      </div>
    </section>
  );
}

function HomeBanner() {
  return (
    <section className="container-px mx-auto max-w-7xl py-16">
      <div className="grid gap-6 md:grid-cols-2">
        <Link
          to="/collections/$slug"
          params={{ slug: "bed-sheets" }}
          className="relative block overflow-hidden rounded-3xl"
        >
          <img
            src={bannerHome}
            alt="Bed sheets"
            loading="lazy"
            className="h-[420px] w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-navy-foreground">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Home Living
            </p>
            <h3 className="mt-1 font-display text-3xl font-bold">Soft. Crisp. Restful.</h3>
            <p className="mt-2 text-navy-foreground/80">Premium bedding for better sleep.</p>
          </div>
        </Link>
        <Link
          to="/collections/$slug"
          params={{ slug: "curtains" }}
          className="relative block overflow-hidden rounded-3xl"
        >
          <img
            src={categories[4].image}
            alt="Curtains"
            loading="lazy"
            className="h-[420px] w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-navy-foreground">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Curtains</p>
            <h3 className="mt-1 font-display text-3xl font-bold">Light, your way.</h3>
            <p className="mt-2 text-navy-foreground/80">Blackout, sheer & decorative.</p>
          </div>
        </Link>
      </div>
    </section>
  );
}

function HerbsSection() {
  const herbsProducts = products.filter((p) => p.category === "herbs").slice(0, 4);
  return (
    <section className="container-px mx-auto max-w-7xl py-16 md:py-24">
      <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
        <div className="md:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Nature, gathered
          </p>
          <h2 className="mt-2 font-display text-4xl font-bold">Herbs & wellness</h2>
          <p className="mt-4 text-muted-foreground">
            Whole herbs, teas, oils and seeds — sourced for purity, packed with care, and crafted to
            fit easily into modern routines.
          </p>
          <Button variant="premium" size="lg" className="mt-6" asChild>
            <Link to="/collections/$slug" params={{ slug: "herbs" }}>
              Shop herbs <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ProductRow products={herbsProducts} isFromDB={false} />
      </div>
    </section>
  );
}

function FlashSale() {
  const sale = onSale().slice(0, 4);
  return (
    <section className="bg-navy text-navy-foreground">
      <div className="container-px mx-auto max-w-7xl py-16 md:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold flex items-center gap-2">
              <Clock className="h-3 w-3" /> Limited time
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">
              Flash sale — up to 30% off
            </h2>
          </div>
          <Countdown />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {sale.map((p) => (
            <Link key={p.id} to="/products/$slug" params={{ slug: p.slug }} className="group">
              <div className="aspect-[4/5] overflow-hidden rounded-xl bg-surface">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-sm font-medium line-clamp-2">{p.name}</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-semibold text-gold">{formatPrice(p.price)}</span>
                {p.compareAt && (
                  <span className="text-xs text-navy-foreground/50 line-through">
                    {formatPrice(p.compareAt)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Countdown() {
  const [t, setT] = useState({ h: 12, m: 34, s: 56 });
  useEffect(() => {
    const i = setInterval(() => {
      setT(({ h, m, s }) => {
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) h = 23;
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(i);
  }, []);
  const cell = (n: number, label: string) => (
    <div className="flex flex-col items-center rounded-xl border border-navy-foreground/15 bg-navy-foreground/5 px-3 py-2 min-w-[60px]">
      <span className="font-display text-xl font-bold tabular-nums">
        {String(n).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-navy-foreground/60">{label}</span>
    </div>
  );
  return (
    <div className="flex gap-2">
      {cell(t.h, "hrs")}
      {cell(t.m, "min")}
      {cell(t.s, "sec")}
    </div>
  );
}

function Reviews() {
  const reviews = [
    {
      name: "Sara Ahmed",
      role: "Beauty Editor",
      text: "PakOvo's lipstick is incredibly pigmented and lasts all day. The packaging feels luxurious — easily my go-to brand now.",
      rating: 5,
    },
    {
      name: "James Lee",
      role: "Verified Buyer",
      text: "Bought the Heritage Automatic watch — beautiful piece, premium feel, fast shipping. Way better than the price suggests.",
      rating: 5,
    },
    {
      name: "Aisha Khan",
      role: "Verified Buyer",
      text: "The Egyptian cotton sheets transformed my bedroom. So soft, true to color, and I love that they wash beautifully.",
      rating: 5,
    },
  ];
  return (
    <section className="container-px mx-auto max-w-7xl py-16 md:py-24">
      <SectionHeader eyebrow="What our customers say" title="Loved by 25,000+ shoppers" />
      <div className="grid gap-6 md:grid-cols-3">
        {reviews.map((r) => (
          <div key={r.name} className="rounded-2xl border border-border bg-card p-7">
            <div className="flex gap-0.5 text-gold">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-4 text-foreground leading-relaxed">"{r.text}"</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand to-gold" />
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: ShieldCheck, label: "Secure payments", sub: "256-bit SSL encryption" },
    { icon: Truck, label: "Fast delivery", sub: "Free over Rs 5,000" },
    { icon: RotateCcw, label: "Easy returns", sub: "30 days, no questions" },
    { icon: Headphones, label: "24/7 support", sub: "We're here to help" },
  ];
  return (
    <section className="bg-surface">
      <div className="container-px mx-auto grid max-w-7xl gap-6 py-12 md:grid-cols-4">
        {items.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-brand">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="container-px mx-auto max-w-7xl py-16">
      <div className="relative overflow-hidden rounded-3xl bg-navy p-8 text-navy-foreground md:p-16">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
        <div className="absolute -left-10 -bottom-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Newsletter</p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              Get 10% off your first order.
            </h2>
            <p className="mt-3 text-navy-foreground/70">
              Be first to know about new drops, members-only sales and styling tips.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-foreground/60" />
              <input
                type="email"
                required
                placeholder="you@email.com"
                className="h-12 w-full rounded-full border border-navy-foreground/15 bg-navy-foreground/10 pl-11 pr-4 text-sm text-navy-foreground placeholder:text-navy-foreground/50 outline-none focus:border-gold"
              />
            </div>
            <Button variant="gold" size="lg" type="submit">
              {submitted ? "Thanks!" : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
