import { UPLOADS_URL } from "@/constants/api";
import { useGetAllCategoriesWithSubCategoriesQuery } from "@/redux/services/categorySlice";
import { Link } from "@/lib/router-compat";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

interface MegaMenuProps {
  onNavigate?: () => void;
}

type CategoryWithSubCategories = {
  _id?: string;
  id?: string;
  name?: string;
  slug?: string;
  image?: string;
  subCategories?: Array<{ _id?: string; name?: string; slug?: string }>;
};

export function MegaMenu({ onNavigate }: MegaMenuProps) {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetAllCategoriesWithSubCategoriesQuery({
    page,
    limit: 6,
  });

  const categories = useMemo(() => (data?.docs ?? []) as CategoryWithSubCategories[], [data?.docs]);
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? page;

  const resolveImage = (image?: string) => {
    if (!image) return "";
    return `${UPLOADS_URL}${image.replace(/\\/g, "/")}`;
  };

  return (
    <div className="invisible absolute left-1/2 top-full z-50 w-screen max-w-6xl -translate-x-1/2 translate-y-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
      <div className="mx-4 rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Browse all categories and subcategories</p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(value - 1, 1))}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Previous categories page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((value) => Math.min(value + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Next categories page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {isFetching && categories.length === 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-40 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((cat) => (
              <div key={cat._id ?? cat.slug} className="rounded-xl border border-border/60 bg-background/70 p-4">
                <Link
                  to="/collections/$slug"
                  params={{ slug: cat.slug ?? cat._id ?? "" }}
                  onClick={onNavigate}
                  className="group/cat flex items-center gap-3 pb-3"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={resolveImage(cat.image)}
                      crossOrigin="anonymous"
                      alt={cat.name ?? "Category"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover/cat:scale-110"
                    />
                  </div>
                  <div>
                    <div className="font-display text-sm font-semibold">{cat.name}</div>
                    <div className="text-xs text-muted-foreground">{cat.subCategories?.length ? `${cat.subCategories.length} subcategories` : "Explore collection"}</div>
                  </div>
                </Link>
                <ul className="space-y-1.5 border-t border-border pt-3">
                  {(cat.subCategories ?? []).length > 0 ? (
                    cat.subCategories!.map((sub) => (
                      <li key={sub._id ?? sub.slug}>
                        <Link
                          to="/shop"
                          search={{ category: cat._id ?? cat.slug, cat: cat._id ?? cat.slug, page: 1 }}
                          onClick={onNavigate}
                          className="block text-sm text-muted-foreground transition-colors hover:text-brand"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">No subcategories yet</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}