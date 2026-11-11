import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { requireAdmin } from "@/lib/guards";
import { connectDB } from "@/lib/db"; // use your own connectDB path
import { ALLOWED_NEXT } from "@/lib/order-status";
import Order from "@/models/Order";
import User from "@/models/User";
import StatusBadge from "@/components/orders/StatusBadge";
import OrderStatusSelect from "@/components/layout/admin/OrderStatusSelect";

function formatDate(date?: Date) {
  return date
    ? new Date(date).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();

  await connectDB();
  const order: any = await Order.findById(id)
    .populate({ path: "user", model: User, select: "name email" })
    .lean();
  if (!order) notFound();

  const nextOptions = ALLOWED_NEXT[order.status] ?? [];

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="text-sm text-blue-600">
        ← Back to orders
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Order #{String(order._id).slice(-6)}
          </h1>
          <p className="text-sm text-slate-500">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <section className="rounded-lg border p-4 lg:col-span-2">
          <h2 className="mb-4 font-medium">Items</h2>
          <ul className="divide-y">
            {order.items.map((item: any, index: number) => (
              <li key={index} className="flex items-center gap-4 py-3">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded bg-slate-100" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-slate-500">
                    ${(item.priceCents / 100).toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t pt-4 text-lg font-semibold">
            <span>Total</span>
            <span>${(order.totalCents / 100).toFixed(2)}</span>
          </div>
        </section>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="rounded-lg border p-4">
            <h2 className="mb-3 font-medium">Customer</h2>
            {order.user ? (
              <>
                <p>{order.user.name}</p>
                <p className="text-sm text-slate-500">{order.user.email}</p>
              </>
            ) : (
              <p className="text-sm text-slate-500">
                This user no longer exists.
              </p>
            )}
          </section>

          <section className="rounded-lg border p-4">
            <h2 className="mb-3 font-medium">Update status</h2>
            <OrderStatusSelect
              orderId={String(order._id)}
              current={order.status}
              options={nextOptions}
            />
          </section>

          <section className="rounded-lg border p-4 text-sm">
            <h2 className="mb-3 font-medium">Timeline</h2>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-slate-500">Created</dt>
                <dd>{formatDate(order.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Paid</dt>
                <dd>{formatDate(order.paidAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Last updated</dt>
                <dd>{formatDate(order.updatedAt)}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
