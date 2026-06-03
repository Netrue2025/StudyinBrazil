import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { money, parseList } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ServiceOrderForm } from "@/components/service-order-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const service = await prisma.service.findUnique({ where: { slug: params.slug } });
    return { title: service?.title || "Service Payment" };
  } catch {
    return { title: "Service Payment" };
  }
}

export default async function ServicePaymentPage({ params }: { params: { slug: string } }) {
  let service = null;
  const paymentProvider = process.env.PAYMENT_PROVIDER || process.env.PAYMENT_MODE || "manual";
  try {
    service = await prisma.service.findUnique({ where: { slug: params.slug } });
  } catch (error) {
    console.error("[StudyinBrazil service detail load error]", error);
  }
  if (!service) notFound();

  return (
    <section className="container-shell py-10">
      <div className="mb-6 text-sm font-semibold text-slate-500">
        <a href="/services" className="text-brand-green">Services</a> / {service.title}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <Badge tone="yellow">{service.deliveryTime}</Badge>
          <h1 className="mt-4 text-4xl font-black text-slate-950">{service.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{service.description}</p>
          <p className="mt-6 text-4xl font-black text-brand-green">{money(service.price, service.currency)}</p>
          <h2 className="mt-8 text-xl font-bold text-slate-950">What is included</h2>
          <ul className="mt-4 grid gap-3 text-slate-600">
            {parseList(service.includes).map((item) => <li key={item} className="rounded-md bg-slate-50 px-4 py-3">{item}</li>)}
          </ul>
        </article>
        <ServiceOrderForm serviceId={service.id} provider={paymentProvider} />
      </div>
    </section>
  );
}
