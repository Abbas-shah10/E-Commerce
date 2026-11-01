import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Image from "next/image";
import React from "react";

// const products = [
//   {
//     name: "Wireless Headphones",
//     category: "Audio",
//     price: 129.99,
//     stock: 48,
//     color: "bg-violet-100 text-violet-600",
//     icon: "🎧",
//   },
//   {
//     name: "Smart Watch Pro",
//     category: "Wearables",
//     price: 249.99,
//     stock: 32,
//     color: "bg-sky-100 text-sky-600",
//     icon: "⌚",
//   },
//   {
//     name: "Portable Speaker",
//     category: "Audio",
//     price: 89.99,
//     stock: 16,
//     color: "bg-orange-100 text-orange-600",
//     icon: "🔊",
//   },
//   {
//     name: "Mechanical Keyboard",
//     category: "Accessories",
//     price: 159.99,
//     stock: 24,
//     color: "bg-emerald-100 text-emerald-600",
//     icon: "⌨️",
//   },
// ];

const page = async () => {
  await connectDB();
  const products = await Product.find().lean();
  const session = await auth();

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-4 py-5 text-slate-900 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-350">
        <header className="mb-7 flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-slate-500">
              Monday, November 16
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {session?.user?.name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label="Notifications"
              className="relative grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-xl shadow-sm"
            >
              ♡
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-violet-500" />
            </button>
            <div className="grid h-11 w-11 place-items-center rounded-full bg-linear-to-br from-violet-500 to-indigo-700 font-bold text-white shadow-lg shadow-violet-200">
              {session?.user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <section className="mb-7 grid gap-5 md:grid-cols-3">
          <article className="overflow-hidden rounded-[28px] bg-linear-to-br from-[#7c3aed] to-[#4f46e5] p-6 text-white shadow-xl shadow-violet-200/60">
            <div className="mb-10 flex items-center justify-between">
              <span className="text-sm font-medium text-violet-100">
                Total balance
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
                •••
              </span>
            </div>
            <p className="text-3xl font-bold tracking-tight">$24,780.00</p>
            <p className="mt-2 text-sm text-violet-100">
              ↑ 12.5% from last month
            </p>
          </article>

          <article className="rounded-[28px] border border-white bg-white p-6 shadow-sm">
            <div className="mb-10 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Total orders
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-orange-100 text-orange-600">
                ↗
              </span>
            </div>
            <p className="text-3xl font-bold">1,284</p>
            <p className="mt-2 text-sm font-medium text-emerald-500">
              ↑ 8.2% this month
            </p>
          </article>

          <article className="rounded-[28px] border border-white bg-white p-6 shadow-sm">
            <div className="mb-10 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Reward points
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                ◆
              </span>
            </div>
            <p className="text-3xl font-bold">8,450</p>
            <p className="mt-2 text-sm font-medium text-slate-400">
              850 points to next level
            </p>
          </article>
        </section>

        <section className="grid gap-7 xl:grid-cols-[1fr_340px]">
          <div>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-sm font-medium text-violet-600">
                  Explore collection
                </p>
                <h2 className="mt-1 text-2xl font-bold">Popular products</h2>
              </div>
              <button className="text-sm font-semibold text-violet-600">
                View all →
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {products.map((product) => (
                <article
                  key={product.name}
                  className="group rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative mb-4 flex h-40 items-center justify-center overflow-hidden rounded-[18px] bg-slate-50 text-6xl">
                    <span className="transition duration-300 group-hover:scale-110">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={160}
                        height={160}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-sm shadow-sm">
                      ♡
                    </span>
                  </div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {product.category}
                  </p>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold">{product.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-violet-600">
                        ${product.price}
                      </p>
                    </div>
                    <button
                      aria-label={`Add ${product.name} to cart`}
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${product.color} text-xl`}
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
                    <span>Free delivery</span>
                    <span>{product.stock} in stock</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[28px] bg-[#181825] p-6 text-white shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">
                  Your activity
                </span>
                <span className="text-xs text-violet-300">This week⌄</span>
              </div>
              <div className="flex h-36 items-end gap-3 border-b border-white/10 pb-2">
                {[42, 68, 52, 82, 58, 92, 72].map((height, index) => (
                  <div
                    key={index}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className={`w-full rounded-t-md ${index === 5 ? "bg-violet-500" : "bg-white/15"}`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[10px] text-slate-500">
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
                <span>S</span>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="font-bold">Recent purchase</h3>
              <div className="mt-4 flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-violet-50 text-3xl">
                  🎧
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">Wireless Headphones</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Delivered yesterday
                  </p>
                </div>
                <p className="font-bold">$129</p>
              </div>
              <button className="mt-5 w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-violet-600">
                Track order
              </button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
};

export default page;
