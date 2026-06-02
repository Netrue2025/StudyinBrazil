import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { deadlineLabel, money, parseList } from "@/lib/utils";

type UniversityCardProps = {
  university: {
    id: string;
    name: string;
    acronym: string;
    state: string;
    city: string;
    region: string;
    type: string;
    description: string;
    programs?: unknown[];
  };
};

export function UniversityCard({ university }: UniversityCardProps) {
  return (
    <Card className="flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <Badge tone={university.type === "Private" ? "yellow" : "green"}>{university.type}</Badge>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">{university.acronym}</span>
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-950">{university.name}</h3>
      <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500">
        <MapPin className="h-4 w-4" />
        {university.city}, {university.state} · {university.region}
      </p>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{university.description}</p>
      <div className="mt-auto flex items-center justify-between pt-5">
        <span className="text-sm font-semibold text-slate-700">{university.programs?.length || 0} programs</span>
        <Link href={`/universities/${university.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-brand-green">
          View University <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}

type ProgramCardProps = {
  program: {
    id: string;
    name: string;
    degreeLevel: string;
    fieldOfStudy: string;
    applicationStatus: string;
    university: {
      name: string;
      acronym: string;
      state: string;
      city: string;
      region: string;
      type: string;
    };
  };
};

export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Card className="flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={program.applicationStatus === "Open" ? "green" : program.applicationStatus === "Closing Soon" ? "yellow" : "slate"}>
          {program.applicationStatus}
        </Badge>
        <Badge tone="blue">{program.degreeLevel}</Badge>
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-950">{program.name}</h3>
      <p className="mt-2 text-sm font-semibold text-slate-700">{program.university.name} ({program.university.acronym})</p>
      <p className="mt-2 text-sm text-slate-500">{program.fieldOfStudy} · {program.university.city}, {program.university.state}</p>
      <div className="mt-auto flex items-center justify-between pt-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{program.university.type}</span>
        <LinkButton href={`/courses/${program.id}`} variant="outline" className="h-10 px-4">Details</LinkButton>
      </div>
    </Card>
  );
}

type ApplicationCardProps = {
  application: {
    id: string;
    title: string;
    summary: string;
    badge: string;
    status: string;
    deadline: Date | null;
    requiredDocuments: string;
    university: { name: string; acronym: string };
    program?: { name: string } | null;
  };
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-brand-green via-brand-yellow to-brand-blue" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge tone={application.status === "Open" ? "green" : application.status === "Closing Soon" ? "yellow" : "slate"}>
            {application.badge}
          </Badge>
          <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
            <CalendarDays className="h-4 w-4" /> {deadlineLabel(application.deadline)}
          </span>
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-950">{application.title}</h3>
        <p className="mt-2 text-sm font-semibold text-slate-700">{application.university.name}</p>
        <p className="mt-1 text-sm text-slate-500">{application.program?.name || "Multiple programs"}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{application.summary}</p>
        <p className="mt-3 text-xs font-semibold text-slate-500">
          Documents: {parseList(application.requiredDocuments).slice(0, 3).join(", ") || "See details"}
        </p>
        <LinkButton href={`/open-applications/${application.id}`} className="mt-auto w-full" variant="secondary">
          View Application
        </LinkButton>
      </div>
    </Card>
  );
}

export function ServiceCard({
  service
}: {
  service: { title: string; slug: string; description: string; price: number; currency: string; deliveryTime: string; includes: string };
}) {
  return (
    <Card className="flex h-full flex-col p-5">
      <h3 className="text-lg font-bold text-slate-950">{service.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <span className="text-2xl font-bold text-slate-950">{money(service.price, service.currency)}</span>
        <Badge tone="blue">{service.deliveryTime}</Badge>
      </div>
      <ul className="mt-5 grid gap-2 text-sm text-slate-600">
        {parseList(service.includes).map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
            {item}
          </li>
        ))}
      </ul>
      <LinkButton href={`/services/${service.slug}`} className="mt-auto w-full" variant="yellow">
        Pay for Service
      </LinkButton>
    </Card>
  );
}
