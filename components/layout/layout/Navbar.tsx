import Link from "next/link";
import { auth } from "@/lib/auth";

import Logo from "./Logo";
import { signOutAction } from "@/app/actions/auth/auth";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
];

const linkClass =
  "text-sm font-semibold text-slate-700 transition-colors hover:text-violet-600";

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;
  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:h-20 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${linkClass} rounded-lg px-2 py-1.5 data-[active=true]:bg-violet-50 data-[active=true]:text-violet-600`}
              data-nav-link="true"
              data-route={l.href}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`${linkClass} hidden sm:block`}
              >
                {user.name ?? "Dashboard"}
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" className={`${linkClass} hidden sm:block`}>
                  Admin
                </Link>
              )}
              <form action={signOutAction}>
                <button className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-600">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-violet-600"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu: the same links as a scrollable row */}
      <div className="flex gap-6 overflow-x-auto border-t border-slate-100 px-6 py-2 md:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={`${linkClass} shrink-0`}>
            {l.label}
          </Link>
        ))}
        {user && (
          <Link href="/dashboard" className={`${linkClass} shrink-0`}>
            Dashboard
          </Link>
        )}
        {user?.role === "admin" && (
          <Link href="/admin" className={`${linkClass} shrink-0`}>
            Admin
          </Link>
        )}
      </div>
    </header>
  );
}
