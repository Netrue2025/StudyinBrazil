"use client";

import { useFormState } from "react-dom";
import { updateOrderStatusState, updateSubmissionStatusState } from "@/lib/admin-actions";
import { paymentStatuses, serviceOrderStatuses, submissionStatuses } from "@/lib/constants";
import { Field, Select, Textarea } from "@/components/ui/field";
import { FormFeedback, PendingButton } from "@/components/admin/form-controls";

const initialState = { ok: false, message: "" };

export function SubmissionStatusForm({
  id,
  status,
  internalNotes
}: {
  id: string;
  status: string;
  internalNotes?: string | null;
}) {
  const [state, action] = useFormState(updateSubmissionStatusState, initialState);

  return (
    <form action={action} className="mt-5 grid gap-4 md:grid-cols-[220px_1fr_auto] md:items-end">
      <input type="hidden" name="id" value={id} />
      <Field label="Status">
        <Select name="status" defaultValue={status}>{submissionStatuses.map((item) => <option key={item}>{item}</option>)}</Select>
      </Field>
      <Field label="Internal notes"><Textarea name="internalNotes" defaultValue={internalNotes || ""} /></Field>
      <div className="flex flex-col gap-2">
        <PendingButton pendingText="Updating...">Update</PendingButton>
        <FormFeedback state={state} />
      </div>
    </form>
  );
}

export function OrderStatusForm({
  id,
  status,
  paymentStatus,
  adminNotes
}: {
  id: string;
  status: string;
  paymentStatus: string;
  adminNotes?: string | null;
}) {
  const [state, action] = useFormState(updateOrderStatusState, initialState);

  return (
    <form action={action} className="mt-5 grid gap-4 md:grid-cols-[180px_180px_1fr_auto] md:items-end">
      <input type="hidden" name="id" value={id} />
      <Field label="Order status"><Select name="status" defaultValue={status}>{serviceOrderStatuses.map((item) => <option key={item}>{item}</option>)}</Select></Field>
      <Field label="Payment status"><Select name="paymentStatus" defaultValue={paymentStatus}>{paymentStatuses.map((item) => <option key={item}>{item}</option>)}</Select></Field>
      <Field label="Admin notes"><Textarea name="adminNotes" defaultValue={adminNotes || ""} /></Field>
      <div className="flex flex-col gap-2">
        <PendingButton pendingText="Updating...">Update</PendingButton>
        <FormFeedback state={state} />
      </div>
    </form>
  );
}
