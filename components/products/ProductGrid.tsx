import ProductCard, { type ProductCardData } from "./ProductCard";

export default function ProductGrid({
  products,
}: {
  products: ProductCardData[];
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
