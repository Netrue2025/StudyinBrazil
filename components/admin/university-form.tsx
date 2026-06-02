"use client";

import { useFormState } from "react-dom";
import { saveUniversityState } from "@/lib/admin-actions";
import { institutionTypes, northStates } from "@/lib/constants";
import { parseList } from "@/lib/utils";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { FormFeedback, PendingButton } from "@/components/admin/form-controls";

type UniversityFormValue = {
  id?: string;
  name?: string;
  acronym?: string;
  region?: string;
  state?: string;
  city?: string;
  type?: string;
  description?: string;
  website?: string | null;
  campuses?: string;
};

const initialState = { ok: false, message: "" };

export function UniversityForm({ university }: { university?: UniversityFormValue }) {
  const [state, action] = useFormState(saveUniversityState, initialState);

  return (
    <form action={action} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
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
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <PendingButton>{university?.id ? "Save University" : "Create University"}</PendingButton>
        <FormFeedback state={state} />
      </div>
    </form>
  );
}
