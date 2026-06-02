import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteUniversity, saveUniversity } from "@/lib/admin-actions";
import { institutionTypes, northStates } from "@/lib/constants";
import { parseList } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";

export default async function AdminUniversitiesPage() {
  requireAdmin();
  const universities = await prisma.university.findMany({ orderBy: { name: "asc" } });
  return (
    <>
      <AdminPageHeader title="Universities" eyebrow="Manage directory" />
      <UniversityForm />
      <div className="mt-8 grid gap-4">
        {universities.map((university) => (
          <details key={university.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <summary className="focus-ring cursor-pointer list-none rounded-lg px-5 py-4">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-bold text-slate-950">{university.name}</p>
                  <p className="text-sm text-slate-500">{university.acronym} · {university.city}, {university.state}</p>
                </div>
                <span className="text-sm font-semibold text-brand-green">Expand to edit</span>
              </div>
            </summary>
            <div className="border-t border-slate-100 p-5">
              <UniversityForm university={university} />
              <form action={deleteUniversity} className="mt-3">
                <input type="hidden" name="id" value={university.id} />
                <Button variant="outline" className="text-red-700 hover:border-red-200 hover:text-red-700">Delete</Button>
              </form>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}

function UniversityForm({ university }: { university?: any }) {
  return (
    <form action={saveUniversity} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      {university?.id ? <input type="hidden" name="id" value={university.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Name" className="xl:col-span-2"><Input name="name" defaultValue={university?.name} required /></Field>
        <Field label="Acronym"><Input name="acronym" defaultValue={university?.acronym} required /></Field>
        <Field label="Type">
          <Select name="type" defaultValue={university?.type || "Federal"}>
            {institutionTypes.map((type) => <option key={type}>{type}</option>)}
          </Select>
        </Field>
        <Field label="Region"><Input name="region" defaultValue={university?.region || "North"} required /></Field>
        <Field label="State">
          <Select name="state" defaultValue={university?.state || "Acre"}>
            {northStates.map((state) => <option key={state}>{state}</option>)}
          </Select>
        </Field>
        <Field label="City"><Input name="city" defaultValue={university?.city} required /></Field>
        <Field label="Website"><Input name="website" defaultValue={university?.website || ""} /></Field>
        <Field label="Description" className="md:col-span-2"><Textarea name="description" defaultValue={university?.description} required /></Field>
        <Field label="Campuses" className="md:col-span-2"><Textarea name="campuses" defaultValue={parseList(university?.campuses).join("\n")} /></Field>
      </div>
      <Button className="mt-4">{university?.id ? "Save University" : "Create University"}</Button>
    </form>
  );
}
