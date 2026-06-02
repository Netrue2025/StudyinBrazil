import type { Metadata } from "next";
import { getDirectoryData } from "@/lib/data";
import { UniversityDirectory } from "@/components/directory-filters";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Universities",
  description: "Search Brazilian universities by state, city, region, and institution type."
};

export default async function UniversitiesPage() {
  const { universities } = await getDirectoryData();
  return (
    <section className="container-shell py-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase text-brand-green">University Directory</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Search Brazilian universities</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Filter federal, state, private, and federal institute options across the North Region seed database.</p>
      </div>
      <UniversityDirectory universities={JSON.parse(JSON.stringify(universities))} />
    </section>
  );
}
