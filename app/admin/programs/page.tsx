import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteProgramState } from "@/lib/admin-actions";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { DeleteRecordForm } from "@/components/admin/form-controls";
import { ProgramForm } from "@/components/admin/program-form";
import { AdminPagination } from "@/components/admin/admin-pagination";

const adminPageSize = 50;

export default async function AdminProgramsPage({ searchParams }: { searchParams: { page?: string } }) {
  requireAdmin();
  const page = Math.max(1, Number(searchParams.page || 1));
  const [programs, universities, total] = await Promise.all([
    prisma.program.findMany({ include: { university: true }, orderBy: { name: "asc" }, skip: (page - 1) * adminPageSize, take: adminPageSize }),
    prisma.university.findMany({ orderBy: { name: "asc" } }),
    prisma.program.count()
  ]);
  return (
    <>
      <AdminPageHeader title="Programs" eyebrow="Manage courses" />
      <ProgramForm universities={universities} />
      <AdminPagination page={page} total={total} pageSize={adminPageSize} basePath="/admin/programs" />
      <div className="mt-8 grid gap-4">
        {programs.map((program) => (
          <details key={program.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <summary className="focus-ring cursor-pointer list-none rounded-lg px-5 py-4">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-bold text-slate-950">{program.name}</p>
                  <p className="text-sm text-slate-500">{program.university.acronym} - {program.degreeLevel} - {program.applicationStatus}</p>
                </div>
                <span className="text-sm font-semibold text-brand-green">Expand to edit</span>
              </div>
            </summary>
            <div className="border-t border-slate-100 p-5">
              <ProgramForm program={program} universities={universities} />
              <DeleteRecordForm id={program.id} action={deleteProgramState} label="Delete program" />
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
