"use client";

import { loginAction } from "@/lib/admin-actions";
import { Field, Input } from "@/components/ui/field";
import { PendingButton } from "@/components/admin/form-controls";

export function AdminLoginForm({ error }: { error?: string }) {
  return (
    <form action={loginAction} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <h1 className="text-2xl font-black text-slate-950">Admin login</h1>
      <p className="mt-2 text-sm text-slate-600">Use the password from `ADMIN_PASSWORD` in your environment.</p>
      {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">Invalid password.</p> : null}
      <Field label="Password" className="mt-5"><Input type="password" name="password" required /></Field>
      <PendingButton className="mt-5 w-full" pendingText="Logging in...">Login</PendingButton>
    </form>
  );
}
