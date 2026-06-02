import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deadlineLabel, parseList } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { StartApplicationButton } from "@/components/start-application";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const application = await prisma.openApplication.findUnique({ where: { id: params.id } });
  return { title: application?.title || "Application" };
}

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const application = await prisma.openApplication.findUnique({
    where: { id: params.id },
    include: { university: true, program: true }
  });
  if (!application) notFound();

  return (
    <section className="container-shell py-10">
      <div className="mb-6 text-sm font-semibold text-slate-500">
        <a href="/open-applications" className="text-brand-green">Open Applications</a> / {application.title}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <Badge tone={application.status === "Open" ? "green" : "yellow"}>{application.status}</Badge>
            <Badge tone="blue">{application.badge}</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-black text-slate-950">{application.title}</h1>
          <p className="mt-3 text-lg font-semibold text-slate-700">{application.university.name}</p>
          <p className="mt-1 text-slate-600">{application.program?.name || "Multiple programs"}</p>
          <p className="mt-6 leading-7 text-slate-600">{application.fullDescription}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <InfoList title="Eligibility" items={parseList(application.requirements)} />
            <InfoList title="Required documents" items={parseList(application.requiredDocuments)} />
          </div>
          <div className="mt-8 rounded-lg bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-950">How to apply</h2>
            <p className="mt-2 leading-7 text-slate-600">{application.howToApply}</p>
          </div>
        </article>
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Timeline</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Opening date</dt><dd className="font-semibold">{application.openingDate?.toLocaleDateString() || "TBA"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Deadline</dt><dd className="font-semibold">{deadlineLabel(application.deadline)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Fee</dt><dd className="font-semibold">Check official call</dd></div>
          </dl>
          <StartApplicationButton className="mt-5 w-full" />
          {application.officialLink ? (
            <LinkButton href={application.officialLink} target="_blank" variant="outline" className="mt-3 w-full">
              Official Link <ExternalLink className="h-4 w-4" />
            </LinkButton>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      <ul className="mt-3 grid gap-2 text-sm text-slate-600">
        {items.map((item) => <li key={item} className="rounded-md bg-slate-50 px-3 py-2">{item}</li>)}
      </ul>
    </div>
  );
}
