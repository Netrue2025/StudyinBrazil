"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ActionState = { ok: boolean; message: string };
type StateAction = (previousState: ActionState, formData: FormData) => Promise<ActionState>;

const initialState: ActionState = { ok: false, message: "" };

export function FormFeedback({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <p className={state.ok ? "text-sm font-semibold text-brand-green" : "text-sm font-semibold text-red-700"}>
      {state.message}
    </p>
  );
}

export function PendingButton({
  children,
  pendingText = "Saving...",
  variant = "primary",
  className
}: {
  children: React.ReactNode;
  pendingText?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "yellow";
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} variant={variant} className={className}>
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {pendingText}
        </>
      ) : children}
    </Button>
  );
}

export function DeleteRecordForm({
  id,
  action,
  label = "Delete"
}: {
  id: string;
  action: StateAction;
  label?: string;
}) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
      <input type="hidden" name="id" value={id} />
      <PendingButton variant="outline" pendingText="Deleting..." className="text-red-700 hover:border-red-200 hover:text-red-700">
        <Trash2 className="h-4 w-4" />
        {label}
      </PendingButton>
      <FormFeedback state={state} />
    </form>
  );
}
