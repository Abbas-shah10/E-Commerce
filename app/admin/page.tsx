import React from "react";

const stats = [
  {
    label: "Total Revenue",
    value: "$24,780",
    change: "+12.5%",
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Total Orders",
    value: "1,248",
    change: "+8.2%",
    color: "bg-violet-50 text-violet-600",
  },
  {
    label: "New Customers",
    value: "342",
    change: "+5.7%",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Pending",
    value: "18",
    change: "-2.1%",
    color: "bg-amber-50 text-amber-600",
  },
];

const orders = [
  {
    id: "#1048",
    customer: "Olivia Martin",
    date: "Nov 1, 2026",
    amount: "$249.00",
    status: "Completed",
  },
  {
    id: "#1047",
    customer: "Jackson Lee",
    date: "Nov 1, 2026",
    amount: "$189.50",
    status: "Processing",
  },
  {
    id: "#1046",
    customer: "Sophia Brown",
    date: "Oct 31, 2026",
    amount: "$320.00",
    status: "Completed",
  },
  {
    id: "#1045",
    customer: "Noah Wilson",
    date: "Oct 31, 2026",
    amount: "$86.25",
    status: "Pending",
  },
];

const page = () => {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Overview</p>
            <h1 className="mt-1 text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm">
            + New report
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
              >
                <span className="text-lg font-bold">$</span>
              </div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <div className="mt-1 flex items-end justify-between">
                <p className="text-2xl font-bold">{stat.value}</p>
                <span
                  className={`text-xs font-semibold ${stat.change.startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {stat.change}
                </span>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="font-bold">Recent Orders</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Latest customer transactions
                </p>
              </div>
              <button className="text-sm font-semibold text-blue-600">
                View all
              </button>
            </div>
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
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold">{order.id}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{order.date}</td>
                      <td className="px-6 py-4 font-semibold">
                        {order.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            order.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : order.status === "Processing"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold">Sales Overview</h2>
            <p className="mt-1 text-sm text-slate-500">This month</p>
            <div className="mt-8 flex h-44 items-end gap-3">
              {[42, 68, 54, 78, 61, 88, 72, 95, 82, 66, 90, 76].map(
                (height, index) => (
                  <div
                    key={index}
                    className="group flex h-full flex-1 items-end"
                  >
                    <div
                      className="w-full rounded-t-md bg-blue-500 transition-colors group-hover:bg-blue-600"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ),
              )}
            </div>
            <div className="mt-3 flex justify-between text-xs text-slate-400">
              <span>Jan</span>
              <span>Jun</span>
              <span>Dec</span>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
};

export default page;
