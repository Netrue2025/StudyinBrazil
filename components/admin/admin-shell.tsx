import Link from "next/link";
import { LogoutForm } from "@/components/admin/logout-form";

const adminNav = [
  ["Dashboard", "/admin"],
  ["Universities", "/admin/universities"],
  ["Programs", "/admin/programs"],
  ["Open Apps", "/admin/open-applications"],
  ["Services", "/admin/services"],
  ["Submissions", "/admin/submissions"],
  ["Orders", "/admin/orders"],
  ["Settings", "/admin/settings"]
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-shell flex min-h-16 flex-col justify-between gap-3 py-3 lg:flex-row lg:items-center">
          <Link href="/admin" className="font-black text-slate-950">StudyinBrazil Admin</Link>
          <nav className="flex flex-wrap items-center gap-1">
            {adminNav.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950">
                {label}
              </Link>
            ))}
            <LogoutForm />
          </nav>
        </div>
      </header>
      <main className="container-shell py-8">{children}</main>
    </div>
  );
}

export function AdminPageHeader({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return (
    <div className="mb-6">
      {eyebrow ? <p className="text-sm font-bold uppercase text-brand-green">{eyebrow}</p> : null}
      <h1 className="mt-1 text-3xl font-black text-slate-950">{title}</h1>
    </div>
  );
}
