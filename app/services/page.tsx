import type { Metadata } from "next";
import { getServices } from "@/lib/data";
import { ServiceCard } from "@/components/cards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description: "Paid application support services for CVs, research proposals, statements, document review, and full application support."
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <section className="container-shell py-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase text-brand-green">Support Services</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Pay for expert application support</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Choose the support you need. Manual payment mode is active by default and can be replaced later with Stripe, Paystack, or Flutterwave.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => <ServiceCard key={service.id} service={service} />)}
      </div>
    </section>
  );
}
