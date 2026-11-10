// app/admin/page.tsx
import Link from "next/link";
import { requireAdmin } from "@/lib/guards";
import { connectDB } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import StatusBadge from "@/components/orders/StatusBadge";

export const metadata = { title: "Admin dashboard" };

const PAID_STATUSES = ["paid", "shipped", "delivered"];
const LOW_STOCK_LIMIT = 5;

function change(current: number, previous: number) {
  if (previous === 0) return current === 0 ? null : { label: "New", up: true };
  const pct = ((current - previous) / previous) * 100;
  return { label: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`, up: pct >= 0 };
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  await connectDB();

  // Month boundaries (UTC, so they match MongoDB's $year and $month)
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const startThisMonth = new Date(Date.UTC(y, m, 1));
  const startLastMonth = new Date(Date.UTC(y, m - 1, 1));
  const startWindow = new Date(Date.UTC(y, m - 11, 1));

  const [
    revenueAllTime,
    revenueByMonth,
    totalOrders,
    ordersThisMonth,
    ordersLastMonth,
    pendingCount,
    totalCustomers,
    newCustomersThisMonth,
    newCustomersLastMonth,
    recentOrdersRaw,
    lowStockRaw,
  ] = await Promise.all([
    Order.aggregate([
      { $match: { status: { $in: PAID_STATUSES } } },
      { $group: { _id: null, total: { $sum: "$totalCents" } } },
    ]),
    Order.aggregate([
      {
        $match: {
          status: { $in: PAID_STATUSES },
          createdAt: { $gte: startWindow },
        },
      },
      {
        $group: {
          _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
          total: { $sum: "$totalCents" },
        },
      },
    ]),
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: startThisMonth } }),
    Order.countDocuments({
      createdAt: { $gte: startLastMonth, $lt: startThisMonth },
    }),
    Order.countDocuments({ status: "pending" }),
    User.countDocuments({ role: "customer" }),
    User.countDocuments({
      role: "customer",
      createdAt: { $gte: startThisMonth },
    }),
    User.countDocuments({
      role: "customer",
      createdAt: { $gte: startLastMonth, $lt: startThisMonth },
    }),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate({ path: "user", select: "name email", model: User })
      .lean(),
    Product.find({ stock: { $lte: LOW_STOCK_LIMIT } })
      .sort({ stock: 1 })
      .limit(5)
      .lean(),
  ]);

  // Revenue per month for the last 12 months
  const revenueMap = new Map<string, number>(
    revenueByMonth.map(
      (r: { _id: { y: number; m: number }; total: number }) => [
        `${r._id.y}-${r._id.m}`,
        r.total,
      ],
    ),
  );

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(Date.UTC(y, m - 11 + i, 1));
    return {
      label: d.toLocaleDateString("en-US", {
        month: "narrow",
        timeZone: "UTC",
      }),
      fullLabel: d.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
      cents:
        revenueMap.get(`${d.getUTCFullYear()}-${d.getUTCMonth() + 1}`) ?? 0,
      isCurrent: i === 11,
    };
  });

  const maxCents = Math.max(...months.map((x) => x.cents), 1);
  const revenueThisMonth = months[11].cents;
  const revenueLastMonth = months[10].cents;
  const totalRevenueCents =
    (revenueAllTime[0]?.total as number | undefined) ?? 0;

  const stats = [
    {
      label: "Total revenue",
      value: formatPrice(totalRevenueCents),
      icon: "$",
      color: "bg-blue-50 text-blue-600",
      change: change(revenueThisMonth, revenueLastMonth),
      note: "This month vs last month",
    },
    {
      label: "Total orders",
      value: String(totalOrders),
      icon: "↗",
      color: "bg-violet-50 text-violet-600",
      change: change(ordersThisMonth, ordersLastMonth),
      note: "This month vs last month",
    },
    {
      label: "Customers",
      value: String(totalCustomers),
      icon: "◆",
      color: "bg-emerald-50 text-emerald-600",
      change: change(newCustomersThisMonth, newCustomersLastMonth),
      note: "New signups vs last month",
    },
    {
      label: "Pending orders",
      value: String(pendingCount),
      icon: "!",
      color: "bg-amber-50 text-amber-600",
      change: null,
      note: "",
      href: "/admin/orders",
    },
  ];

  // Plain objects for display
  const recentOrders = recentOrdersRaw.map(
    (o: {
      _id: unknown;
      status: string;
      totalCents: number;
      createdAt: Date;
      user: { name?: string; email?: string } | null;
    }) => ({
      id: String(o._id),
      status: o.status,
      totalCents: o.totalCents,
      createdAt: new Date(o.createdAt).toISOString(),
      customerName: o.user?.name ?? "Deleted user",
      customerEmail: o.user?.email ?? "",
    }),
  );

  const lowStock = lowStockRaw.map(
    (p: { _id: unknown; title: string; stock: number }) => ({
      id: String(p._id),
      title: p.title,
      stock: p.stock,
    }),
  );

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Overview</p>
          <h1 className="mt-1 text-2xl font-bold">Admin dashboard</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-600"
        >
          + Add product
        </Link>
      </header>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
            >
              <span className="text-lg font-bold">{stat.icon}</span>
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <div className="mt-1 flex items-end justify-between">
              <p className="text-2xl font-bold">{stat.value}</p>
              {stat.change && (
                <span
                  className={`text-xs font-semibold ${stat.change.up ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {stat.change.label}
                </span>
              )}
            </div>
            {stat.href ? (
              <Link
                href={stat.href}
                className="mt-2 inline-block text-xs font-semibold text-violet-600"
              >
                Review orders →
              </Link>
            ) : (
              <p className="mt-2 text-xs text-slate-400">{stat.note}</p>
            )}
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Recent orders */}
        <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="font-bold">Recent orders</h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest customer orders
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-sm font-semibold text-violet-600"
            >
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-slate-500">
              No orders yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Order</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="hover:text-violet-600"
                        >
                          #{order.id.slice(-6).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-700">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {order.customerEmail}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {formatPrice(order.totalCents)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <div className="space-y-6">
          {/* Sales overview */}
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold">Sales overview</h2>
            <p className="mt-1 text-sm text-slate-500">
              Revenue per month, last 12 months
            </p>
            <div className="mt-8 flex h-44 items-end gap-2">
              {months.map((month) => (
                <div
                  key={month.fullLabel}
                  className="group flex h-full flex-1 items-end"
                >
                  <div
                    title={`${month.fullLabel}: ${formatPrice(month.cents)}`}
                    className={`w-full rounded-t-md transition-colors ${
                      month.isCurrent
                        ? "bg-violet-500 group-hover:bg-violet-600"
                        : "bg-slate-200 group-hover:bg-slate-300"
                    }`}
                    style={{
                      height: `${Math.max((month.cents / maxCents) * 100, 3)}%`,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2 text-xs text-slate-400">
              {months.map((month) => (
                <span key={month.fullLabel} className="flex-1 text-center">
                  {month.label}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500">
              This month:{" "}
              <span className="font-semibold text-slate-900">
                {formatPrice(revenueThisMonth)}
              </span>
            </p>
          </article>

          {/* Low stock */}
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold">Low stock</h2>
            <p className="mt-1 text-sm text-slate-500">
              {LOW_STOCK_LIMIT} or fewer left
            </p>

            {lowStock.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                All products are well stocked.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-slate-100">
                {lowStock.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="min-w-0 truncate text-sm font-medium hover:text-violet-600"
                    >
                      {p.title}
                    </Link>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        p.stock === 0
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}
