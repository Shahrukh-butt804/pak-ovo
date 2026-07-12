import { createFileRoute, Link } from "@tanstack/react-router";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Journal — PakOvo" },
      { name: "description", content: "Editor picks, trends and how-tos from PakOvo." },
      { property: "og:title", content: "Journal — PakOvo" },
      { property: "og:description", content: "Editor picks, trends and how-tos from PakOvo." },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

function Blog() {
  const posts = useAdmin((s) => s.blog).filter((p) => p.published);
  return (
    <div className="container-px mx-auto max-w-7xl py-12">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> / Journal
      </nav>
      <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">The Journal</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">Stories, guides and edits from the PakOvo team.</p>

      {posts.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-muted-foreground">
          New articles are on the way.
        </p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.id}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img src={p.cover} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-wider text-brand">{p.tags[0] ?? "Journal"}</p>
                <h2 className="mt-1 font-display text-lg font-semibold leading-tight">{p.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
                <p className="mt-3 text-xs text-muted-foreground">{p.author} · {p.date}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}