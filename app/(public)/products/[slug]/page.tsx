import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/products/AddToCartButton";
import { auth } from "@/lib/auth";

type Props = { params: Promise<{ slug: string }> }; // a Promise in newer Next.js

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description.slice(0, 155),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const session = await auth();
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div>
      <Link
        href="/products"
        className="text-sm font-medium text-slate-500 hover:text-violet-600"
      >
        ← Back to products
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2 lg:gap-12">
        <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-slate-400">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-xs font-medium uppercase tracking-wide text-violet-600">
            {product.category}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl font-bold">
            {formatPrice(product.price)}
          </p>

          <p className="mt-2 text-sm">
            {outOfStock ? (
              <span className="font-medium text-red-600">Out of stock</span>
            ) : lowStock ? (
              <span className="font-medium text-amber-600">
                Only {product.stock} left
              </span>
            ) : (
              <span className="font-medium text-emerald-600">In stock</span>
            )}
          </p>

          <p className="mt-6 whitespace-pre-line leading-7 text-slate-600">
            {product.description}
          </p>

          {/* Step 5 replaces this disabled button with a real AddToCartButton */}
          <AddToCartButton
            productId={product.id}
            outOfStock={outOfStock}
            isLoggedIn={!!session?.user}
          />
        </div>
      </div>
    </div>
  );
}
