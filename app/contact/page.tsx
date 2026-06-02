import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import { StartApplicationButton } from "@/components/start-application";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact StudyinBrazil for postgraduate application support."
};

export default function ContactPage() {
  return (
    <section className="container-shell py-14">
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="text-sm font-bold uppercase text-brand-blue">Contact</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Need help choosing a Brazilian program?</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">Start an application or reach out through email and WhatsApp. Admin settings can update these contact channels later.</p>
          <StartApplicationButton className="mt-8" />
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Support channels</h2>
          <div className="mt-5 grid gap-4">
            <div className="flex items-center gap-3 rounded-md bg-slate-50 p-4"><Mail className="h-5 w-5 text-brand-green" /> hello@studyinbrazil.local</div>
            <div className="flex items-center gap-3 rounded-md bg-slate-50 p-4"><MessageCircle className="h-5 w-5 text-brand-blue" /> WhatsApp support ready</div>
          </div>
        </div>
      </div>
    </section>
  );
}
