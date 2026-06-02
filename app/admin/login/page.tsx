import { Lock } from "lucide-react";
import { loginAction } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <section className="container-shell flex min-h-[80vh] items-center justify-center py-10">
      <form action={loginAction} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-green text-white">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="mt-5 text-2xl font-black text-slate-950">Admin login</h1>
        <p className="mt-2 text-sm text-slate-600">Use the password from `ADMIN_PASSWORD` in your environment.</p>
        {searchParams.error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">Invalid password.</p> : null}
        <Field label="Password" className="mt-5"><Input type="password" name="password" required /></Field>
        <Button className="mt-5 w-full">Login</Button>
      </form>
    </section>
  );
}
