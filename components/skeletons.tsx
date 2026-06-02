export function PageSkeleton() {
  return (
    <section className="container-shell py-10">
      <div className="max-w-3xl space-y-3">
        <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-slate-100" />
        <div className="h-5 w-full animate-pulse rounded bg-slate-100" />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
            <div className="h-5 w-24 animate-pulse rounded bg-slate-100" />
            <div className="mt-5 h-6 w-4/5 animate-pulse rounded bg-slate-100" />
            <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
            <div className="mt-5 space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="mt-6 h-10 w-full animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function AdminSkeleton() {
  return (
    <section className="container-shell py-8">
      <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
      <div className="mt-3 h-9 w-64 animate-pulse rounded bg-slate-100" />
      <div className="mt-6 rounded-lg border border-slate-100 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-11 animate-pulse rounded bg-slate-100" />
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-lg border border-slate-100 bg-white" />
        ))}
      </div>
    </section>
  );
}
