import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
  makeHref,
}: {
  page: number;
  totalPages: number;
  makeHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const base = "rounded border bg-white px-3 py-1";
  const disabled = "rounded border px-3 py-1 text-slate-300";

  return (
    <nav className="flex items-center justify-center gap-4 pt-4 text-sm">
      {page > 1 ? (
        <Link href={makeHref(page - 1)} className={base}>
          ← Previous
        </Link>
      ) : (
        <span className={disabled}>← Previous</span>
      )}

      <span className="text-slate-600">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link href={makeHref(page + 1)} className={base}>
          Next →
        </Link>
      ) : (
        <span className={disabled}>Next →</span>
      )}
    </nav>
  );
}
