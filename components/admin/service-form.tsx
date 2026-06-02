"use client";

import { useFormState } from "react-dom";
import { saveServiceState } from "@/lib/admin-actions";
import { parseList } from "@/lib/utils";
import { Field, Input, Textarea } from "@/components/ui/field";
import { FormFeedback, PendingButton } from "@/components/admin/form-controls";

type ServiceFormValue = {
  id?: string;
  title?: string;
  slug?: string;
  price?: number;
  currency?: string;
  deliveryTime?: string;
  description?: string;
  includes?: string;
  isActive?: boolean;
};

const initialState = { ok: false, message: "" };

export function ServiceForm({ service }: { service?: ServiceFormValue }) {
  const [state, action] = useFormState(saveServiceState, initialState);

  return (
    <form action={action} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      {service?.id ? <input type="hidden" name="id" value={service.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Title" className="xl:col-span-2"><Input name="title" defaultValue={service?.title} required /></Field>
        <Field label="Slug"><Input name="slug" defaultValue={service?.slug} placeholder="leave blank to auto-generate" /></Field>
        <Field label="Price"><Input name="price" type="number" step="0.01" min="0" defaultValue={service ? service.price : ""} required /></Field>
        <Field label="Currency"><Input name="currency" defaultValue={service?.currency || "USD"} /></Field>
        <Field label="Delivery time"><Input name="deliveryTime" defaultValue={service?.deliveryTime} required /></Field>
        <label className="mt-8 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input type="checkbox" name="isActive" defaultChecked={service?.isActive ?? true} className="h-4 w-4 accent-brand-green" />
          Active
        </label>
        <Field label="Description" className="md:col-span-2"><Textarea name="description" defaultValue={service?.description} required /></Field>
        <Field label="Includes" className="md:col-span-2"><Textarea name="includes" defaultValue={parseList(service?.includes).join("\n")} /></Field>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <PendingButton>{service?.id ? "Save Service" : "Create Service"}</PendingButton>
        <FormFeedback state={state} />
      </div>
    </form>
  );
}
