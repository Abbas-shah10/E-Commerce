import Link from "next/link";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="Home"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-200 transition-transform group-hover:-rotate-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  d="M12 2 22 12 12 22 2 12 12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="m8.5 12 2.3 2.3 4.7-4.7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-xl font-bold tracking-tight">Nova</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-700 transition-colors hover:text-violet-600"
            >
              Home
            </Link>
            <Link
              href="/#features"
              className="text-sm font-semibold text-slate-700 transition-colors hover:text-violet-600"
            >
              Features
            </Link>
            <Link
              href="/#about"
              className="text-sm font-semibold text-slate-700 transition-colors hover:text-violet-600"
            >
              About
            </Link>
            <Link
              href="/#contact"
              className="text-sm font-semibold text-slate-700 transition-colors hover:text-violet-600"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-violet-600"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main className="min-h-[calc(100vh-320px)]">{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
            <div>
              <Link href="/" className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 2 22 12 12 22 2 12 12 2Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                </span>
                <span className="text-xl font-bold">Nova</span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
                Building thoughtful digital experiences that help ideas grow and
                people do their best work.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold">Product</h3>
              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500">
                <Link href="/#features" className="hover:text-violet-600">
                  Features
                </Link>
                <Link href="/pricing" className="hover:text-violet-600">
                  Pricing
                </Link>
                <Link href="/updates" className="hover:text-violet-600">
                  Updates
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold">Company</h3>
              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500">
                <Link href="/#about" className="hover:text-violet-600">
                  About
                </Link>
                <a href="/careers" className="hover:text-violet-600">
                  Careers
                </a>
                <Link href="/#contact" className="hover:text-violet-600">
                  Contact
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold">Follow</h3>
              <div className="mt-4 flex gap-3">
                <Link
                  href="#"
                  aria-label="X"
                  className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                >
                  X
                </Link>
                <Link
                  href="#"
                  aria-label="LinkedIn"
                  className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                >
                  in
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-slate-100 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Nova. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-slate-700">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-slate-700">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default layout;
