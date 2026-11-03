export default function Loading() {
  return (
    <div>
      <div className="mb-6 h-8 w-40 animate-pulse rounded bg-slate-200" />
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <div className="aspect-square animate-pulse bg-slate-200" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-5 w-1/4 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
