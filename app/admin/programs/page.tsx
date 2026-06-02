import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteProgram, saveProgram } from "@/lib/admin-actions";
import { applicationStatuses, degreeLevels } from "@/lib/constants";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";

export default async function AdminProgramsPage() {
  requireAdmin();
  const [programs, universities] = await Promise.all([
    prisma.program.findMany({ include: { university: true }, orderBy: { name: "asc" } }),
    prisma.university.findMany({ orderBy: { name: "asc" } })
  ]);
  return (
    <>
      <AdminPageHeader title="Programs" eyebrow="Manage courses" />
      <ProgramForm universities={universities} />
      <div className="mt-8 grid gap-4">
        {programs.map((program) => (
          <details key={program.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <summary className="focus-ring cursor-pointer list-none rounded-lg px-5 py-4">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-bold text-slate-950">{program.name}</p>
                  <p className="text-sm text-slate-500">{program.university.acronym} · {program.degreeLevel} · {program.applicationStatus}</p>
                </div>
                <span className="text-sm font-semibold text-brand-green">Expand to edit</span>
              </div>
            </summary>
            <div className="border-t border-slate-100 p-5">
              <ProgramForm program={program} universities={universities} />
              <form action={deleteProgram} className="mt-3">
                <input type="hidden" name="id" value={program.id} />
                <Button variant="outline" className="text-red-700 hover:border-red-200 hover:text-red-700">Delete</Button>
              </form>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}

function ProgramForm({ program, universities }: { program?: any; universities: any[] }) {
  return (
    <form action={saveProgram} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      {program?.id ? <input type="hidden" name="id" value={program.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Program name" className="xl:col-span-2"><Input name="name" defaultValue={program?.name} required /></Field>
        <Field label="University">
          <Select name="universityId" defaultValue={program?.universityId} required>
            <option value="">Select university</option>
            {universities.map((university) => <option key={university.id} value={university.id}>{university.name}</option>)}
          </Select>
        </Field>
        <Field label="Degree level">
          <Select name="degreeLevel" defaultValue={program?.degreeLevel || "MSc"}>
            {degreeLevels.map((degree) => <option key={degree}>{degree}</option>)}
            <option>MSc, PhD</option>
          </Select>
        </Field>
        <Field label="Field"><Input name="fieldOfStudy" defaultValue={program?.fieldOfStudy} required /></Field>
        <Field label="Application status">
          <Select name="applicationStatus" defaultValue={program?.applicationStatus || "Unknown"}>
            {applicationStatuses.map((status) => <option key={status}>{status}</option>)}
          </Select>
        </Field>
        <Field label="Official link" className="md:col-span-2"><Input name="officialLink" defaultValue={program?.officialLink || ""} /></Field>
        <Field label="Description" className="md:col-span-2 xl:col-span-4"><Textarea name="description" defaultValue={program?.description} required /></Field>
      </div>
      <Button className="mt-4">{program?.id ? "Save Program" : "Create Program"}</Button>
    </form>
  );
}
