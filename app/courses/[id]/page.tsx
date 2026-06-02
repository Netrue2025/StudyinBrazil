import { notFound } from "next/navigation";
import { ExternalLink, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { StartApplicationButton } from "@/components/start-application";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const program = await prisma.program.findUnique({ where: { id: params.id } });
  return { title: program?.name || "Program" };
}

export default async function ProgramDetailPage({ params }: { params: { id: string } }) {
  const program = await prisma.program.findUnique({
    where: { id: params.id },
    include: { university: true, applications: true }
  });
  if (!program) notFound();

  return (
    <section className="container-shell py-10">
      <div className="mb-6 text-sm font-semibold text-slate-500">
        <a href="/courses" className="text-brand-green">Courses</a> / {program.name}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <Badge tone="blue">{program.degreeLevel}</Badge>
            <Badge tone={program.applicationStatus === "Open" ? "green" : "slate"}>{program.applicationStatus}</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-black text-slate-950">{program.name}</h1>
          <p className="mt-3 text-lg font-semibold text-slate-700">{program.university.name} ({program.university.acronym})</p>
          <p className="mt-2 flex items-center gap-2 text-slate-600">
            <MapPin className="h-4 w-4" /> {program.university.city}, {program.university.state} · {program.university.region}
          </p>
          <p className="mt-6 leading-7 text-slate-600">{program.description}</p>
          <dl className="mt-8 grid gap-4 rounded-lg bg-slate-50 p-5 md:grid-cols-2">
            <div><dt className="text-xs font-bold uppercase text-slate-500">Field</dt><dd className="mt-1 font-semibold">{program.fieldOfStudy}</dd></div>
            <div><dt className="text-xs font-bold uppercase text-slate-500">Institution type</dt><dd className="mt-1 font-semibold">{program.university.type}</dd></div>
            <div><dt className="text-xs font-bold uppercase text-slate-500">State</dt><dd className="mt-1 font-semibold">{program.university.state}</dd></div>
            <div><dt className="text-xs font-bold uppercase text-slate-500">City</dt><dd className="mt-1 font-semibold">{program.university.city}</dd></div>
          </dl>
        </article>
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Apply with support</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Prepare documents, shortlist official requirements, and track the application from admin review to submission.</p>
          <StartApplicationButton className="mt-5 w-full" />
          {program.officialLink ? (
            <LinkButton href={program.officialLink} target="_blank" variant="outline" className="mt-3 w-full">
              Official Page <ExternalLink className="h-4 w-4" />
            </LinkButton>
          ) : null}
          <LinkButton href={`/universities/${program.universityId}`} variant="ghost" className="mt-3 w-full">View University</LinkButton>
        </aside>
      </div>
    </section>
  );
}
