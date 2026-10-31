"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { label: string; icon: string; href: string };

export default function NavLinks({
  links,
  variant,
}: {
  links: NavItem[];
  variant: "sidebar" | "bar";
}) {
  const pathname = usePathname();
  // First link (Overview) must match exactly; others also match their sub-pages
  const isActive = (href: string, index: number) =>
    pathname === href || (index > 0 && pathname.startsWith(href + "/"));

  return (
    <nav
      className={
        variant === "sidebar"
          ? "space-y-1"
          : "flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 md:hidden"
      }
    >
      {links.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive(item.href, index)
              ? "bg-indigo-50 text-indigo-700"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          }`}
        >
          <span className="w-5 text-center text-lg" aria-hidden="true">
            {item.icon}
          </span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
