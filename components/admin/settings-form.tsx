"use client";

import { useFormState, useFormStatus } from "react-dom";
import { saveSettingState } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

const initialState = { ok: false, message: "" };

export function SettingForm({ settingKey, value }: { settingKey: string; value: string }) {
  const [state, action] = useFormState(saveSettingState, initialState);

  return (
    <form action={action} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[260px_1fr_auto] md:items-end">
      <input type="hidden" name="key" value={settingKey} />
      <Field label="Key"><Input value={settingKey} readOnly /></Field>
      <Field label="Value"><Input name="value" defaultValue={value} /></Field>
      <SubmitButton />
      {state.message ? (
        <p className={state.ok ? "text-sm font-semibold text-brand-green md:col-span-3" : "text-sm font-semibold text-red-700 md:col-span-3"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button disabled={pending}>{pending ? "Saving..." : "Save"}</Button>;
}
