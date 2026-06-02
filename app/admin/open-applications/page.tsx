import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteOpenApplication, saveOpenApplication } from "@/lib/admin-actions";
import { applicationStatuses } from "@/lib/constants";
import { parseList, toDateInput } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";

export default async function AdminOpenApplicationsPage() {
  requireAdmin();
  const [applications, universities, programs] = await Promise.all([
    prisma.openApplication.findMany({ include: { university: true, program: true }, orderBy: { createdAt: "desc" } }),
    prisma.university.findMany({ orderBy: { name: "asc" } }),
    prisma.program.findMany({ include: { university: true }, orderBy: { name: "asc" } })
  ]);
  return (
    <>
      <AdminPageHeader title="Open Applications / Adverts" eyebrow="Manage calls" />
      <OpenApplicationForm universities={universities} programs={programs} />
      <div className="mt-8 grid gap-4">
        {applications.map((application) => (
          <details key={application.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <summary className="focus-ring cursor-pointer list-none rounded-lg px-5 py-4">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-bold text-slate-950">{application.title}</p>
                  <p className="text-sm text-slate-500">{application.university.acronym} · {application.status} · {application.badge}</p>
                </div>
                <span className="text-sm font-semibold text-brand-green">Expand to edit</span>
              </div>
            </summary>
            <div className="border-t border-slate-100 p-5">
              <OpenApplicationForm application={application} universities={universities} programs={programs} />
              <form action={deleteOpenApplication} className="mt-3">
                <input type="hidden" name="id" value={application.id} />
                <Button variant="outline" className="text-red-700 hover:border-red-200 hover:text-red-700">Delete</Button>
              </form>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}

function OpenApplicationForm({ application, universities, programs }: { application?: any; universities: any[]; programs: any[] }) {
  return (
    <form action={saveOpenApplication} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      {application?.id ? <input type="hidden" name="id" value={application.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Title" className="xl:col-span-2"><Input name="title" defaultValue={application?.title} required /></Field>
        <Field label="University">
          <Select name="universityId" defaultValue={application?.universityId} required>
            <option value="">Select university</option>
            {universities.map((university) => <option key={university.id} value={university.id}>{university.name}</option>)}
          </Select>
        </Field>
        <Field label="Program">
          <Select name="programId" defaultValue={application?.programId || ""}>
            <option value="">Multiple / optional</option>
            {programs.map((program) => <option key={program.id} value={program.id}>{program.name} - {program.university.acronym}</option>)}
          </Select>
        </Field>
        <Field label="Opening date"><Input type="date" name="openingDate" defaultValue={toDateInput(application?.openingDate)} /></Field>
        <Field label="Deadline"><Input type="date" name="deadline" defaultValue={toDateInput(application?.deadline)} /></Field>
        <Field label="Status">
          <Select name="status" defaultValue={application?.status || "Open"}>
            {applicationStatuses.filter((item) => item !== "Unknown").map((status) => <option key={status}>{status}</option>)}
          </Select>
        </Field>
        <Field label="Badge"><Input name="badge" defaultValue={application?.badge || "Open Now"} /></Field>
        <Field label="Banner image"><Input name="bannerImage" defaultValue={application?.bannerImage || ""} /></Field>
        <Field label="Official link"><Input name="officialLink" defaultValue={application?.officialLink || ""} /></Field>
        <label className="mt-8 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input type="checkbox" name="showInHero" defaultChecked={application?.showInHero} className="h-4 w-4 accent-brand-green" />
          Show in hero advert slider
        </label>
        <Field label="Summary" className="md:col-span-2"><Textarea name="summary" defaultValue={application?.summary} required /></Field>
        <Field label="Full description" className="md:col-span-2"><Textarea name="fullDescription" defaultValue={application?.fullDescription} required /></Field>
        <Field label="Eligibility / requirements" className="md:col-span-2"><Textarea name="requirements" defaultValue={parseList(application?.requirements).join("\n")} /></Field>
        <Field label="Required documents" className="md:col-span-2"><Textarea name="requiredDocuments" defaultValue={parseList(application?.requiredDocuments).join("\n")} /></Field>
        <Field label="How to apply" className="md:col-span-2 xl:col-span-4"><Textarea name="howToApply" defaultValue={application?.howToApply} required /></Field>
      </div>
      <Button className="mt-4">{application?.id ? "Save Application" : "Create Application"}</Button>
    </form>
  );
}
