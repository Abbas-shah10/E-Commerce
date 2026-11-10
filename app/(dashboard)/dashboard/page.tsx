import Image from "next/image";
import Link from "next/link";
import { requireUser } from "@/lib/guards";
import { connectDB } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { getCartCount } from "@/app/actions/cart/cart-actions";
import Order from "@/models/Order";
import Product from "@/models/Product";
import StatusBadge from "@/components/orders/StatusBadge";
import QuickAddButton from "@/components/products/QuickAddButton";

export const metadata = { title: "Dashboard" };

const PAGE_SIZE = 8;
const PAID_STATUSES = ["paid", "shipped", "delivered"];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  await connectDB();

  const requestedPage = Math.max(Number(params.page) || 1, 1);
  const totalProducts = await Product.countDocuments();
  const totalPages = Math.max(Math.ceil(totalProducts / PAGE_SIZE), 1);
  const currentPage = Math.min(requestedPage, totalPages);

  const [products, orders, cartCount] = await Promise.all([
    Product.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Order.find({ user: user.id }).sort({ createdAt: -1 }).lean(),
    getCartCount(user.id),
  ]);

  // Stats
  const totalSpentCents = orders
    .filter((o) => PAID_STATUSES.includes(o.status))
    .reduce((sum, o) => sum + o.totalCents, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  // Latest 3 orders as plain objects
  const recentOrders = orders.slice(0, 3).map((o) => ({
    id: String(o._id),
    status: o.status as string,
    totalCents: o.totalCents as number,
    createdAt: new Date(o.createdAt).toISOString(),
    itemCount: o.items.reduce(
      (sum: number, i: { quantity: number }) => sum + i.quantity,
      0,
    ),
  }));

  // Orders per day for the last 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activity = Array.from({ length: 7 }, (_, i) => {
    const start = new Date(today);
    start.setDate(today.getDate() - (6 - i));
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    const count = orders.filter((o) => {
      const created = new Date(o.createdAt);
      return o.status !== "cancelled" && created >= start && created < end;
    }).length;
    return {
      label: start.toLocaleDateString("en-US", { weekday: "narrow" }),
      count,
      isToday: i === 6,
    };
  });
  const maxCount = Math.max(...activity.map((a) => a.count), 1);
  const weekTotal = activity.reduce((sum, a) => sum + a.count, 0);

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-350">
      <header className="mb-7">
        <p className="mb-1 text-sm font-medium text-slate-500">{todayLabel}</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.name}
        </h1>
      </header>

      {/* Stats */}
      <section className="mb-7 grid gap-5 md:grid-cols-3">
        <article className="overflow-hidden rounded-[28px] bg-linear-to-br from-[#7c3aed] to-[#4f46e5] p-6 text-white shadow-xl shadow-violet-200/60">
          <span className="text-sm font-medium text-violet-100">
            Total spent
          </span>
          <p className="mt-10 text-3xl font-bold tracking-tight">
            {formatPrice(totalSpentCents)}
          </p>
          <p className="mt-2 text-sm text-violet-100">
            Paid, shipped and delivered orders
          </p>
        </article>

        <article className="rounded-[28px] border border-white bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Total orders
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-orange-100 text-orange-600">
              ↗
            </span>
          </div>
          <p className="mt-10 text-3xl font-bold">{orders.length}</p>
          <p className="mt-2 text-sm font-medium text-slate-400">
            {pendingCount} pending
          </p>
        </article>

        <article className="rounded-[28px] border border-white bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Items in cart
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              ◆
            </span>
          </div>
          <p className="mt-10 text-3xl font-bold">{cartCount}</p>
          <Link
            href="/cart"
            className="mt-2 inline-block text-sm font-medium text-violet-600"
          >
            View cart →
          </Link>
        </article>
      </section>

      <section className="grid gap-7 xl:grid-cols-[1fr_340px]">
        {/* Products */}
        <div>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-violet-600">
                Explore collection
              </p>
              <h2 className="mt-1 text-2xl font-bold">Latest products</h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-violet-600"
            >
              View all →
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              No products yet.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {products.map((product) => (
                <article
                  key={String(product._id)}
                  className="group rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative mb-4 h-40 overflow-hidden rounded-[18px] bg-slate-50">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          fill
                          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 40vw, 100vw"
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-sm text-slate-400">
                          No image
                        </div>
                      )}
                    </div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {product.category}
                    </p>
                    <h3 className="line-clamp-2 font-bold">{product.title}</h3>
                  </Link>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-violet-600">
                      {formatPrice(Math.round(product.price * 100))}
                    </p>
                    <QuickAddButton
                      productId={String(product._id)}
                      title={product.title}
                      disabled={product.stock <= 0}
                    />
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
                    {product.stock <= 0
                      ? "Out of stock"
                      : `${product.stock} in stock`}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="rounded-[28px] bg-[#181825] p-6 text-white shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">
                Your activity
              </span>
              <span className="text-xs text-violet-300">
                {weekTotal} {weekTotal === 1 ? "order" : "orders"} · 7 days
              </span>
            </div>
            <div className="flex h-36 items-end gap-3 border-b border-white/10 pb-2">
              {activity.map((a, index) => (
                <div key={index} className="flex h-full flex-1 items-end">
                  <div
                    title={`${a.count} ${a.count === 1 ? "order" : "orders"}`}
                    className={`w-full rounded-t-md ${a.isToday ? "bg-violet-500" : "bg-white/15"}`}
                    style={{
                      height: `${Math.max((a.count / maxCount) * 100, 4)}%`,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-[10px] text-slate-500">
              {activity.map((a, index) => (
                <span key={index} className="flex-1 text-center">
                  {a.label}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="font-bold">Recent orders</h3>

            {recentOrders.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                You haven&apos;t placed any orders yet.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {recentOrders.map((o) => (
                  <li key={o.id}>
                    <Link
                      href={`/orders/${o.id}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3 transition hover:border-violet-300"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          Order #{o.id.slice(-6).toUpperCase()}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {new Date(o.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                          {" · "}
                          {o.itemCount} {o.itemCount === 1 ? "item" : "items"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          {formatPrice(o.totalCents)}
                        </p>
                        <StatusBadge status={o.status} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <Link
              href="/orders"
              className="mt-5 block w-full rounded-2xl bg-slate-900 py-3 text-center text-sm font-semibold text-white transition hover:bg-violet-600"
            >
              View all orders
            </Link>
          </div>
        </aside>
      </section>

      {/* Pagination */}
      <nav
        aria-label="Products pagination"
        className="mt-7 flex items-center justify-center gap-4"
      >
        {currentPage > 1 ? (
          <Link
            href={`/dashboard?page=${currentPage - 1}`}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-600"
          >
            ← Previous
          </Link>
        ) : (
          <span className="cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-400">
            ← Previous
          </span>
        )}

        <span className="text-sm font-medium text-slate-500">
          Page {currentPage} of {totalPages}
        </span>

        {currentPage < totalPages ? (
          <Link
            href={`/dashboard?page=${currentPage + 1}`}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-600"
          >
            Next →
          </Link>
        ) : (
          <span className="cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-400">
            Next →
          </span>
        )}
      </nav>
    </div>
  );
}
