import { Link } from "@tanstack/react-router";
import { categories } from "@/data/categories";

interface MegaMenuProps {
  onNavigate?: () => void;
}

export function MegaMenu({ onNavigate }: MegaMenuProps) {
  return (
    <div className="invisible absolute left-1/2 top-full z-50 w-screen max-w-6xl -translate-x-1/2 translate-y-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
      <div className="mx-4 rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <div className="grid grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div key={cat.slug}>
              <Link
                to="/collections/$slug"
                params={{ slug: cat.slug }}
                onClick={onNavigate}
                className="group/cat flex items-center gap-3 pb-3"
              >
                <div className="h-12 w-12 overflow-hidden rounded-lg">
                  <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-500 group-hover/cat:scale-110" />
                </div>
                <div>
                  <div className="font-display text-sm font-semibold">{cat.name}</div>
                  <div className="text-xs text-muted-foreground">{cat.tagline}</div>
                </div>
              </Link>
              <ul className="space-y-1.5 border-t border-border pt-3">
                {cat.subcategories.slice(0, 5).map((sub) => (
                  <li key={sub}>
                    <Link
                      to="/collections/$slug"
                      params={{ slug: cat.slug }}
                      onClick={onNavigate}
                      className="text-sm text-muted-foreground transition-colors hover:text-brand"
                    >
                      {sub}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}