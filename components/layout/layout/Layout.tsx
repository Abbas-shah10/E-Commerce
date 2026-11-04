import Link from "next/link";
import Logo from "./Logo";
import { siteName, siteTagline } from "@/lib/site";

const linkClass = "hover:text-violet-600";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
              {siteTagline}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold">Shop</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500">
              <Link href="/products" className={linkClass}>
                All products
              </Link>
              <Link href="/cart" className={linkClass}>
                Cart
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">Account</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500">
              <Link href="/sign-in" className={linkClass}>
                Sign in
              </Link>
              <Link href="/sign-up" className={linkClass}>
                Create account
              </Link>
              <Link href="/orders" className={linkClass}>
                My orders
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 text-sm text-slate-400">
          © Nov 4, 2026 {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
