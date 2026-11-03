// app/(public)/products/page.tsx
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductGrid from "@/components/products/ProductGrid";

export default async function ProductsPage() {
  await connectDB();
  const docs = await Product.find().sort({ createdAt: -1 }).lean();

  const products = docs.map((p) => ({
    id: String(p._id),
    name: p.name,
    slug: p.slug,
    priceCents: p.priceCents,
    stock: p.stock,
    category: p.category,
    imageUrl: p.imageUrl ?? undefined,
  }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Products</h1>
      <ProductGrid products={products} />
    </div>
  );
}
