import { Link } from "@/lib/router-compat";
import { Facebook, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";
import { categories } from "@/data/categories";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-navy text-navy-foreground">
      <div className="container-px mx-auto max-w-7xl py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img src={logo} alt="PakOvo" className="h-12 w-12 object-contain" />
              <span className="font-display text-xl font-bold">PakOvo</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-navy-foreground/70">
              Premium beauty, fashion, home essentials and natural wellness — curated for the modern lifestyle.
            </p>
            <div className="mt-6 flex gap-3">
              <SocialLink href="#" label="Instagram"><Instagram className="h-4 w-4" /></SocialLink>
              <SocialLink href="#" label="Facebook"><Facebook className="h-4 w-4" /></SocialLink>
              <SocialLink href="#" label="YouTube"><Youtube className="h-4 w-4" /></SocialLink>
            </div>
          </div>

          <FooterCol title="Shop">
            {categories.map((c) => (
              <FooterLink key={c.slug} to="/collections/$slug" params={{ slug: c.slug }}>{c.name}</FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Customer Service">
            <FooterLink to="/shop">Shipping</FooterLink>
            <FooterLink to="/shop">Returns</FooterLink>
            <FooterLink to="/shop">FAQs</FooterLink>
            <FooterLink to="/account">My account</FooterLink>
            <FooterLink to="/track">Track order</FooterLink>
            <FooterLink to="/blog">Journal</FooterLink>
          </FooterCol>

          <FooterCol title="Company">
            <FooterLink to="/shop">About us</FooterLink>
            <FooterLink to="/shop">Contact</FooterLink>
            <FooterLink to="/shop">Privacy Policy</FooterLink>
            <FooterLink to="/shop">Terms of Service</FooterLink>
            <FooterLink to="/admin">Admin portal</FooterLink>
          </FooterCol>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-navy-foreground/15 pt-6 text-xs text-navy-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} PakOvo. All rights reserved.</p>
          <p>Secure payments · Worldwide delivery</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-navy-foreground">{title}</h3>
      <ul className="space-y-2.5 text-sm text-navy-foreground/70">{children}</ul>
    </div>
  );
}

function FooterLink({ to, params, children }: { to: any; params?: any; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} params={params} className="transition-colors hover:text-gold">{children}</Link>
    </li>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-navy-foreground/20 transition-colors hover:border-gold hover:text-gold"
    >
      {children}
    </a>
  );
}