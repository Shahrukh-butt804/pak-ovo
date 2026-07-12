export const formatPrice = (n: number) =>
  `Rs ${Math.round(n).toLocaleString("en-PK")}`;

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");