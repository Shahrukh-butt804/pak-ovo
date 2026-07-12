import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", priority: "1.0", changefreq: "weekly" as const },
          { path: "/shop", priority: "0.9", changefreq: "daily" as const },
          ...categories.map(c => ({ path: `/collections/${c.slug}`, priority: "0.8", changefreq: "weekly" as const })),
          ...products.map(p => ({ path: `/products/${p.slug}`, priority: "0.7", changefreq: "weekly" as const })),
        ];
        const urls = entries.map(e => `  <url><loc>${BASE_URL}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
