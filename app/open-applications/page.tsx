import type { Metadata } from "next";
import { getOpenApplications } from "@/lib/data";
import { ApplicationCard } from "@/components/cards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Open Applications",
  description: "Currently open Brazilian university and postgraduate application opportunities."
};

export default async function OpenApplicationsPage() {
  const applications = await getOpenApplications();
  return (
    <section className="container-shell py-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase text-brand-green">Open Applications</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Latest application calls</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Browse deadlines, requirements, application fees, documents, and official links managed from the admin dashboard.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {applications.map((application) => <ApplicationCard key={application.id} application={application} />)}
      </div>
    </section>
  );
}
