import type { Metadata } from "next";
import { StartApplicationButton } from "@/components/start-application";

export const metadata: Metadata = {
  title: "About",
  description: "About StudyinBrazil and its international student support mission."
};

export default function AboutPage() {
  return (
    <section className="container-shell py-14">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase text-brand-green">About</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">A focused platform for Brazilian postgraduate discovery</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          StudyinBrazil helps international students search universities, compare postgraduate programs, find open applications,
          and request paid document or application support. The admin dashboard keeps content editable as new calls and official links become available.
        </p>
        <StartApplicationButton className="mt-8" />
      </div>
    </section>
  );
}
