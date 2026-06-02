import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteUniversityState } from "@/lib/admin-actions";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { DeleteRecordForm } from "@/components/admin/form-controls";
import { UniversityForm } from "@/components/admin/university-form";
import { AdminPagination } from "@/components/admin/admin-pagination";

const adminPageSize = 50;

export default async function AdminUniversitiesPage({ searchParams }: { searchParams: { page?: string } }) {
  requireAdmin();
  const page = Math.max(1, Number(searchParams.page || 1));
  const [universities, total] = await Promise.all([
    prisma.university.findMany({ orderBy: { name: "asc" }, skip: (page - 1) * adminPageSize, take: adminPageSize }),
    prisma.university.count()
  ]);
  return (
    <>
      <AdminPageHeader title="Universities" eyebrow="Manage directory" />
      <UniversityForm />
      <AdminPagination page={page} total={total} pageSize={adminPageSize} basePath="/admin/universities" />
      <div className="mt-8 grid gap-4">
        {universities.map((university) => (
          <details key={university.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <summary className="focus-ring cursor-pointer list-none rounded-lg px-5 py-4">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-bold text-slate-950">{university.name}</p>
                  <p className="text-sm text-slate-500">{university.acronym} - {university.city}, {university.state}</p>
                </div>
                <span className="text-sm font-semibold text-brand-green">Expand to edit</span>
              </div>
            </summary>
            <div className="border-t border-slate-100 p-5">
              <UniversityForm university={university} />
              <DeleteRecordForm id={university.id} action={deleteUniversityState} label="Delete university" />
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
