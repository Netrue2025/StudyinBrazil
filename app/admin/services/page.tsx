import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteService } from "@/lib/admin-actions";
import { money } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { ServiceForm } from "@/components/admin/service-form";

export default async function AdminServicesPage() {
  requireAdmin();
  const services = await prisma.service.findMany({ orderBy: { title: "asc" } });
  return (
    <>
      <AdminPageHeader title="Service Products" eyebrow="Manage paid services" />
      <ServiceForm />
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
              <form action={deleteService} className="mt-3">
                <input type="hidden" name="id" value={service.id} />
                <Button variant="outline" className="text-red-700 hover:border-red-200 hover:text-red-700">Delete</Button>
              </form>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
