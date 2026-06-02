import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteServiceState } from "@/lib/admin-actions";
import { money } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { DeleteRecordForm } from "@/components/admin/form-controls";
import { ServiceForm } from "@/components/admin/service-form";

export default async function AdminServicesPage() {
  requireAdmin();
  let services: Awaited<ReturnType<typeof prisma.service.findMany>> = [];
  let loadError = "";

  try {
    services = await prisma.service.findMany({ orderBy: { title: "asc" } });
  } catch (error) {
    console.error("[StudyinBrazil admin services load error]", error);
    loadError = "Services could not be loaded from the database. You can still try creating a new service below.";
  }

  return (
    <>
      <AdminPageHeader title="Service Products" eyebrow="Manage paid services" />
      <ServiceForm />
      {loadError ? (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {loadError}
        </div>
      ) : null}
      <div className="mt-8 grid gap-4">
        {services.map((service) => (
          <details key={service.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <summary className="focus-ring cursor-pointer list-none rounded-lg px-5 py-4">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-bold text-slate-950">{service.title}</p>
                  <p className="text-sm text-slate-500">{money(service.price, service.currency)} - {service.deliveryTime}</p>
                </div>
                <span className="text-sm font-semibold text-brand-green">Expand to edit</span>
              </div>
            </summary>
            <div className="border-t border-slate-100 p-5">
              <ServiceForm
                service={{
                  id: service.id,
                  title: service.title,
                  slug: service.slug,
                  price: service.price / 100,
                  currency: service.currency,
                  deliveryTime: service.deliveryTime,
                  description: service.description,
                  includes: service.includes,
                  isActive: service.isActive
                }}
              />
              <DeleteRecordForm id={service.id} action={deleteServiceState} label="Delete service" />
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
