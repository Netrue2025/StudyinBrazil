import Link from "next/link";

export function AdminPagination({
  page,
  total,
  pageSize,
  basePath
}: {
  page: number;
  total: number;
  pageSize: number;
  basePath: string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-500">Showing {start}-{end} of {total}</p>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link className="focus-ring rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold" href={`${basePath}?page=${page - 1}`}>Previous</Link>
        ) : (
          <span className="rounded-md border border-slate-100 px-3 py-2 text-sm font-semibold text-slate-300">Previous</span>
        )}
        <span className="min-w-24 text-center text-sm font-bold text-slate-700">Page {page} of {totalPages}</span>
        {page < totalPages ? (
          <Link className="focus-ring rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold" href={`${basePath}?page=${page + 1}`}>Next</Link>
        ) : (
          <span className="rounded-md border border-slate-100 px-3 py-2 text-sm font-semibold text-slate-300">Next</span>
        )}
      </div>
    </div>
  );
}
