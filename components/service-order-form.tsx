"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { CreditCard, Upload } from "lucide-react";
import { createServiceOrderState } from "@/lib/service-actions";
import { Field, Input, Textarea } from "@/components/ui/field";
import { FormFeedback, PendingButton } from "@/components/admin/form-controls";

const initialState = { ok: false, message: "", redirectTo: "" };

export function ServiceOrderForm({ serviceId, provider = "manual" }: { serviceId: string; provider?: string }) {
  const router = useRouter();
  const [state, action] = useFormState(createServiceOrderState, initialState);
  const isPaystack = provider.toLowerCase() === "paystack";

  useEffect(() => {
    if (state.ok && state.redirectTo) router.push(state.redirectTo);
  }, [router, state.ok, state.redirectTo]);

  return (
    <form action={action} className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <input type="hidden" name="serviceId" value={serviceId} />
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-brand-blue" />
        <h2 className="text-lg font-bold text-slate-950">Payment details</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {isPaystack ? "Pay securely with Paystack after your order details are saved." : "Manual payment mode creates a pending order for admin follow-up."}
      </p>
      <div className="mt-5 grid gap-4">
        <Field label="Full name"><Input name="fullName" required /></Field>
        <Field label="Email"><Input type="email" name="email" required /></Field>
        <Field label="Phone / WhatsApp"><Input name="phone" required /></Field>
        <Field label="Upload relevant document"><Input type="file" name="document" className="h-auto py-2" /></Field>
        <Field label="Notes"><Textarea name="notes" placeholder="Add your target program, deadline, or document context." /></Field>
      </div>
      <div className="mt-5 grid gap-3">
        <PendingButton className="w-full" pendingText={isPaystack ? "Opening Paystack..." : "Creating order..."}>
          {isPaystack ? "Pay with Paystack" : "Create Pending Order"}
          {isPaystack ? <CreditCard className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
        </PendingButton>
        <FormFeedback state={state} />
      </div>
    </form>
  );
}
