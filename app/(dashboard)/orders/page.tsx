import Link from "next/link";
import { requireUser } from "@/lib/guards";
import { connectDB } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Order from "@/models/Order";
import StatusBadge from "@/components/orders/StatusBadge";

export const metadata = { title: "My orders" };

export default async function OrdersPage() {
  const user = await requireUser();
  await connectDB();

  const orders = await Order.find({ user: user.id })
    .sort({ createdAt: -1 })
    .lean();

  const orderList = orders.map((order) => ({
    id: String(order._id),
    status: order.status,
    createdAt: new Date(order.createdAt).toISOString(),
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    totalCents: order.totalCents,
  }));

  if (orderList.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">No orders yet</h1>
        <p className="mt-2 text-slate-500">
          You haven&apos;t placed any orders yet.
        </p>
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My orders</h1>
        <p className="mt-1 text-sm text-slate-500">
          {orderList.length} {orderList.length === 1 ? "order" : "orders"}
        </p>
      </div>

      <ul className="space-y-3">
        {orderList.map((o) => (
          <li key={o.id}>
            <Link
              href={`/orders/${o.id}`}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-violet-300 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <p className="font-semibold">
                    Order #{o.id.slice(-6).toUpperCase()}
                  </p>
                  <StatusBadge status={o.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {new Date(o.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  {" · "}
                  {o.itemCount} {o.itemCount === 1 ? "item" : "items"}
                </p>
              </div>

              <div className="flex items-center justify-between gap-6 sm:justify-end">
                <p className="text-lg font-bold">{formatPrice(o.totalCents)}</p>
                <span className="text-sm font-medium text-violet-600">
                  View details →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
