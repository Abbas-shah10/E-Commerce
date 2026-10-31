// components/layout/DashboardShell.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import NavLinks, { type NavItem } from "./NavLinks";
import { signOutAction } from "@/app/actions/auth";

interface DashboardShellProps {
  children: ReactNode;
  links: NavItem[];
  title: string; // "My account" or "Admin"
  user: { name?: string | null; email?: string | null };
}

export default function DashboardShell({
  children,
  links,
  title,
  user,
}: DashboardShellProps) {
  const initials = (user.name ?? "U")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white px-4 py-6 md:flex md:flex-col">
        <Link
          href={links[0].href}
          className="mb-8 flex items-center gap-3 px-2 text-xl font-bold text-slate-950"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white">
            D
          </span>
          {title}
        </Link>

        <NavLinks links={links} variant="sidebar" />

        <div className="mt-auto rounded-lg border border-slate-200 p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          <form action={signOutAction} className="mt-3">
            <button className="w-full rounded-md border border-slate-200 py-1.5 text-sm text-slate-600 hover:bg-slate-100">
              Log out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white md:hidden">
              D
            </span>
            <h1 className="text-lg font-semibold text-slate-950">{title}</h1>
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            {initials}
          </div>
        </header>

        {/* Mobile menu: same links as a scrollable bar under the header */}
        <NavLinks links={links} variant="bar" />

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
