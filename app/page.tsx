import Link from "next/link";

export default async function Home() {
  return (
    <section className="py-16 text-center">
      <h1 className="text-4xl font-bold">Welcome to the store</h1>
      <p className="mt-3 text-slate-500">Find products you will love.</p>
      <Link
        href="/products"
        className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-white"
      >
        Browse products
      </Link>
    </section>
  );
}
