import { notFound } from "next/navigation";
import { ExternalLink, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { parseList } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { ProgramCard } from "@/components/cards";
import { StartApplicationButton } from "@/components/start-application";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const university = await prisma.university.findUnique({ where: { id: params.id } });
  return { title: university?.name || "University" };
}

export default async function UniversityDetailPage({ params }: { params: { id: string } }) {
  const university = await prisma.university.findUnique({
    where: { id: params.id },
    include: { programs: { include: { university: true }, orderBy: { name: "asc" } } }
  });
  if (!university) notFound();

  return (
    <section className="container-shell py-10">
      <div className="mb-6 text-sm font-semibold text-slate-500">
        <a href="/universities" className="text-brand-green">Universities</a> / {university.acronym}
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="green">{university.type}</Badge>
              <Badge tone="blue">{university.region}</Badge>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{university.acronym}</span>
            </div>
            <h1 className="mt-4 text-4xl font-black text-slate-950">{university.name}</h1>
            <p className="mt-3 flex items-center gap-2 text-slate-600"><MapPin className="h-4 w-4" /> {university.city}, {university.state}</p>
            <p className="mt-5 max-w-3xl leading-7 text-slate-600">{university.description}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            {university.website ? (
              <LinkButton href={university.website} variant="outline" target="_blank">
                Official Website <ExternalLink className="h-4 w-4" />
              </LinkButton>
            ) : null}
            <StartApplicationButton />
          </div>
        </div>
        <div className="mt-8 border-t border-slate-100 pt-6">
          <h2 className="text-lg font-bold text-slate-950">Campuses</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {parseList(university.campuses).map((campus) => <Badge key={campus}>{campus}</Badge>)}
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="mb-5 text-2xl font-black text-slate-950">Programs offered</h2>
        {university.programs.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {university.programs.map((program) => <ProgramCard key={program.id} program={program} />)}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-slate-500">No programs have been added yet.</div>
        )}
      </div>
    </section>
  );
}
