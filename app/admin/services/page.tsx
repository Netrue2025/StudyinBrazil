import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteService, saveService } from "@/lib/admin-actions";
import { money, parseList } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";

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
                  <p className="text-sm text-slate-500">{money(service.price, service.currency)} · {service.deliveryTime}</p>
                </div>
                <span className="text-sm font-semibold text-brand-green">Expand to edit</span>
              </div>
            </summary>
            <div className="border-t border-slate-100 p-5">
              <ServiceForm service={service} />
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

function ServiceForm({ service }: { service?: any }) {
  return (
    <form action={saveService} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      {service?.id ? <input type="hidden" name="id" value={service.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Title" className="xl:col-span-2"><Input name="title" defaultValue={service?.title} required /></Field>
        <Field label="Slug"><Input name="slug" defaultValue={service?.slug} /></Field>
        <Field label="Price"><Input name="price" type="number" step="0.01" defaultValue={service ? service.price / 100 : ""} required /></Field>
        <Field label="Currency"><Input name="currency" defaultValue={service?.currency || "USD"} /></Field>
        <Field label="Delivery time"><Input name="deliveryTime" defaultValue={service?.deliveryTime} required /></Field>
        <label className="mt-8 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input type="checkbox" name="isActive" defaultChecked={service?.isActive ?? true} className="h-4 w-4 accent-brand-green" />
          Active
        </label>
        <Field label="Description" className="md:col-span-2"><Textarea name="description" defaultValue={service?.description} required /></Field>
        <Field label="Includes" className="md:col-span-2"><Textarea name="includes" defaultValue={parseList(service?.includes).join("\n")} /></Field>
      </div>
      <Button className="mt-4">{service?.id ? "Save Service" : "Create Service"}</Button>
    </form>
  );
}
