"use client";

import { useFormState } from "react-dom";
import { saveProgramState } from "@/lib/admin-actions";
import { applicationStatuses, degreeLevels } from "@/lib/constants";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { FormFeedback, PendingButton } from "@/components/admin/form-controls";

type ProgramFormValue = {
  id?: string;
  name?: string;
  universityId?: string;
  degreeLevel?: string;
  fieldOfStudy?: string;
  description?: string;
  officialLink?: string | null;
  applicationStatus?: string;
};

type UniversityOption = { id: string; name: string };

const initialState = { ok: false, message: "" };

export function ProgramForm({ program, universities }: { program?: ProgramFormValue; universities: UniversityOption[] }) {
  const [state, action] = useFormState(saveProgramState, initialState);

  return (
    <form action={action} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
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
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <PendingButton>{program?.id ? "Save Program" : "Create Program"}</PendingButton>
        <FormFeedback state={state} />
      </div>
    </form>
  );
}
