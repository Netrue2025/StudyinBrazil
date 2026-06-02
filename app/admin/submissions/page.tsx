import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateSubmissionStatus } from "@/lib/admin-actions";
import { parseList } from "@/lib/utils";
import { submissionStatuses } from "@/lib/constants";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Field, Select, Textarea } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";

export default async function AdminSubmissionsPage({ searchParams }: { searchParams: { status?: string } }) {
  requireAdmin();
  const submissions = await prisma.applicationSubmission.findMany({
    where: searchParams.status ? { status: searchParams.status } : undefined,
    include: { documents: true },
    orderBy: { createdAt: "desc" }
  });
  return (
    <>
      <AdminPageHeader title="Application Submissions" eyebrow="Student applications" />
      <form className="mb-5 flex max-w-xs gap-2">
        <Select name="status" defaultValue={searchParams.status || ""}>
          <option value="">All statuses</option>
          {submissionStatuses.map((status) => <option key={status}>{status}</option>)}
        </Select>
        <Button variant="outline">Filter</Button>
      </form>
      <div className="grid gap-4">
        {submissions.map((submission) => (
          <div key={submission.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 lg:flex-row">
              <div>
                <div className="flex flex-wrap gap-2"><Badge tone="green">{submission.status}</Badge><Badge>{submission.desiredDegreeLevel}</Badge></div>
                <h2 className="mt-3 text-xl font-bold text-slate-950">{submission.fullName}</h2>
                <p className="mt-1 text-sm text-slate-600">{submission.email} · {submission.phone}</p>
                <p className="mt-2 text-sm text-slate-600">{submission.nationality}, based in {submission.countryOfResidence}</p>
              </div>
              <div className="text-sm text-slate-500">{submission.createdAt.toLocaleString()}</div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Info label="Field" value={submission.fieldOfStudy} />
              <Info label="Preferred university" value={submission.preferredUniversity || "Not specified"} />
              <Info label="Preferred program" value={submission.preferredProgram || "Not specified"} />
              <Info label="State/city" value={submission.preferredStateCity || "Not specified"} />
              <Info label="Intake" value={submission.intendedIntakeYear || "Not specified"} />
              <Info label="Highest qualification" value={submission.highestQualification} />
            </div>
            <div className="mt-5">
              <h3 className="text-sm font-bold text-slate-700">Support needed</h3>
              <div className="mt-2 flex flex-wrap gap-2">{parseList(submission.supportNeeded).map((item) => <Badge key={item}>{item}</Badge>)}</div>
            </div>
            <div className="mt-5">
              <h3 className="text-sm font-bold text-slate-700">Uploaded documents</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {submission.documents.length ? submission.documents.map((doc) => (
                  <a key={doc.id} href={doc.fileUrl} target="_blank" className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                    {doc.documentType}
                  </a>
                )) : <span className="text-sm text-slate-500">No documents uploaded.</span>}
              </div>
            </div>
            <form action={updateSubmissionStatus} className="mt-5 grid gap-4 md:grid-cols-[220px_1fr_auto] md:items-end">
              <input type="hidden" name="id" value={submission.id} />
              <Field label="Status">
                <Select name="status" defaultValue={submission.status}>{submissionStatuses.map((status) => <option key={status}>{status}</option>)}</Select>
              </Field>
              <Field label="Internal notes"><Textarea name="internalNotes" defaultValue={submission.internalNotes || ""} /></Field>
              <Button>Update</Button>
            </form>
          </div>
        ))}
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md bg-slate-50 p-3"><p className="text-xs font-bold uppercase text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value}</p></div>;
}
