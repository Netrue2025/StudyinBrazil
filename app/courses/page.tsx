import type { Metadata } from "next";
import { getDirectoryData } from "@/lib/data";
import { ProgramDirectory } from "@/components/directory-filters";

export const metadata: Metadata = {
  title: "Courses and Programs",
  description: "Search MSc, PhD, professional master's, postgraduate, and undergraduate programs in Brazil."
};

export default async function CoursesPage() {
  const { programs } = await getDirectoryData();
  return (
    <section className="container-shell py-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase text-brand-blue">Program Directory</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Find postgraduate courses</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Search across university name, program title, degree level, field of study, city, state, region, type, and status.</p>
      </div>
      <ProgramDirectory programs={JSON.parse(JSON.stringify(programs))} />
    </section>
  );
}
