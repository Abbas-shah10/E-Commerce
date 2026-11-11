import Link from "next/link";
import { requireAdmin } from "@/lib/guards";
import { connectDB } from "@/lib/db"; // use your own connectDB path
import Order from "@/models/Order";
import User from "@/models/User";
import StatusBadge from "@/components/orders/StatusBadge";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const { status } = await searchParams;
  await connectDB();

  // Only filter if the value is one of the allowed statuses
  const filter = status && STATUSES.includes(status) ? { status } : {};

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .limit(50)
    .populate({ path: "user", model: User, select: "name email" })
    .lean();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Orders</h1>

      {/* Status filter: plain links, the filter lives in the URL */}
      <div className="flex flex-wrap gap-2 text-sm">
        <Link href="/admin/orders" className="rounded border px-3 py-1">
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className="rounded border px-3 py-1 capitalize"
          >
            {s}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="text-slate-500">No orders found.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b text-slate-500">
            <tr>
              <th className="py-2">Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={String(o._id)} className="border-b">
                <td className="py-2">#{String(o._id).slice(-6)}</td>
                <td>{o.user?.email ?? "Deleted user"}</td>
                <td>
                  {o.items.reduce((n: number, i: any) => n + i.quantity, 0)}
                </td>
                <td>${(o.totalCents / 100).toFixed(2)}</td>
                <td>
                  <StatusBadge status={o.status} />
                </td>
                <td>
                  <Link
                    href={`/admin/orders/${String(o._id)}`}
                    className="text-blue-600 px-3 py-2 rounded-md"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
