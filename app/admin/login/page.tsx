import { Lock } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <section className="container-shell flex min-h-[80vh] items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-green text-white">
          <Lock className="h-5 w-5" />
        </div>
        <div className="mt-5">
          <AdminLoginForm error={searchParams.error} />
        </div>
      </div>
    </section>
  );
}
