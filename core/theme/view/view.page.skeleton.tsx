export function ViewPageSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-8 w-48 rounded-lg bg-powder/80" />
      <div className="mt-3 h-4 w-72 max-w-full rounded bg-powder/60" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: rows * 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[280px] rounded-2xl border border-stone/40 bg-powder/40"
          />
        ))}
      </div>
    </div>
  );
}

export function ViewCartPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-8 w-56 rounded-lg bg-powder/80" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 rounded-2xl border border-stone/40 bg-powder/40"
            />
          ))}
        </div>
        <div className="h-80 rounded-2xl border border-stone/40 bg-powder/40" />
      </div>
    </div>
  );
}

export function ViewHomePageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse px-4 py-6 sm:px-6 lg:px-8">
      <div className="h-[360px] rounded-3xl bg-powder/50 sm:h-[420px]" />
      <div className="mt-8 flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-24 w-24 shrink-0 rounded-full bg-powder/50"
          />
        ))}
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-[260px] rounded-2xl bg-powder/40"
          />
        ))}
      </div>
    </div>
  );
}
