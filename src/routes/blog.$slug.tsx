import { createFileRoute, Link, notFound } from "@/lib/router-compat";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPost,
});

function BlogPost() {
  const { slug } = Route.useParams();
  const post = useAdmin((s) => s.blog).find((p) => p.slug === slug && p.published);
  if (!post) throw notFound();

  const paragraphs = post.content.split(/\n{2,}/).filter(Boolean);

  return (
    <article className="container-px mx-auto max-w-3xl py-12">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> /{" "}
        <Link to="/blog" className="hover:text-foreground">Journal</Link> / {post.title}
      </nav>
      <p className="mt-6 text-xs uppercase tracking-wider text-brand">{post.tags[0] ?? "Journal"}</p>
      <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{post.author} · {post.date}</p>

      <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
        <img src={post.cover} alt={post.title} className="h-full w-full object-cover" />
      </div>

      <div className="prose prose-neutral mt-8 max-w-none">
        {paragraphs.map((p, i) => (
          <p key={i} className="mb-4 text-base leading-relaxed text-foreground/90">{p}</p>
        ))}
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <Link to="/blog" className="text-sm font-semibold text-brand hover:underline">← Back to all articles</Link>
      </div>
    </article>
  );
}