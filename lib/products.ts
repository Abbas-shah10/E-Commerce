// lib/products.ts
import { cache } from "react";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export const getProductBySlug = cache(async (slug: string) => {
  await connectDB();
  const p = await Product.findOne({ slug }).lean();
  if (!p) return null;

  return {
    id: String(p._id),
    name: p.name,
    slug: p.slug,
    description: p.description,
    priceCents: p.priceCents,
    stock: p.stock,
    category: p.category,
    imageUrl: p.imageUrl ?? undefined,
  };
});
