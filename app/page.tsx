import { connection } from "next/server";
import { auth } from "@/lib/auth";
import Link from "next/link";
export default async function Home() {
  connection();
  const session = await auth();
  const products = [
    {
      name: "Cloud Runner",
      category: "Sneakers",
      price: "$128",
      color: "bg-orange-50",
      image: "👟",
    },
    {
      name: "Studio Headphones",
      category: "Audio",
      price: "$249",
      color: "bg-stone-100",
      image: "🎧",
    },
    {
      name: "Classic Watch",
      category: "Accessories",
      price: "$189",
      color: "bg-blue-50",
      image: "⌚",
    },
    {
      name: "Everyday Bag",
      category: "Bags",
      price: "$96",
      color: "bg-amber-50",
      image: "👜",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#171717]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="#" className="text-xl font-black tracking-tight">
          NOVA<span className="text-orange-500">.</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="#new" className="transition hover:text-orange-500">
            New arrivals
          </Link>
          <Link href="#shop" className="transition hover:text-orange-500">
            Shop
          </Link>
          <Link href="#" className="transition hover:text-orange-500">
            Collections
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <button aria-label="Search" className="text-xl">
            ⌕
          </button>
          <button aria-label="Shopping bag" className="relative text-xl">
            ♡
            <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
              2
            </span>
          </button>
          {session?.user ? (
            <div className="group relative">
              <button
                type="button"
                aria-label="Open user profile"
                className="flex items-center gap-2 rounded-full border border-black/10 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition hover:border-black/20"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                  {(
                    session.user.name?.[0] ||
                    session.user.email?.[0] ||
                    "U"
                  ).toUpperCase()}
                </span>
                <span className="hidden max-w-32 truncate text-sm font-bold lg:block">
                  {session.user.name || session.user.email}
                </span>
                <span className="text-xs text-stone-500">⌄</span>
              </button>

              <div className="invisible absolute right-0 top-full z-20 mt-2 w-64 translate-y-1 rounded-2xl border border-black/10 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="border-b border-stone-100 px-3 py-3">
                  {session.user.name && (
                    <p className="font-bold">{session.user.name}</p>
                  )}
                  <p className="mt-0.5 truncate text-sm text-stone-500">
                    {session.user.email}
                  </p>
                </div>
                <Link
                  href="/profile"
                  className="mt-1 block rounded-xl px-3 py-2.5 text-sm font-bold transition hover:bg-stone-100"
                >
                  View profile
                </Link>
                <Link
                  href="/orders"
                  className="block rounded-xl px-3 py-2.5 text-sm font-bold transition hover:bg-stone-100"
                >
                  My orders
                </Link>
                <Link
                  href="/sign-out"
                  className="block rounded-xl px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                  Sign out
                </Link>
              </div>
            </div>
          ) : (
            <>
              <Link
                href={"/sign-in"}
                className="rounded-full border border-[#171717] px-4 py-2 text-sm font-bold transition hover:bg-[#171717] hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-[#171717] px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      <section id="new" className="mx-auto max-w-7xl px-6 pb-16 pt-4 lg:px-10">
        <div className="relative overflow-hidden rounded-[32px] bg-[#d9e5da]">
          <div className="grid min-h-[520px] items-center md:grid-cols-[52%_48%]">
            <div className="relative z-10 px-8 py-14 sm:px-14 lg:px-20">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#536154]">
                The new collection
              </p>
              <h1 className="max-w-xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                Make every day{" "}
                <span className="font-serif font-normal italic text-orange-600">
                  remarkable.
                </span>
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-[#4e5a50]">
                Thoughtfully designed essentials for modern life, crafted to
                feel good and last longer.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#shop"
                  className="rounded-full bg-[#171717] px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-orange-600"
                >
                  Shop collection →
                </a>
                <button className="flex items-center gap-2 px-3 py-3 text-sm font-bold">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#171717]">
                    ▶
                  </span>
                  Watch story
                </button>
              </div>
            </div>

            <div className="relative flex h-full min-h-[360px] items-center justify-center md:min-h-[520px]">
              <div className="absolute h-[320px] w-[320px] rounded-full bg-[#eef2eb] sm:h-[390px] sm:w-[390px]" />
              <div className="absolute bottom-0 right-8 h-72 w-72 rotate-[-8deg] rounded-[45%_55%_48%_52%] bg-[#b4c6b5] sm:h-96 sm:w-96" />
              <div className="relative z-10 flex h-72 w-72 items-center justify-center text-[150px] drop-shadow-2xl sm:h-96 sm:w-96 sm:text-[190px]">
                🛋️
              </div>
              <div className="absolute bottom-8 right-8 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur sm:right-12">
                <p className="text-xs text-stone-500">Featured piece</p>
                <p className="mt-1 font-bold">Lounge Chair</p>
                <p className="mt-2 text-sm font-bold text-orange-600">$320</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
              Curated for you
            </p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Popular picks
            </h2>
          </div>
          <a
            href="#"
            className="hidden border-b border-black pb-1 text-sm font-bold sm:block"
          >
            View all products →
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {products.map((product, index) => (
            <article key={product.name} className="group">
              <div
                className={`relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[24px] ${product.color}`}
              >
                <span className="text-7xl transition duration-500 group-hover:-translate-y-2 group-hover:scale-110 sm:text-9xl">
                  {product.image}
                </span>
                {index === 0 && (
                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-bold">
                    BESTSELLER
                  </span>
                )}
                <button
                  aria-label={`Add ${product.name} to bag`}
                  className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-16 items-center justify-center rounded-full bg-black text-xl text-white transition duration-300 group-hover:translate-y-0"
                >
                  +
                </button>
              </div>
              <div className="mt-4 flex items-start justify-between px-1">
                <div>
                  <p className="text-xs text-stone-500">{product.category}</p>
                  <h3 className="mt-1 font-bold">{product.name}</h3>
                </div>
                <p className="font-bold">{product.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mb-10 max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-6 rounded-[28px] bg-[#171717] px-8 py-10 text-white sm:flex-row sm:px-12">
          <div>
            <p className="text-sm font-bold text-orange-400">THE NOVA EDIT</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Fresh finds, every Friday.
            </h2>
          </div>
          <form className="flex w-full max-w-md rounded-full bg-white p-1.5 sm:w-auto">
            <input
              aria-label="Email address"
              type="email"
              placeholder="Email address"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-black outline-none sm:w-64"
            />
            <button
              type="submit"
              className="rounded-full bg-orange-500 px-5 py-3 text-sm font-bold"
            >
              Join us
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
