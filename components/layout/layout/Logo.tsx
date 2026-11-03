import Link from "next/link";
import { siteName } from "@/lib/site";

export default function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Home">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-200 transition-transform group-hover:-rotate-3">
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
          <path
            d="m8.5 12 2.3 2.3 4.7-4.7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-xl font-bold tracking-tight">{siteName}</span>
    </Link>
  );
}
