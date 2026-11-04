import Image from "next/image";
import Link from "next/link";
import { requireUser } from "@/lib/guards";
import { connectDB } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import RemoveButton from "@/components/cart/RemoveButton";
import QuantityControl from "@/components/cart/QuantityControl";

export const metadata = { title: "Your cart" };

type PopulatedProduct = {
  _id: unknown;
  title: string;
  slug: string;
  price: number;
  stock: number;
  imageUrl?: string;
} | null;

export default async function CartPage() {
  const user = await requireUser();
  await connectDB();

  const cart = await Cart.findOne({ user: user.id })
    .populate({ path: "items.product", model: Product })
    .lean();

  const rawItems = (cart?.items ?? []) as {
    product: PopulatedProduct;
    quantity: number;
  }[];

  // Plain objects only; skip products an admin has deleted
  const items = rawItems.flatMap(({ product, quantity }) =>
    product
      ? [
          {
            productId: String(product._id),
            title: product.title,
            slug: product.slug,
            price: product.price,
            stock: product.stock,
            imageUrl: product.imageUrl,
            quantity,
          },
        ]
      : [],
  );
  const removedCount = rawItems.length - items.length;
  const totalCents = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const hasProblem = items.some((i) => i.quantity > i.stock);

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        {removedCount > 0 && (
          <p className="mt-2 text-sm text-amber-600">
            Some items were removed because they are no longer available.
          </p>
        )}
        <Link
          href="/products"
          className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-600"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Your cart</h1>

      {removedCount > 0 && (
        <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
          Some items were removed because they are no longer available.
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"
            >
              <Link
                href={`/products/${item.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100"
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <span className="grid h-full place-items-center text-xs text-slate-400">
                    No image
                  </span>
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      className="line-clamp-2 font-semibold hover:text-violet-600"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-slate-500">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                  <p className="font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>

                {item.quantity > item.stock && (
                  <p className="text-sm font-medium text-red-600">
                    {item.stock === 0
                      ? "Out of stock. Please remove this item."
                      : `Only ${item.stock} left. Please lower the quantity.`}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between">
                  <QuantityControl
                    productId={item.productId}
                    quantity={item.quantity}
                    stock={item.stock}
                  />
                  <RemoveButton productId={item.productId} />
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="mt-4 flex justify-between text-sm text-slate-600">
            <span>Items</span>
            <span>{items.reduce((n, i) => n + i.quantity, 0)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-slate-100 pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(totalCents)}</span>
          </div>

          {/* Step 6 (Stripe) makes this button work */}
          <button
            disabled
            className="mt-6 w-full rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white opacity-50"
          >
            {hasProblem
              ? "Fix your cart to continue"
              : "Checkout (coming next)"}
          </button>
        </aside>
      </div>
    </div>
  );
}
