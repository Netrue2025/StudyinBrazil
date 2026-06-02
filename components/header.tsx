import Link from "next/link";
import { GraduationCap, Menu } from "lucide-react";
import { StartApplicationButton } from "@/components/start-application";

const nav = [
  ["Home", "/"],
  ["Universities", "/universities"],
  ["Courses", "/courses"],
  ["Open Applications", "/open-applications"],
  ["Services", "/services"],
  ["About", "/about"],
  ["Contact", "/contact"]
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/92 backdrop-blur">
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-green text-white">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span>StudyinBrazil</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950">
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:block">
          <StartApplicationButton />
        </div>
        <details className="relative lg:hidden">
          <summary className="focus-ring flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border border-slate-200">
            <Menu className="h-5 w-5" />
          </summary>
          <div className="absolute right-0 mt-3 w-72 rounded-lg border border-slate-200 bg-white p-3 shadow-soft">
            {nav.map(([label, href]) => (
              <Link key={href} href={href} className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                {label}
              </Link>
            ))}
            <StartApplicationButton className="mt-3 w-full" />
          </div>
        </details>
      </div>
    </header>
  );
}
