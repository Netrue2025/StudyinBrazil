import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-950 text-white">
      <div className="container-shell grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <h2 className="text-xl font-bold">StudyinBrazil</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            A clean discovery and application-support platform for international students exploring Brazilian universities,
            postgraduate programs, and open admissions.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Explore</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            <Link href="/universities">Universities</Link>
            <Link href="/courses">Courses</Link>
            <Link href="/open-applications">Open Applications</Link>
            <Link href="/services">Services</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Contact</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@studyinbrazil.local</span>
            <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> WhatsApp support ready</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        StudyinBrazil. Built for international education support.
      </div>
    </footer>
  );
}
