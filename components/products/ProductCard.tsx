import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-sm text-slate-400">
            No image
          </div>
        )}

        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-violet-600">
          {product.category}
        </p>
        <h3 className="line-clamp-2 font-semibold text-slate-900">
          {product.name}
        </h3>
        <p className="mt-auto pt-2 text-lg font-bold text-slate-900">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
