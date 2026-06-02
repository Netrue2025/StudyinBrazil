"use client";

import { useFormState } from "react-dom";
import { saveOpenApplicationState } from "@/lib/admin-actions";
import { applicationStatuses } from "@/lib/constants";
import { parseList } from "@/lib/utils";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { FormFeedback, PendingButton } from "@/components/admin/form-controls";

type OpenApplicationFormValue = {
  id?: string;
  title?: string;
  universityId?: string;
  programId?: string | null;
  summary?: string;
  fullDescription?: string;
  requirements?: string;
  requiredDocuments?: string;
  howToApply?: string;
  openingDate?: string;
  deadline?: string;
  status?: string;
  badge?: string;
  bannerImage?: string | null;
  officialLink?: string | null;
  showInHero?: boolean;
};

type UniversityOption = { id: string; name: string };
type ProgramOption = { id: string; name: string; university: { acronym: string } };

const initialState = { ok: false, message: "" };

export function OpenApplicationForm({
  application,
  universities,
  programs
}: {
  application?: OpenApplicationFormValue;
  universities: UniversityOption[];
  programs: ProgramOption[];
}) {
  const [state, action] = useFormState(saveOpenApplicationState, initialState);

  return (
    <form action={action} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
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
        <Field label="Opening date"><Input type="date" name="openingDate" defaultValue={application?.openingDate || ""} /></Field>
        <Field label="Deadline"><Input type="date" name="deadline" defaultValue={application?.deadline || ""} /></Field>
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
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <PendingButton>{application?.id ? "Save Application" : "Create Application"}</PendingButton>
        <FormFeedback state={state} />
      </div>
    </form>
  );
}
