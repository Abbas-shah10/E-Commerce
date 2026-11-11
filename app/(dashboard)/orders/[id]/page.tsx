import { connectDB } from "@/lib/db";
import React from "react";
import { isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";
import Order from "@/models/Order";
import { requireUser } from "@/lib/guards";
import Link from "next/link";
import StatusBadge from "@/components/orders/StatusBadge";
import Image from "next/image";

function formatDate(date?: Date) {
  return date
    ? new Date(date).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const user = await requireUser();
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();

  await connectDB();

  const order = await Order.findOne({ _id: id, user: user.id }).lean();
  if (!order) return notFound();

  return (
    <div className="space-y-6">
      <Link className="text-sm text-blue-600" href={`/orders`}>
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
    </div>
  );
};

export default page;
