import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteOpenApplicationState } from "@/lib/admin-actions";
import { toDateInput } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { DeleteRecordForm } from "@/components/admin/form-controls";
import { OpenApplicationForm } from "@/components/admin/open-application-form";

export default async function AdminOpenApplicationsPage() {
  requireAdmin();
  const [applications, universities, programs] = await Promise.all([
    prisma.openApplication.findMany({ include: { university: true, program: true }, orderBy: { createdAt: "desc" } }),
    prisma.university.findMany({ orderBy: { name: "asc" } }),
    prisma.program.findMany({ include: { university: true }, orderBy: { name: "asc" } })
  ]);
  return (
    <>
      <AdminPageHeader title="Open Applications / Adverts" eyebrow="Manage calls" />
      <OpenApplicationForm universities={universities} programs={programs} />
      <div className="mt-8 grid gap-4">
        {applications.map((application) => (
          <details key={application.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <summary className="focus-ring cursor-pointer list-none rounded-lg px-5 py-4">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-bold text-slate-950">{application.title}</p>
                  <p className="text-sm text-slate-500">{application.university.acronym} - {application.status} - {application.badge}</p>
                </div>
                <span className="text-sm font-semibold text-brand-green">Expand to edit</span>
              </div>
            </summary>
            <div className="border-t border-slate-100 p-5">
              <OpenApplicationForm
                application={{
                  id: application.id,
                  title: application.title,
                  universityId: application.universityId,
                  programId: application.programId,
                  summary: application.summary,
                  fullDescription: application.fullDescription,
                  requirements: application.requirements,
                  requiredDocuments: application.requiredDocuments,
                  howToApply: application.howToApply,
                  openingDate: toDateInput(application.openingDate),
                  deadline: toDateInput(application.deadline),
                  status: application.status,
                  badge: application.badge,
                  bannerImage: application.bannerImage,
                  officialLink: application.officialLink,
                  showInHero: application.showInHero
                }}
                universities={universities}
                programs={programs}
              />
              <DeleteRecordForm id={application.id} action={deleteOpenApplicationState} label="Delete open app" />
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
